import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MobileContent } from "@/components/mobile/MobileShell";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { Card, EmptyState, Skeleton, StatusPill } from "@/components/ui";
import { IconArrowRight, IconDocument, IconPayroll, IconSun } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { api, isApiError } from "@/lib/api";
import type { Payslip } from "@/lib/api/contracts";
import { formatCount, formatDate, formatTenge } from "@/lib/format";
import { isPeriod } from "@/lib/period";
import { requireEmployee } from "./session";

const m = t.mobile.me;

export const metadata: Metadata = { title: m.tabs.payslip };

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 text-body ${strong ? "font-semibold" : ""}`}>
      <span className={strong ? "" : "text-muted"}>{label}</span>
      <span className="tabular-nums">{formatTenge(value)}</span>
    </div>
  );
}

function PayslipCard({ slip }: { slip: Payslip }) {
  const { line } = slip;
  const paid = slip.status === "paid" || slip.status === "closed";
  const date = formatDate((slip.paidAt ?? slip.payDate).slice(0, 10), "short");
  return (
    <Card radius="sheet" padding="md" className="flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted">{m.toCard}</div>
          <div className="font-display text-amount font-extrabold tracking-display tabular-nums">
            {formatTenge(line.net)}
          </div>
        </div>
        {paid ? (
          <StatusPill status="paid">{interpolate(m.paid, { date })}</StatusPill>
        ) : (
          <StatusPill status="pending">{interpolate(m.willPay, { date })}</StatusPill>
        )}
      </div>
      <div aria-hidden="true" className="h-px bg-divider" />
      <Line label={m.gross} value={line.gross} strong />
      <Line label={m.opv} value={-line.employee.opv} />
      <Line label={m.vosms} value={-line.employee.vosms} />
      <Line label={m.ipn} value={-line.employee.ipn} />
    </Card>
  );
}

async function PayslipView({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const session = await requireEmployee();
  const sp = await searchParams;
  const [employee, slip] = await Promise.all([
    api.employees.get(session.employeeId),
    api.employees
      .payslip(session.employeeId, isPeriod(sp.period) ? sp.period : undefined)
      .catch((e: unknown) => {
        if (isApiError(e) && e.status === 404) return null;
        throw e;
      }),
  ]);

  const tiles = [
    {
      href: "/me/leave",
      icon: <IconSun size={22} />,
      title: m.vacation,
      hint: interpolate(m.vacationLeft, {
        days: formatCount(employee.vacationDaysLeft, t.plural.days),
      }),
    },
    {
      href: "/me/certificate",
      icon: <IconDocument size={22} />,
      title: m.certificate,
      hint: m.certificateHint,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="text-sm text-muted">
          {employee.shortName} · {employee.position}
        </div>
        <h1 className="font-display text-title font-extrabold tracking-display">
          {slip ? formatDate(`${slip.period}-01`, "monthYear") : m.none}
        </h1>
      </div>

      {slip ? (
        <>
          <PayslipCard slip={slip} />
          <Card tone="ink" padding="none" className="flex flex-col gap-1.5 px-[18px] py-4">
            <div className="text-sm text-on-ink-soft">{m.employerPaid}</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-accent tabular-nums">
                {formatTenge(slip.line.employer.total)}
              </span>
              <span className="text-sm text-on-ink-soft">{m.employerHint}</span>
            </div>
          </Card>
        </>
      ) : (
        <EmptyState icon={<IconPayroll size={26} />} title={m.none} headingLevel={2}>
          {m.noneText}
        </EmptyState>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="flex min-h-[88px] flex-col items-start justify-between gap-2 rounded-card bg-surface p-3.5 text-ink no-underline is-hover:bg-success-bg"
          >
            <span className="text-primary">{tile.icon}</span>
            <span className="flex flex-col">
              <span className="text-body font-semibold">{tile.title}</span>
              <span className="text-caption text-muted">{tile.hint}</span>
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/me/history"
        className="inline-flex min-h-11 items-center gap-1.5 self-start text-body font-semibold no-underline"
      >
        {m.history}
        <IconArrowRight size={18} />
      </Link>
      <InstallPrompt />
    </>
  );
}

function PayslipSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3.5">
      <span className="sr-only" role="status">
        {t.ui.loading}
      </span>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-64 rounded-sheet" />
      <Skeleton className="h-20 rounded-card-lg" />
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-[88px] rounded-card" />
        <Skeleton className="h-[88px] rounded-card" />
      </div>
    </div>
  );
}

export default function PayslipPage({ searchParams }: PageProps<"/me">) {
  return (
    <MobileContent>
      <Suspense fallback={<PayslipSkeleton />}>
        <PayslipView searchParams={searchParams as Promise<{ period?: string }>} />
      </Suspense>
    </MobileContent>
  );
}
