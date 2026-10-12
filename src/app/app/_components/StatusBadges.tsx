import { Badge, StatusPill } from "@/components/ui";
import { t } from "@/i18n";
import type { AbsenceStatus, PayrollStatus } from "@/lib/api/contracts";
import { formatDate } from "@/lib/format";

/** Статус расчёта месяца. Выплаченные — с датой: «Выплачено 5 ноя». */
export function PayrollStatusBadge({ status, paidAt }: { status: PayrollStatus; paidAt?: string }) {
  const label = t.domain.payrollStatus[status];
  if (status === "paid" || status === "closed") {
    return (
      <StatusPill status="paid">
        {paidAt ? `${t.ui.status.paid} ${formatDate(paidAt.slice(0, 10), "short")}` : label}
      </StatusPill>
    );
  }
  if (status === "awaiting_approval") return <StatusPill status="pending">{label}</StatusPill>;
  if (status === "approved") return <StatusPill status="approved">{label}</StatusPill>;
  return <Badge tone="neutral">{label}</Badge>;
}

export function AbsenceStatusBadge({ status }: { status: AbsenceStatus }) {
  return <StatusPill status={status}>{t.domain.absenceStatus[status]}</StatusPill>;
}
