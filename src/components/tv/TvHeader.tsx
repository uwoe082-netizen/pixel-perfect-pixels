import { useJam } from "@/hooks/useSimantri";

export function TvHeader() {
  const { jam, detik, tanggal } = useJam();

  return (
    <header className="flex items-center justify-between gap-6 bg-panel-strong px-10 py-4 border-b-4 border-primary">
      <div className="flex items-center gap-5">
        <div className="grid size-[4.5rem] place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-3xl font-black shadow-glow">
          SM
        </div>
        <div>
          <h1 className="font-display text-[2.6rem] leading-none font-black tracking-tight text-primary text-tv-shadow">
            SIMANTRI
          </h1>
          <p className="mt-1 text-xl font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Sistem Antrean Pelayanan Terpadu
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="font-display text-[4rem] leading-none font-black tabular-nums text-foreground text-tv-shadow">
          {jam}
          <span className="ml-2 text-3xl text-primary tabular-nums">{detik}</span>
        </div>
        <p className="mt-1 text-2xl font-semibold text-muted-foreground">{tanggal}</p>
      </div>
    </header>
  );
}
