import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { LogoMark } from "./LogoMark";

/** Иконка приложения: знак на скруглённой плашке (радиус 28 при 120px). */
export interface AppIconProps {
  tone?: "ink" | "gold";
  size?: number;
  className?: string;
}

export function AppIcon({ tone = "ink", size = 120, className }: AppIconProps) {
  const label = tone === "gold" ? t.brand.appIconGoldLabel : t.brand.appIconLabel;
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        tone === "gold" ? "bg-accent" : "bg-ink",
        className,
      )}
      style={{ width: size, height: size, borderRadius: Math.round((size * 28) / 120) }}
    >
      <LogoMark tone={tone === "gold" ? "gold" : "paper"} size={Math.round((size * 2) / 3)} />
    </span>
  );
}
