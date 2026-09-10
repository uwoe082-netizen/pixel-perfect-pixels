import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CallOverlay } from "@/components/tv/CallOverlay";
import { LoketCard } from "@/components/tv/LoketCard";
import { Ticker } from "@/components/tv/Ticker";
import { TvHeader } from "@/components/tv/TvHeader";
import { VideoPanel } from "@/components/tv/VideoPanel";
import { usePanggilan, useSimantri } from "@/hooks/useSimantri";
import { DAFTAR_LOKET, firebaseSiap, type PanggilanAktif, type StatusLoket } from "@/lib/simantri";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIMANTRI — Layar Antrean Ruang Tunggu" },
      {
        name: "description",
        content:
          "Layar TV antrean SIMANTRI: status enam loket, panggilan nomor antrean, video informasi, dan pengumuman berjalan secara real-time.",
      },
      { property: "og:title", content: "SIMANTRI — Layar Antrean Ruang Tunggu" },
      {
        property: "og:description",
        content:
          "Tampilan layar TV Full HD untuk sistem antrean kantor SIMANTRI dengan status loket dan panggilan real-time.",
      },
    ],
  }),
  component: LayarAntrean,
});

/** Simulasi panggilan berkala — hanya aktif saat memakai data contoh. */
function usePanggilanDemo(aktif: boolean): PanggilanAktif | null {
  const [demo, setDemo] = useState<PanggilanAktif | null>(null);

  useEffect(() => {
    if (!aktif) return;
    let n = 14;
    const buat = () => {
      const loket = DAFTAR_LOKET[Math.floor(Math.random() * 4)]!;
      n += 1;
      setDemo({
        id_loket: loket.id,
        nama_loket: loket.nama,
        nomor: `${loket.singkat}-${String(n).padStart(3, "0")}`,
        timestamp: Date.now(),
      });
    };
    const mulai = setTimeout(buat, 5000);
    const ulang = setInterval(buat, 30000);
    return () => {
      clearTimeout(mulai);
      clearInterval(ulang);
    };
  }, [aktif]);

  return demo;
}

function LayarAntrean() {
  const data = useSimantri();
  const demo = usePanggilanDemo(!firebaseSiap);
  const { panggilanTampil, sedangBersuara } = usePanggilan(
    firebaseSiap ? data.panggilanAktif : demo,
  );

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-background">
      <TvHeader />

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-4">
        <div className="grid shrink-0 grid-cols-6 gap-4">
          {DAFTAR_LOKET.map((loket) => {
            const entry = data.statusLoket[loket.id];
            const nonaktif = data.loketAktif[loket.id] === false;
            return (
              <LoketCard
                key={loket.id}
                loket={loket}
                nomor={entry?.nomor ?? "—"}
                status={(entry?.status as StatusLoket) ?? "tersedia"}
                nonaktif={nonaktif}
              />
            );
          })}
        </div>

        <VideoPanel playlist={data.playlistVideo} diredam={sedangBersuara} />
      </div>

      <Ticker teks={data.ticker} />

      <CallOverlay panggilan={panggilanTampil} />
    </main>
  );
}
