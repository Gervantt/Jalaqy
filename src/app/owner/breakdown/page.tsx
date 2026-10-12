import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MobileContent } from "@/components/mobile/MobileShell";
import { Card, Skeleton } from "@/components/ui";
import { IconChevronLeft } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { api } from "@/lib/api";
import { currentPeriod } from "@/lib/clock";
import { formatCount, formatNumber, formatTenge, monthName } from "@/lib/format";
import { parsePeriod } from "@/lib/period";
import { requireSession } from "@/lib/session";

const o = t.mobile.owner;

export const metadata: Metadata = { title: o.breakdownTitle };

async function Breakdown() {
  await requireSession(["owner"]);
  const period = currentPeriod();
  const run = await api.payroll.get(period);
  const { year, monthIndex } = parsePeriod(period);
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {run.lines.map((l) => (
        <Card as="li" key={l.employeeId} padding="sm" className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="font-semibold">{l.shortName}</span>
              <span className="text-caption text-muted">{l.position}</span>
            </div>
            <span className="font-display text-xl font-extrabold tracking-display tabular-nums">
              {formatTenge(l.net)}
            </span>
          </div>
          <dl className="m-0 grid grid-cols-3 gap-2 border-t border-divider pt-2 text-caption">
            {[
              [o.gross, l.gross],
              [o.withheld, l.employee.total],
              [o.employer, l.employer.total],
            ].map(([label, value]) => (
              <div key={label as string} className="flex flex-col">
                <dt className="text-muted">{label}</dt>
                <dd className="m-0 font-semibold tabular-nums">{formatNumber(value as number)}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
      <li className="sr-only">
        {interpolate(o.breakdownMeta, {
          month: `${monthName(monthIndex)} ${year}`,
          count: formatCount(run.lines.length, t.plural.employees),
        })}
      </li>
    </ul>
  );
}

export default function BreakdownPage() {
  return (
    <MobileContent>
      <Link
        href="/owner"
        className="-ml-1 inline-flex min-h-11 items-center gap-1 self-start text-sm font-semibold no-underline"
      >
        <IconChevronLeft size={18} />
        {o.backToSummary}
      </Link>
      <h1 className="font-display text-title font-extrabold tracking-display">
        {o.breakdownTitle}
      </h1>
      <Suspense
        fallback={
          <div className="flex flex-col gap-2.5" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-24 rounded-card-lg" />
            ))}
          </div>
        }
      >
        <Breakdown />
      </Suspense>
    </MobileContent>
  );
}
