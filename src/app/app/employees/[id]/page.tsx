import type { Metadata } from "next";
import { Suspense } from "react";
import { t } from "@/i18n";
import { PageSkeleton } from "../../_components/PageSkeleton";
import { EmployeeView } from "./EmployeeView";

export const metadata: Metadata = { title: t.employees.title };

export default function EmployeePage({ params }: PageProps<"/app/employees/[id]">) {
  return (
    <Suspense fallback={<PageSkeleton kpis={2} rows={4} />}>
      <EmployeeView params={params} />
    </Suspense>
  );
}
