import { useEffect, useRef, useState } from "react";

interface Props {
  playlist: string[];
  /** true saat suara panggilan berbunyi -> video diredam */
  diredam: boolean;
}

export function VideoPanel({ playlist, diredam }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [indeks, setIndeks] = useState(0);
  const [memuat, setMemuat] = useState(true);
  const [gagal, setGagal] = useState(false);

  const sumber = playlist.length > 0 ? playlist[indeks % playlist.length] : undefined;

  // Ganti sumber -> muat & putar otomatis (tanpa interaksi pengguna).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !sumber) return;
    setMemuat(true);
    setGagal(false);
    v.load();
    const putar = () => {
      void v.play().catch(() => {
        // Autoplay hanya diizinkan saat muted — TV terpasang tanpa operator.
        v.muted = true;
        void v.play().catch(() => setGagal(true));
      });
    };
    putar();
  }, [sumber]);

  // Redam suara saat panggilan berbunyi, kembali normal setelah selesai.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = diredam ? 0.05 : 0.6;
  }, [diredam, sumber]);

  const berikutnya = () => {
    if (playlist.length === 0) return;
    setIndeks((i) => (i + 1) % playlist.length);
  };

  return (
    <section className="relative flex-1 overflow-hidden rounded-2xl border-2 border-border bg-panel-strong shadow-tv">
      {sumber ? (
        <video
          ref={videoRef}
          key={sumber}
          className="size-full object-cover"
          src={sumber}
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setMemuat(false)}
          onPlaying={() => {
            setMemuat(false);
            setGagal(false);
          }}
          onEnded={berikutnya}
          onError={() => {
            setGagal(true);
            setMemuat(false);
            window.setTimeout(berikutnya, 4000);
          }}
        />
      ) : null}

      {memuat && !gagal ? (
        <div className="absolute inset-0 grid place-items-center bg-panel-strong">
          <div className="flex flex-col items-center gap-5">
            <span className="size-16 animate-spin rounded-full border-8 border-secondary border-t-primary" />
            <p className="text-2xl font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Memuat video…
            </p>
          </div>
        </div>
      ) : null}

      {gagal || !sumber ? (
        <div className="absolute inset-0 grid place-items-center bg-panel-strong px-10 text-center">
          <div>
            <p className="font-display text-6xl font-black text-primary text-tv-shadow">SIMANTRI</p>
            <p className="mt-4 text-3xl font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Melayani dengan cepat, ramah, dan transparan
            </p>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-panel-strong to-transparent" />
      <div className="pointer-events-none absolute bottom-4 left-6 rounded-lg bg-panel-strong/80 px-4 py-1.5 text-lg font-bold uppercase tracking-[0.18em] text-primary">
        Informasi Layanan
      </div>
    </section>
  );
}
