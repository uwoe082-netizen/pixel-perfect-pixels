export function Ticker({ teks }: { teks: string }) {
  const isi = teks?.trim() || "SIMANTRI — Sistem Antrean Pelayanan Terpadu";
  const durasi = Math.max(25, Math.round(isi.length / 4)) + "s";

  return (
    <footer className="flex h-16 shrink-0 items-stretch border-t-4 border-primary bg-panel-strong">
      <div className="flex shrink-0 items-center bg-primary px-8 font-display text-3xl font-normal uppercase tracking-[0.12em] text-primary-foreground">
        Info Terkini
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex h-full w-max animate-marquee items-center"
          style={{ ["--marquee-duration" as string]: durasi }}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className="whitespace-nowrap px-8 text-[1.55rem] font-semibold uppercase tracking-wide text-foreground"
            >
              {isi}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
