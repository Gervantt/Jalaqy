import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState, PageHeader } from "@/components/ui";
import { IconUsers } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import { api } from "@/lib/api";
import { today } from "@/lib/clock";
import { formatCount, formatTenge } from "@/lib/format";
import { requireSession } from "@/lib/session";
import { PageSkeleton } from "../_components/PageSkeleton";
import { AddEmployee } from "./AddEmployee";
import { EmployeesTable } from "./EmployeesTable";

const e = t.employees;

export const metadata: Metadata = { title: e.title };

async function EmployeesView() {
  const session = await requireSession(["accountant", "owner"]);
  const employees = await api.employees.list();
  const fund = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const canEdit = session.role === "accountant";
  return (
    <>
      <PageHeader
        title={e.title}
        meta={interpolate(e.meta, {
          count: formatCount(employees.length, t.plural.employees),
          fund: formatTenge(fund),
        })}
        actions={canEdit && <AddEmployee defaultHireDate={today()} />}
      />
      {employees.length === 0 ? (
        <EmptyState icon={<IconUsers size={26} />} title={e.empty.title}>
          {e.empty.text}
        </EmptyState>
      ) : (
        <EmployeesTable employees={employees} />
      )}
    </>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<PageSkeleton kpis={0} />}>
      <EmployeesView />
    </Suspense>
  );
}
