import { Skeleton } from "@/components/ui";
import { t } from "@/i18n";

/** Скелетон страницы панели: заголовок, плитки, таблица. */
export function PageSkeleton({ kpis = 3, rows = 6 }: { kpis?: number; rows?: number }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-5">
      <span className="sr-only" role="status">
        {t.ui.loading}
      </span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-9 w-80 max-w-full" />
      </div>
      {kpis > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {Array.from({ length: kpis }, (_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-card bg-surface px-5 py-[18px]">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-48" />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-1 rounded-card-lg bg-surface p-4">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-t border-divider py-3 first:border-t-0"
          >
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
