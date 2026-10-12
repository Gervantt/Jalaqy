import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MobileContent, MobileFooter } from "@/components/mobile/MobileShell";
import { ButtonLink, Card, Skeleton } from "@/components/ui";
import { IconCheck } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { api } from "@/lib/api";
import { currentPeriod } from "@/lib/clock";
import { formatCount, formatDate, formatTenge } from "@/lib/format";
import { isPeriod } from "@/lib/period";
import { requireSession } from "@/lib/session";

const o = t.mobile.owner;

export const metadata: Metadata = { title: o.approvedTitle };

async function Approved({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  await requireSession(["owner"]);
  const sp = await searchParams;
  const period = isPeriod(sp.period) ? sp.period : currentPeriod();
  const run = await api.payroll.get(period);
  if (run.status === "draft" || run.status === "calculated" || run.status === "awaiting_approval") {
    redirect("/owner");
  }
  const vars = {
    date: formatDate(run.payDate, "dayMonth"),
    amount: formatTenge(run.totals.toBudget),
    due: formatDate(run.taxDueDate, "dayMonth"),
  };
  const steps = o.approvedSteps.map((step) => interpolate(step, vars));
  return (
    <>
      <MobileContent className="justify-center gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-success-bg text-primary">
            <IconCheck size={40} strokeWidth={2.6} />
          </span>
          <h1 className="font-display text-title font-extrabold tracking-display">
            {o.approvedTitle}
          </h1>
          <p className="text-lead text-text-2">
            {interpolate(o.approvedText, {
              amount: formatTenge(run.totals.net),
              count: formatCount(run.lines.length, t.plural.employees),
            })}
          </p>
        </div>
        <Card as="section" aria-labelledby="ok-next" padding="sm" className="flex flex-col gap-3">
          <h2
            id="ok-next"
            className="text-caption font-bold tracking-[0.06em] text-muted uppercase"
          >
            {o.approvedNext}
          </h2>
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-body leading-snug">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs font-extrabold text-accent">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </MobileContent>
      <MobileFooter>
        <ButtonLink href="/owner" size="xl" fullWidth>
          {o.back}
        </ButtonLink>
      </MobileFooter>
    </>
  );
}

export default function ApprovedPage({ searchParams }: PageProps<"/owner/approved">) {
  return (
    <Suspense
      fallback={
        <MobileContent className="items-center justify-center gap-4" aria-busy="true">
          <span className="sr-only" role="status">
            {t.ui.loading}
          </span>
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full rounded-card-lg" />
        </MobileContent>
      }
    >
      <Approved searchParams={searchParams as Promise<{ period?: string }>} />
    </Suspense>
  );
}
