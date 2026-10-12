import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
}

/** Пустое состояние: что здесь будет и что сделать первым. */
export function EmptyState({
  icon,
  title,
  children,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card-lg bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <span className="mb-1 flex size-14 items-center justify-center rounded-full bg-success-bg text-primary">
          {icon}
        </span>
      )}
      <Heading className="font-display text-xl font-bold tracking-display">{title}</Heading>
      {children && <div className="max-w-md text-body text-muted">{children}</div>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-2.5">{action}</div>}
    </div>
  );
}
