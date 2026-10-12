import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type IconButtonVariant = "surface" | "ghost" | "onInk";

const variants: Record<IconButtonVariant, string> = {
  surface: "bg-surface text-ink is-hover:bg-success-bg",
  ghost: "bg-transparent text-ink is-hover:bg-success-bg",
  onInk: "bg-transparent text-on-ink is-hover:bg-ink-hover",
};

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> {
  /** Обязательная подпись для скринридера: у кнопки нет видимого текста. */
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: 44 | 48;
}

export function IconButton({
  label,
  icon,
  variant = "surface",
  size = 44,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-button transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === 44 ? "size-11" : "size-12",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
