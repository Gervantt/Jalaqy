import { t } from "@/i18n";

const s = t.styleguide.typeSamples;

/** Шкала из дизайна. Подписи — технические, не переводятся. */
const rows = [
  {
    spec: "Onest 800 · 34 · −0.02em",
    className: "font-display text-amount font-extrabold tracking-display tabular-nums",
    sample: s.amount,
  },
  {
    spec: "Onest 800 · 32 · −0.02em · H1",
    className: "font-display text-h1 font-extrabold tracking-display",
    sample: s.display,
  },
  {
    spec: "Onest 800 · 30 · KPI",
    className: "font-display text-3xl font-extrabold tabular-nums",
    sample: s.amount,
  },
  {
    spec: "Onest 800 · 26 · заголовок на телефоне",
    className: "font-display text-title font-extrabold tracking-display",
    sample: s.display,
  },
  { spec: "Onest 700 · 20", className: "font-display text-xl font-bold", sample: s.display },
  { spec: "Onest 500 · 18", className: "font-display text-lg font-medium", sample: s.display },
  { spec: "Golos 400 · 17 · лид", className: "text-lead", sample: s.body },
  { spec: "Golos 400 · 15 · интерфейс", className: "text-body", sample: s.body },
  {
    spec: "Golos 600 · 15 · акцент в строке",
    className: "text-body font-semibold",
    sample: s.caption,
  },
  { spec: "Golos 600 · 14 · подпись поля", className: "text-sm font-semibold", sample: s.caption },
  { spec: "Golos 400 · 13 · вторичный", className: "text-caption text-muted", sample: s.caption },
  {
    spec: "Golos 700 · 13 · надзаголовок",
    className: "text-caption font-bold tracking-[0.06em] text-muted uppercase",
    sample: s.caption,
  },
  { spec: "Golos 700 · 12 · таббар", className: "text-xs font-bold", sample: s.caption },
];

export function Typography() {
  return (
    <div className="flex flex-col divide-y divide-divider rounded-card-lg bg-surface px-4 md:px-6">
      {rows.map((r) => (
        <div
          key={r.spec}
          className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6"
        >
          <code className="text-xs text-muted md:w-64 md:shrink-0">{r.spec}</code>
          <div className={`min-w-0 break-words ${r.className}`}>{r.sample}</div>
        </div>
      ))}
    </div>
  );
}
