"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconAlert } from "./icons";

export interface FieldIds {
  id: string;
  hintId: string;
  errorId: string;
}

export function useFieldIds(id?: string): FieldIds {
  const auto = useId();
  const base = id ?? auto;
  return { id: base, hintId: `${base}-hint`, errorId: `${base}-error` };
}

/** aria-describedby из подсказки и ошибки (если есть). */
export function describedBy(ids: FieldIds, hint?: ReactNode, error?: ReactNode) {
  const list = [hint ? ids.hintId : null, error ? ids.errorId : null].filter(Boolean);
  return list.length ? list.join(" ") : undefined;
}

/** Общие классы текстовых полей. Рамка --field-border даёт контраст ≥3:1. */
export function controlClasses(className?: string) {
  return cn(
    "h-12 w-full min-w-0 rounded-field border border-field-border bg-surface px-4 text-base text-ink",
    "transition-colors placeholder:text-muted is-hover:border-ink",
    "focus-visible:border-primary",
    "aria-invalid:border-2 aria-invalid:border-danger",
    "disabled:cursor-not-allowed disabled:border-border disabled:bg-paper disabled:text-muted",
    className,
  );
}

export interface FieldMessagesProps {
  ids: FieldIds;
  hint?: ReactNode;
  error?: ReactNode;
}

export function FieldMessages({ ids, hint, error }: FieldMessagesProps) {
  return (
    <>
      {hint && !error && (
        <p id={ids.hintId} className="text-caption text-muted">
          {hint}
        </p>
      )}
      {hint && error && (
        <p id={ids.hintId} className="sr-only">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={ids.errorId}
          className="flex items-start gap-1.5 text-caption font-medium text-danger"
        >
          <IconAlert size={16} className="mt-px shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </>
  );
}

export interface FieldShellProps extends FieldMessagesProps {
  label: ReactNode;
  required?: boolean;
  /** Скрыть подпись визуально (остаётся для скринридера). */
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

/** Подпись + контрол + подсказка/ошибка. Контрол получает id и aria-* от вызывающего. */
export function FieldShell({
  ids,
  label,
  required,
  hideLabel,
  hint,
  error,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label
        htmlFor={ids.id}
        className={cn("text-sm font-semibold text-ink", hideLabel && "sr-only")}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {children}
      <FieldMessages ids={ids} hint={hint} error={error} />
    </div>
  );
}
