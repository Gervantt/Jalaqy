import { cn } from "@/lib/cn";

/**
 * Знак Jalaqy — расчётный листок с загнутым углом и золотой галочкой.
 * Пути — из design/design/Main.dc.html (viewBox 64×64).
 *
 * tone — под какой фон:
 *  paper   — светлый листок на тёмном (сайдбар, тёмная иконка)
 *  primary — зелёный листок на светлом
 *  ink     — тёмный листок на светлом/креме (лендинг)
 *  gold    — тёмный листок с золотым углом на золотой плашке
 */
export type LogoMarkTone = "paper" | "primary" | "ink" | "gold";

const tones: Record<LogoMarkTone, { sheet: string; fold: string }> = {
  paper: { sheet: "fill-on-ink", fold: "stroke-ink" },
  primary: { sheet: "fill-primary", fold: "stroke-paper" },
  ink: { sheet: "fill-ink", fold: "stroke-paper" },
  gold: { sheet: "fill-ink", fold: "stroke-accent" },
};

export interface LogoMarkProps {
  tone?: LogoMarkTone;
  size?: number;
  className?: string;
  /** Если задан — знак озвучивается; иначе скрыт от скринридеров. */
  title?: string;
}

export function LogoMark({ tone = "primary", size = 32, className, title }: LogoMarkProps) {
  const { sheet, fold } = tones[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path
        d="M18 8 H38 L48 18 V54 a2 2 0 0 1 -2 2 H18 a2 2 0 0 1 -2 -2 V10 a2 2 0 0 1 2 -2 z"
        className={sheet}
      />
      <path d="M38 8 V18 H48" className={fold} strokeWidth="2.5" strokeLinejoin="round" />
      <path
        d="M23 35 L29.5 41.5 L41 28.5"
        className="stroke-accent"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
