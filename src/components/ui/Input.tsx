"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { controlClasses, describedBy, FieldShell, useFieldIds } from "./Field";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  /** Текст или иконка справа внутри поля (например, «₸»). */
  endAdornment?: ReactNode;
  /** Иконка слева внутри поля. */
  startAdornment?: ReactNode;
  fieldClassName?: string;
}

export function Input({
  id,
  label,
  hint,
  error,
  hideLabel,
  endAdornment,
  startAdornment,
  required,
  className,
  fieldClassName,
  ...rest
}: InputProps) {
  const ids = useFieldIds(id);
  return (
    <FieldShell
      ids={ids}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={fieldClassName}
    >
      <div className="relative">
        {startAdornment && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted">
            {startAdornment}
          </span>
        )}
        <input
          id={ids.id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, hint, error)}
          className={controlClasses(
            cn(startAdornment ? "pl-11" : "", endAdornment ? "pr-10" : "", className),
          )}
          {...rest}
        />
        {endAdornment && (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
            {endAdornment}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

export type DatePickerProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> & {
  /** Дата в формате ГГГГ-ММ-ДД. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (iso: string) => void;
  min?: string;
  max?: string;
};

/** Простой выбор даты на нативном <input type="date">: клавиатура и скринридеры из коробки. */
export function DatePicker({ onValueChange, ...rest }: DatePickerProps) {
  return (
    <Input
      type="date"
      onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
      {...rest}
    />
  );
}
