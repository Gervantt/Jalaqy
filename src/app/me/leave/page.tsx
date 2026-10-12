import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileContent } from "@/components/mobile/MobileShell";
import { Card, Skeleton } from "@/components/ui";
import { AbsenceStatusBadge } from "@/app/app/_components/StatusBadges";
import { interpolate, t } from "@/i18n";
import { api } from "@/lib/api";
import { today } from "@/lib/clock";
import { formatCount, formatPeriod } from "@/lib/format";
import { requireEmployee } from "../session";
import { LeaveForm } from "./LeaveForm";

const l = t.mobile.leave;

export const metadata: Metadata = { title: l.title };

async function LeaveView() {
  const session = await requireEmployee();
  const [employee, absences] = await Promise.all([
    api.employees.get(session.employeeId),
    api.timesheet.absences({ employeeId: session.employeeId }),
  ]);
  return (
    <>
      <p className="text-body text-muted">
        {interpolate(l.available, { days: formatCount(employee.vacationDaysLeft, t.plural.days) })}
      </p>
      <LeaveForm minDate={today()} />
      <Card as="section" aria-labelledby="leave-mine" padding="md" className="flex flex-col gap-2">
        <h2
          id="leave-mine"
          className="text-caption font-bold tracking-[0.06em] text-muted uppercase"
        >
          {l.mine}
        </h2>
        {absences.length === 0 ? (
          <p className="text-body text-muted">{l.empty}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {absences.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 border-t border-divider py-2.5 first:border-t-0"
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{t.domain.absenceTypes[a.type]}</span>
                  <span className="text-sm text-muted">{formatPeriod(a.from, a.to)}</span>
                </span>
                <AbsenceStatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

export default function LeavePage() {
  return (
    <MobileContent>
      <h1 className="font-display text-title font-extrabold tracking-display">{l.title}</h1>
      <Suspense fallback={<Skeleton className="h-80 rounded-card-lg" />}>
        <LeaveView />
      </Suspense>
    </MobileContent>
  );
}
