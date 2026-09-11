import { useJam } from "@/hooks/useSimantri";

export function TvHeader() {
  const { jam, detik, tanggal } = useJam();

  return (
    <header className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b-4 border-primary bg-panel-strong px-8 py-3">
      <div className="flex items-center gap-5">
        <div className="grid size-16 shrink-0 place-items-center border-2 border-primary bg-primary text-primary-foreground font-display text-3xl font-normal shadow-glow">
          SM
        </div>
        <div>
          <h1 className="font-display text-[2.8rem] leading-none font-normal text-primary text-tv-shadow">
            SIMANTRI
          </h1>
          <p className="mt-1 text-lg font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sistem Antrean Pelayanan Terpadu
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="font-display text-[3.6rem] leading-none font-normal tabular-nums text-foreground text-tv-shadow">
          {jam}
          <span className="ml-2 text-3xl text-primary tabular-nums">{detik}</span>
        </div>
        <p className="mt-1 text-2xl font-semibold text-muted-foreground">{tanggal}</p>
      </div>
    </header>
  );
}
