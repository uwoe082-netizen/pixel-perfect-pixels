import type { PanggilanAktif } from "@/lib/simantri";

export function CallOverlay({ panggilan }: { panggilan: PanggilanAktif | null }) {
  if (!panggilan) return null;

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-panel-strong/95 backdrop-blur-sm">
      <div className="animate-overlay-in w-[72%] rounded-4xl border-4 border-primary bg-card px-16 py-14 text-center shadow-glow">
        <p className="text-4xl font-black uppercase tracking-[0.42em] text-primary animate-sweep bg-clip-text">
          Nomor Antrean Dipanggil
        </p>

        <p className="mt-8 font-display text-[13rem] leading-none font-black tabular-nums tracking-tight text-primary text-tv-shadow">
          {panggilan.nomor}
        </p>

        <div className="mt-8 inline-block rounded-2xl bg-primary px-14 py-5">
          <p className="font-display text-6xl font-black uppercase tracking-wide text-primary-foreground">
            {panggilan.nama_loket}
          </p>
        </div>

        <p className="mt-8 text-3xl font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Silakan menuju loket
        </p>
      </div>
    </div>
  );
}
