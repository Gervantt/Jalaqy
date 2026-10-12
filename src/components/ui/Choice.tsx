"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FieldMessages, useFieldIds } from "./Field";

interface ChoiceBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

function ChoiceRow({
  type,
  id,
  label,
  description,
  error,
  className,
  ...rest
}: ChoiceBaseProps & { type: "checkbox" | "radio" }) {
  const ids = useFieldIds(id);
  const descId = description ? `${ids.id}-desc` : undefined;
  const describedByIds =
    [descId, error ? ids.errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={ids.id}
        className={cn(
          "flex min-h-11 cursor-pointer items-start gap-3 py-2.5 text-body text-ink",
          rest.disabled && "cursor-not-allowed text-muted",
        )}
      >
        <input
          id={ids.id}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedByIds}
          className="mt-px size-5 shrink-0 cursor-[inherit] accent-primary"
          {...rest}
        />
        <span className="flex flex-col gap-0.5">
          <span>{label}</span>
          {description && (
            <span id={descId} className="text-caption text-muted">
              {description}
            </span>
          )}
        </span>
      </label>
      <FieldMessages ids={ids} error={error} />
    </div>
  );
}

export type CheckboxProps = ChoiceBaseProps;

export function Checkbox(props: CheckboxProps) {
  return <ChoiceRow type="checkbox" {...props} />;
}

export type RadioProps = ChoiceBaseProps;

export function Radio(props: RadioProps) {
  return <ChoiceRow type="radio" {...props} />;
}

export interface RadioGroupProps {
  legend: ReactNode;
  name: string;
  options: Array<{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  error?: ReactNode;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/** Группа радиокнопок: fieldset + legend, стрелки переключают выбор (нативно). */
export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  error,
  required,
  orientation = "vertical",
  className,
}: RadioGroupProps) {
  const errorId = useId();
  return (
    <fieldset
      className={cn("m-0 flex min-w-0 flex-col gap-1 border-0 p-0", className)}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1 p-0 text-sm font-semibold text-ink">
        {legend}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </legend>
      <div className={cn("flex", orientation === "horizontal" ? "flex-wrap gap-x-6" : "flex-col")}>
        {options.map((o) => (
          <Radio
            key={o.value}
            name={name}
            value={o.value}
            label={o.label}
            description={o.description}
            disabled={o.disabled}
            required={required}
            checked={value === undefined ? undefined : value === o.value}
            defaultChecked={defaultValue === undefined ? undefined : defaultValue === o.value}
            onChange={onValueChange ? () => onValueChange(o.value) : undefined}
          />
        ))}
      </div>
      {error && (
        <FieldMessages ids={{ id: errorId, hintId: `${errorId}-h`, errorId }} error={error} />
      )}
    </fieldset>
  );
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label: ReactNode;
  description?: ReactNode;
}

/**
 * Переключатель: нативный чекбокс с role="switch" — работает без JS,
 * пробел переключает, скринридер озвучивает «вкл/выкл».
 */
export function Switch({ id, label, description, className, ...rest }: SwitchProps) {
  const ids = useFieldIds(id);
  const descId = description ? `${ids.id}-desc` : undefined;
  return (
    <label
      htmlFor={ids.id}
      className={cn(
        "flex min-h-11 cursor-pointer items-center justify-between gap-4 py-2 text-body text-ink",
        rest.disabled && "cursor-not-allowed text-muted",
        className,
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span>{label}</span>
        {description && (
          <span id={descId} className="text-caption text-muted">
            {description}
          </span>
        )}
      </span>
      <input
        id={ids.id}
        type="checkbox"
        role="switch"
        aria-describedby={descId}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full bg-field-border transition-colors",
          "peer-checked:bg-primary peer-disabled:opacity-50",
          "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus)",
          "peer-data-[preview~=focus]:outline-3 peer-data-[preview~=focus]:outline-offset-2 peer-data-[preview~=focus]:outline-(--focus)",
          "peer-checked:[&>span]:translate-x-5",
        )}
      >
        <span className="absolute top-1 left-1 size-5 rounded-full bg-white transition-transform" />
      </span>
    </label>
  );
}
