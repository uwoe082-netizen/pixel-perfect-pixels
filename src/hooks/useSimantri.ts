import { useEffect, useRef, useState } from "react";
import {
  DEMO_STATE,
  firebaseSiap,
  subscribeSimantri,
  type PanggilanAktif,
  type SimantriState,
} from "@/lib/simantri";

/** Data SIMANTRI real-time (jatuh ke data contoh bila Firebase belum dikonfigurasi). */
export function useSimantri(): SimantriState {
  const [state, setState] = useState<SimantriState>(DEMO_STATE);

  useEffect(() => {
    if (!firebaseSiap) return;
    setState((s) => ({ ...s, panggilanAktif: null }));
    return subscribeSimantri((patch) => setState((s) => ({ ...s, ...patch })));
  }, []);

  return state;
}

/** Jam & tanggal real-time dalam format Indonesia. */
export function useJam() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!now) return { jam: "--:--", detik: "--", tanggal: "" };

  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const detik = new Intl.DateTimeFormat("id-ID", { second: "2-digit" }).format(now);
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return { jam, detik: detik.padStart(2, "0"), tanggal };
}

const DURASI_OVERLAY = 8000;

/**
 * Menahan panggilan aktif di layar selama beberapa detik, memutar suara TTS,
 * dan memberi tahu kapan suara sedang berbunyi (untuk meredam video).
 */
export function usePanggilan(panggilan: PanggilanAktif | null) {
  const [tampil, setTampil] = useState<PanggilanAktif | null>(null);
  const [bersuara, setBersuara] = useState(false);
  const terakhir = useRef<string>("");

  useEffect(() => {
    if (!panggilan?.nomor) return;
    const kunci = `${panggilan.id_loket}|${panggilan.nomor}|${panggilan.timestamp ?? ""}`;
    if (kunci === terakhir.current) return;
    terakhir.current = kunci;

    setTampil(panggilan);
    const sembunyi = setTimeout(() => setTampil(null), DURASI_OVERLAY);

    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (synth) {
      setBersuara(true);
      synth.cancel();
      const eja = panggilan.nomor.replace(/-/g, " ").split("").join(" ");
      const ucapan = new SpeechSynthesisUtterance(
        `Nomor antrean, ${eja}, silakan menuju ${panggilan.nama_loket}`,
      );
      ucapan.lang = "id-ID";
      ucapan.rate = 0.9;
      const selesai = () => setBersuara(false);
      ucapan.onend = selesai;
      ucapan.onerror = selesai;
      synth.speak(ucapan);
      const jaring = setTimeout(selesai, DURASI_OVERLAY);
      return () => {
        clearTimeout(sembunyi);
        clearTimeout(jaring);
      };
    }

    return () => clearTimeout(sembunyi);
  }, [panggilan]);

  return { panggilanTampil: tampil, sedangBersuara: bersuara };
}
