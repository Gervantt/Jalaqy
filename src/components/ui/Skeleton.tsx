import { cn } from "@/lib/cn";

/** Плашка-заглушка на время загрузки. Родитель ставит aria-busy и текст для скринридера. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block animate-pulse rounded-nav bg-divider", className)}
    />
  );
}
