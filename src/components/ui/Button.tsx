import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";
/** md — 44px (минимум для касания), lg — 48px (как в дизайне), xl — 54px (главная кнопка на телефоне). */
export type ButtonSize = "md" | "lg" | "xl";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary font-bold text-white is-hover:bg-primary-hover",
  secondary:
    "border-[1.5px] border-border-strong bg-surface font-semibold text-ink is-hover:border-field-border is-hover:bg-paper",
  soft: "bg-success-bg font-bold text-success-text is-hover:bg-mint-line",
  ghost: "bg-transparent font-semibold text-primary is-hover:bg-success-bg",
  danger: "bg-danger font-bold text-white is-hover:bg-danger-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 rounded-button px-4 text-body",
  lg: "h-12 rounded-button px-5 text-body",
  xl: "h-[54px] rounded-button-lg px-6 text-lead",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/** Классы кнопки — общие для <button> и ссылки-кнопки. */
export function buttonClasses({
  variant = "primary",
  size = "lg",
  fullWidth,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap no-underline transition-colors select-none",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // ссылки-кнопки не перекрашиваются глобальным a:hover
    variant === "primary" || variant === "danger" ? "hover:text-white" : "",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, Omit<ButtonStyleOptions, "className"> {
  loading?: boolean;
  /** Иконка слева от текста. */
  icon?: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  icon,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {loading && <span className="sr-only">{t.ui.loading}</span>}
    </button>
  );
}

export interface ButtonLinkProps
  extends ComponentProps<typeof Link>, Omit<ButtonStyleOptions, "className"> {
  icon?: ReactNode;
}

/** Ссылка, которая выглядит как кнопка: для переходов, а не действий. */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth, className })} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
