import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MobileContent } from "@/components/mobile/MobileShell";
import { Card, EmptyState, Skeleton } from "@/components/ui";
import { IconChevronRight, IconPayroll } from "@/components/ui/icons";
import { PayrollStatusBadge } from "@/app/app/_components/StatusBadges";
import { interpolate, t } from "@/i18n";
import { api } from "@/lib/api";
import { formatDate, formatTenge } from "@/lib/format";
import { requireEmployee } from "../session";

const h = t.mobile.history;
const VISIBLE = new Set(["approved", "paid", "closed"]);

export const metadata: Metadata = { title: h.title };

async function History() {
  const session = await requireEmployee();
  const slips = (await api.employees.payslips(session.employeeId)).filter((s) =>
    VISIBLE.has(s.status),
  );
  if (slips.length === 0) {
    return (
      <EmptyState icon={<IconPayroll size={26} />} title={t.mobile.me.none}>
        {t.mobile.me.noneText}
      </EmptyState>
    );
  }
  return (
    <Card padding="none" className="overflow-hidden">
      <ul aria-label={h.caption} className="m-0 flex list-none flex-col p-0">
        {slips.map((s) => {
          const month = formatDate(`${s.period}-01`, "monthYear");
          return (
            <li key={s.period} className="border-t border-divider first:border-t-0">
              <Link
                href={`/me?period=${s.period}`}
                aria-label={interpolate(h.open, { month })}
                className="flex min-h-16 items-center gap-3 px-4 py-3 text-ink no-underline is-hover:bg-paper"
              >
                <span className="flex flex-1 flex-col gap-1">
                  <span className="font-semibold">{month}</span>
                  <PayrollStatusBadge status={s.status} paidAt={s.paidAt} />
                </span>
                <span className="font-display text-lg font-extrabold tabular-nums">
                  {formatTenge(s.net)}
                </span>
                <IconChevronRight size={18} className="text-muted" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default function HistoryPage() {
  return (
    <MobileContent>
      <h1 className="font-display text-title font-extrabold tracking-display">{h.title}</h1>
      <Suspense fallback={<Skeleton className="h-96 rounded-card-lg" />}>
        <History />
      </Suspense>
    </MobileContent>
  );
}
