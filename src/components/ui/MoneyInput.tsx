"use client";

import { useLayoutEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { caretAfterDigits, digitsBefore } from "@/lib/format/caret";
import { formatNumber, parseTenge } from "@/lib/format/tenge";
import { controlClasses, describedBy, FieldShell, useFieldIds } from "./Field";

export interface MoneyInputProps {
  label: ReactNode;
  /** Контролируемое значение в тенге; null — пусто. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  max?: number;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  /** Крупный вариант (как в калькуляторе): Onest 800, 34px. */
  size?: "md" | "lg";
  className?: string;
  fieldClassName?: string;
  "data-preview"?: string;
}

const toText = (v: number | null | undefined) =>
  v === null || v === undefined ? "" : formatNumber(v);

/**
 * Поле суммы в тенге: «1 558 890 ₸». Пробелы расставляются при вводе,
 * курсор остаётся после той же цифры. Только целые неотрицательные суммы.
 */
export function MoneyInput({
  label,
  value,
  defaultValue = null,
  onValueChange,
  max = 100_000_000,
  hint,
  error,
  required,
  disabled,
  id,
  name,
  placeholder,
  size = "md",
  className,
  fieldClassName,
  ...rest
}: MoneyInputProps) {
  const ids = useFieldIds(id);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = value === undefined ? inner : value;
  const text = toText(current);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && pendingCaret.current !== null && document.activeElement === el) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current);
    }
    pendingCaret.current = null;
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const before = digitsBefore(raw, e.target.selectionStart ?? raw.length);
    const parsed = parseTenge(raw);
    const next = parsed === null ? null : Math.min(parsed, max);
    // ведущие нули схлопываются: курсор не дальше, чем цифр в новом числе
    const nextText = toText(next);
    pendingCaret.current = caretAfterDigits(nextText, before);
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  }

  return (
    <FieldShell
      ids={ids}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={fieldClassName}
    >
      <div className="relative">
        <input
          ref={inputRef}
          id={ids.id}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={text}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, hint, error)}
          className={controlClasses(
            cn(
              "pr-10 tabular-nums",
              size === "lg" &&
                "h-[66px] rounded-card font-display text-amount font-extrabold tracking-display",
              className,
            ),
          )}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted",
            size === "lg" && "font-display text-title-sm font-bold",
          )}
        >
          {t.common.currency}
        </span>
      </div>
    </FieldShell>
  );
}
