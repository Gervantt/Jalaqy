import { t } from "@/i18n";
import { contrastRatio } from "@/lib/color";
import { INK, PAPER, WHITE, type PaletteColor } from "@/lib/design/palette";

function Ratio({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const ratio = contrastRatio(fg, bg);
  const passes = ratio >= 4.5;
  return (
    <span className={passes ? "text-ink" : "text-muted"}>
      {label} {ratio.toFixed(1)}:1{passes ? " · AA" : ""}
    </span>
  );
}

export function Palette({ colors, columns = 4 }: { colors: PaletteColor[]; columns?: 3 | 4 }) {
  return (
    <ul
      className={
        columns === 4
          ? "grid grid-cols-2 gap-3 md:grid-cols-4"
          : "grid grid-cols-2 gap-3 md:grid-cols-3"
      }
    >
      {colors.map((c) => {
        const [name, usage] = t.styleguide.colors[c.key];
        return (
          <li key={c.key} className="flex min-w-0 flex-col gap-2">
            <div
              className="h-[72px] rounded-button border border-border"
              style={{ background: `var(${c.token})` }}
            />
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-caption break-words text-muted">
              {c.hex} · {usage}
            </div>
            <code className="text-xs text-muted">{c.token}</code>
            <div className="flex flex-col text-xs tabular-nums">
              <Ratio fg={c.hex} bg={WHITE} label={t.styleguide.contrastOnWhite} />
              <Ratio fg={c.hex} bg={PAPER} label={t.styleguide.contrastOnPaper} />
              <Ratio fg={c.hex} bg={INK} label={t.styleguide.contrastOnInk} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
