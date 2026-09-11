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
        "relative grid min-h-0 grid-cols-[0.65rem_minmax(0,1fr)_auto] items-stretch overflow-hidden border-b border-border bg-card last:border-b-0",
        status === "melayani" && !nonaktif && "bg-secondary animate-loket-pulse",
        nonaktif && "opacity-40 saturate-50",
      )}
    >
      <div className={cn("h-full w-full", s.strip)} />
      <div className="flex min-w-0 flex-col justify-center px-5 py-2">
        <h2 className="truncate font-display text-[1.75rem] leading-none font-normal uppercase text-foreground">
          {loket.nama}
        </h2>
        <span className={cn("mt-1 w-fit text-[0.82rem] font-extrabold uppercase tracking-[0.12em]", s.nomor)}>
          {LABEL_STATUS[nonaktif ? "offline" : status]}
        </span>
      </div>
      <div className="flex min-w-[9.2rem] items-center justify-end border-l border-border px-5">
        <span
          className={cn(
            "font-display text-[3.2rem] leading-none font-normal tabular-nums text-tv-shadow",
            s.nomor,
          )}
        >
          {nonaktif ? "—" : nomor || "—"}
        </span>
      </div>
    </article>
  );
}
