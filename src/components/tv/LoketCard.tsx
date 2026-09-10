import { LABEL_STATUS, type LoketDef, type StatusLoket } from "@/lib/simantri";
import { cn } from "@/lib/utils";

const STYLE_STATUS: Record<StatusLoket, { chip: string; nomor: string; strip: string }> = {
  tersedia: {
    chip: "bg-status-tersedia text-status-tersedia-foreground",
    nomor: "text-foreground",
    strip: "bg-status-tersedia",
  },
  melayani: {
    chip: "bg-status-melayani text-status-melayani-foreground",
    nomor: "text-primary",
    strip: "bg-status-melayani",
  },
  selesai: {
    chip: "bg-status-selesai text-status-selesai-foreground",
    nomor: "text-foreground",
    strip: "bg-status-selesai",
  },
  offline: {
    chip: "bg-status-offline text-status-offline-foreground",
    nomor: "text-muted-foreground",
    strip: "bg-status-offline",
  },
};

interface Props {
  loket: LoketDef;
  nomor: string;
  status: StatusLoket;
  nonaktif: boolean;
}

export function LoketCard({ loket, nomor, status, nonaktif }: Props) {
  const s = STYLE_STATUS[status];

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-tv",
        status === "melayani" && !nonaktif && "border-primary animate-loket-pulse",
        nonaktif && "opacity-40 saturate-50",
      )}
    >
      <div className={cn("h-2 w-full", s.strip)} />

      <div className="flex items-center justify-between px-5 pt-3">
        <h2 className="font-display text-[1.7rem] leading-none font-black uppercase tracking-wide text-foreground">
          {loket.nama}
        </h2>
        <span className="grid size-9 place-items-center rounded-lg bg-secondary text-base font-black text-primary">
          {loket.singkat}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-1">
        <span
          className={cn(
            "font-display text-[4.6rem] leading-none font-black tabular-nums tracking-tight text-tv-shadow",
            s.nomor,
          )}
        >
          {nonaktif ? "—" : nomor || "—"}
        </span>
      </div>

      <div
        className={cn(
          "px-5 py-2 text-center text-[1.15rem] font-black uppercase tracking-[0.14em]",
          s.chip,
        )}
      >
        {LABEL_STATUS[nonaktif ? "offline" : status]}
      </div>
    </article>
  );
}
