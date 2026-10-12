import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { LogoMark, type LogoMarkTone } from "./LogoMark";

/**
 * Знак + словесный знак «jalaqy» (Onest 800, строчными, −0.04em).
 *  onDark  — на хвое (сайдбар, тёмные плашки)
 *  onLight — на бумаге/белом, зелёный листок
 *  ink     — на креме лендинга, тёмный листок
 */
export type LogoVariant = "onDark" | "onLight" | "ink";

const variants: Record<LogoVariant, { tone: LogoMarkTone; text: string }> = {
  onDark: { tone: "paper", text: "text-on-ink" },
  onLight: { tone: "primary", text: "text-ink" },
  ink: { tone: "ink", text: "text-ink" },
};

export interface LogoProps {
  variant?: LogoVariant;
  /** Размер знака, px. Словесный знак — ~0.78 от него, если не задан явно. */
  size?: number;
  wordmarkSize?: number;
  className?: string;
}

export function Logo({ variant = "onLight", size = 32, wordmarkSize, className }: LogoProps) {
  const { tone, text } = variants[variant];
  const fontSize = wordmarkSize ?? Math.round(size * 0.78);
  return (
    <span
      className={cn("inline-flex items-center", text, className)}
      style={{ gap: Math.max(8, Math.round(size * 0.2)) }}
    >
      <LogoMark tone={tone} size={size} />
      <span className="font-display leading-none font-extrabold tracking-logo" style={{ fontSize }}>
        {t.brand.wordmark}
      </span>
    </span>
  );
}
