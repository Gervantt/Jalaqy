"use client";

import type { ReactNode, SelectHTMLAttributes } from "react";
import { controlClasses, describedBy, FieldShell, useFieldIds } from "./Field";
import { IconChevronDown } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: ReactNode;
  options: SelectOption[];
  hint?: ReactNode;
  error?: ReactNode;
  hideLabel?: boolean;
  /** Пустой первый пункт-подсказка. */
  placeholder?: string;
  fieldClassName?: string;
}

/** Нативный <select> в стиле полей: доступен с клавиатуры и удобен на телефоне. */
export function Select({
  id,
  label,
  options,
  hint,
  error,
  hideLabel,
  placeholder,
  required,
  className,
  fieldClassName,
  ...rest
}: SelectProps) {
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
        <select
          id={ids.id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, hint, error)}
          className={controlClasses(`appearance-none pr-11 ${className ?? ""}`)}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <IconChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
      </div>
    </FieldShell>
  );
}
