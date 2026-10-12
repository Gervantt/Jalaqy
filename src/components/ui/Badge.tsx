import type { ReactNode } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { IconCheck, IconClock, IconClose } from "./icons";

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "primary";

const tones: Record<BadgeTone, string> = {
  success: "bg-success-bg text-success-text",
  warning: "bg-warning-bg text-warning-icon",
  danger: "bg-danger-bg text-danger",
  neutral: "border border-border bg-surface text-muted",
  primary: "border border-primary bg-surface text-primary",
};

export interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Пилюля 999px, 13px/700. */
export function Badge({ tone = "neutral", icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption leading-tight font-bold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export type Status = keyof typeof t.ui.status;

const statusMap: Record<Status, { tone: BadgeTone; icon?: ReactNode }> = {
  paid: { tone: "success", icon: <IconCheck size={14} strokeWidth={3} /> },
  approved: { tone: "success", icon: <IconCheck size={14} strokeWidth={3} /> },
  pending: { tone: "warning", icon: <IconClock size={14} strokeWidth={2.5} /> },
  new: { tone: "primary" },
  draft: { tone: "neutral" },
  rejected: { tone: "danger", icon: <IconClose size={14} strokeWidth={3} /> },
};

export interface StatusPillProps {
  status: Status;
  /** Своя подпись вместо стандартной: «Выплачено 5 ноя». */
  children?: ReactNode;
  className?: string;
}

/** «Выплачено», «Ждёт решения», «Новый»… */
export function StatusPill({ status, children, className }: StatusPillProps) {
  const { tone, icon } = statusMap[status];
  return (
    <Badge tone={tone} icon={icon} className={className}>
      {children ?? t.ui.status[status]}
    </Badge>
  );
}
