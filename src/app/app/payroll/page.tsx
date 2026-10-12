import type { Metadata } from "next";
import { Suspense } from "react";
import { t } from "@/i18n";
import { PageSkeleton } from "../_components/PageSkeleton";
import { PayrollView } from "./PayrollView";

export const metadata: Metadata = { title: t.app.shell.nav.payroll };

export default function PayrollPage({ searchParams }: PageProps<"/app/payroll">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PayrollView searchParams={searchParams as Promise<{ period?: string }>} />
    </Suspense>
  );
}
