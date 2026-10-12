import { t } from "@/i18n";
import { formatCount, formatDate, formatPeriod, formatTenge } from "@/lib/format";

const examples: Array<[string, string]> = [
  ["formatTenge(1558890)", formatTenge(1558890)],
  ["formatTenge(-32000)", formatTenge(-32000)],
  ['formatTenge(40000, { sign: "always" })', formatTenge(40000, { sign: "always" })],
  ['formatDate("2026-11-05")', formatDate("2026-11-05")],
  ['formatDate("2026-11-05", "short")', formatDate("2026-11-05", "short")],
  ['formatDate("2026-10-01", "monthYear")', formatDate("2026-10-01", "monthYear")],
  ['formatDate("2026-11-05", "numeric")', formatDate("2026-11-05", "numeric")],
  ['formatPeriod("2026-10-01", "2026-10-31")', formatPeriod("2026-10-01", "2026-10-31")],
  ['formatPeriod("2026-10-28", "2026-11-03")', formatPeriod("2026-10-28", "2026-11-03")],
  ["formatCount(6, employees)", formatCount(6, t.plural.employees)],
  ["formatCount(21, employees)", formatCount(21, t.plural.employees)],
];

export function Formatting() {
  return (
    <div
      className="relative overflow-x-auto rounded-card-lg bg-surface"
      tabIndex={0}
      role="region"
      aria-label={`${t.styleguide.sections.formatting}. ${t.ui.scrollableTable}`}
    >
      <table className="w-full min-w-[560px] border-collapse text-body">
        <tbody>
          {examples.map(([code, out]) => (
            <tr key={code} className="border-t border-divider first:border-t-0">
              <td className="px-4 py-3">
                <code className="text-sm text-muted">{code}</code>
              </td>
              <td className="px-4 py-3 text-right font-semibold">{out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
