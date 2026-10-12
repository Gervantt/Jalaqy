import { t } from "@/i18n";

const r = t.styleguide.radiiItems;

const items = [
  { label: r.nav, px: "10", className: "rounded-nav" },
  { label: r.button, px: "12", className: "rounded-button" },
  { label: r.buttonLg, px: "14", className: "rounded-button-lg" },
  { label: r.card, px: "16", className: "rounded-card" },
  { label: r.cardLg, px: "18", className: "rounded-card-lg" },
  { label: r.sheet, px: "22", className: "rounded-sheet" },
  { label: r.icon, px: "28", className: "rounded-icon" },
  { label: r.pill, px: "999", className: "rounded-full" },
];

export function Radii() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((i) => (
        <li key={i.className} className="flex flex-col gap-2">
          <div className={`h-16 border-2 border-primary bg-surface ${i.className}`} />
          <div className="text-sm font-semibold tabular-nums">{i.px}px</div>
          <div className="text-caption text-muted">{i.label}</div>
        </li>
      ))}
    </ul>
  );
}
