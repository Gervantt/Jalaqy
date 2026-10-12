import type { KeyboardEvent } from "react";

/**
 * Клавиатура для вкладок (WAI-ARIA tabs): стрелки переключают и переводят фокус,
 * Home/End — к первой/последней. Вызывать в onKeyDown у tablist.
 */
export function rovingKeyDown(
  event: KeyboardEvent<HTMLElement>,
  count: number,
  index: number,
  select: (next: number) => void,
  orientation: "horizontal" | "vertical" = "horizontal",
) {
  const prev = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
  const next = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
  let target: number | null = null;
  if (event.key === next) target = (index + 1) % count;
  else if (event.key === prev) target = (index - 1 + count) % count;
  else if (event.key === "Home") target = 0;
  else if (event.key === "End") target = count - 1;
  if (target === null) return;
  event.preventDefault();
  select(target);
  const tabs = event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs[target]?.focus();
}
