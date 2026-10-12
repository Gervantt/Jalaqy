import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface StateItem {
  label: string;
  node: ReactNode;
}

/** Ряд состояний компонента с подписью над каждым. */
export function StateRow({
  items,
  className,
  itemClassName,
}: {
  items: StateItem[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end gap-x-5 gap-y-4", className)}>
      {items.map((i) => (
        <div key={i.label} className={cn("flex min-w-0 flex-col gap-2", itemClassName)}>
          <span className="text-xs font-semibold text-muted">{i.label}</span>
          {i.node}
        </div>
      ))}
    </div>
  );
}

export function DemoPanel({
  title,
  children,
  tone = "surface",
  className,
}: {
  title?: string;
  children: ReactNode;
  tone?: "surface" | "paper" | "ink";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-card-lg p-4 md:p-6",
        tone === "surface" && "bg-surface",
        tone === "paper" && "border border-border bg-paper",
        tone === "ink" && "on-ink bg-ink text-on-ink",
        className,
      )}
    >
      {title && <h3 className="text-sm font-bold">{title}</h3>}
      {children}
    </div>
  );
}
