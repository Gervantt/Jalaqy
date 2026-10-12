import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardTone = "surface" | "ink";
export type CardPadding = "none" | "sm" | "md" | "lg";

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-5 md:p-6",
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "aside" | "li";
  tone?: CardTone;
  padding?: CardPadding;
  /** 16 / 18 / 22 px — карточки 16–22 по дизайну. */
  radius?: "card" | "card-lg" | "sheet";
  children?: ReactNode;
}

const radii = { card: "rounded-card", "card-lg": "rounded-card-lg", sheet: "rounded-sheet" };

/** Карточка без теней: белая на бумаге или тёмная (хвоя). */
export function Card({
  as: Tag = "div",
  tone = "surface",
  padding = "md",
  radius = "card-lg",
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "min-w-0",
        tone === "ink" ? "on-ink bg-ink text-on-ink" : "bg-surface text-ink",
        radii[radius],
        paddings[padding],
        className,
      )}
      {...rest}
    />
  );
}

/** Заголовок-надпись карточки: «ЧТО ИЗМЕНИЛОСЬ С СЕНТЯБРЯ». */
export function CardEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-caption font-bold tracking-[0.06em] text-muted uppercase", className)}>
      {children}
    </h2>
  );
}
