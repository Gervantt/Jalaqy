import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { IconCheck } from "./icons";

export interface StepperProps {
  steps: string[];
  /** Индекс текущего шага (0…). Шаги до него — выполнены. */
  current: number;
  label?: string;
  className?: string;
}

/** Табель → Расчёт → Выплата → Налоги. Не кликабелен, поэтому высота 40 как в дизайне. */
export function Stepper({ steps, current, label = t.ui.stepper.label, className }: StepperProps) {
  return (
    <ol aria-label={label} className={cn("m-0 flex list-none flex-wrap gap-2 p-0", className)}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li
            key={step}
            aria-current={state === "current" ? "step" : undefined}
            className={cn(
              "flex h-10 items-center gap-2 rounded-full px-3.5 text-sm",
              state === "done" && "bg-success-bg font-semibold text-primary",
              state === "current" && "bg-ink font-bold text-white",
              state === "todo" && "border border-border bg-surface font-semibold text-muted",
            )}
          >
            {state === "done" ? (
              <>
                <IconCheck size={16} strokeWidth={2.6} />
                {step}
                <span className="sr-only">, {t.ui.stepper.done}</span>
              </>
            ) : (
              <>
                {i + 1} · {step}
                {state === "current" && <span className="sr-only">, {t.ui.stepper.current}</span>}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
