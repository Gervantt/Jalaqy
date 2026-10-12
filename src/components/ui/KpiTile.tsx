import type { ReactNode } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { formatTenge } from "@/lib/format/tenge";
import { Skeleton } from "./Skeleton";

export interface KpiTileProps {
  label: ReactNode;
  /** Сумма в тенге (форматируется) или готовая строка. */
  value: number | string;
  hint?: ReactNode;
  tone?: "surface" | "ink";
  loading?: boolean;
  className?: string;
}

/** Плитка показателя: «К выплате сотрудникам — 1 558 890 ₸». */
export function KpiTile({
  label,
  value,
  hint,
  tone = "surface",
  loading,
  className,
}: KpiTileProps) {
  const ink = tone === "ink";
  return (
    <div
      aria-busy={loading || undefined}
      className={cn(
        "flex min-w-0 flex-col gap-1.5 rounded-card px-5 py-[18px]",
        ink ? "on-ink bg-ink text-on-ink" : "bg-surface text-ink",
        className,
      )}
    >
      <div className={cn("text-sm", ink ? "text-on-ink-muted" : "text-muted")}>{label}</div>
      {loading ? (
        <>
          <Skeleton className={cn("my-1 h-8 w-44", ink && "bg-ink-hover")} />
          <span className="sr-only">{t.ui.loading}</span>
        </>
      ) : (
        <div className="font-display text-3xl leading-tight font-extrabold tracking-display break-words tabular-nums">
          {typeof value === "number" ? formatTenge(value) : value}
        </div>
      )}
      {hint && (
        <div className={cn("text-caption", ink ? "text-on-ink-muted" : "text-muted")}>{hint}</div>
      )}
    </div>
  );
}
