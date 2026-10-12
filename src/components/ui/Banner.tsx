import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconAlert, IconCheck, IconClock, IconInfo } from "./icons";

export type BannerTone = "warning" | "success" | "danger" | "info";

const tones: Record<BannerTone, { box: string; icon: string; Icon: typeof IconClock }> = {
  warning: { box: "bg-warning-bg text-warning-text", icon: "text-warning-icon", Icon: IconClock },
  success: { box: "bg-success-bg text-success-text", icon: "text-primary", Icon: IconCheck },
  danger: { box: "bg-danger-bg text-danger", icon: "text-danger", Icon: IconAlert },
  info: { box: "bg-surface text-ink", icon: "text-primary", Icon: IconInfo },
};

export interface BannerProps {
  tone?: BannerTone;
  /** Жирная часть: «Налоги и взносы за октябрь — до 25 ноября.» */
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  /** status — для динамических сообщений; alert — для срочных ошибок. */
  role?: "status" | "alert";
  className?: string;
}

/** Плашка-напоминание (жёлтая — о сроках). */
export function Banner({
  tone = "warning",
  title,
  children,
  action,
  icon,
  role,
  className,
}: BannerProps) {
  const { box, icon: iconClass, Icon } = tones[tone];
  return (
    <div
      role={role}
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-button-lg px-[18px] py-3.5",
        box,
        className,
      )}
    >
      <span className={cn("shrink-0", iconClass)}>{icon ?? <Icon size={20} />}</span>
      <div className="min-w-0 flex-[1_1_240px] text-body">
        {title && <b className="font-bold">{title}</b>} {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
