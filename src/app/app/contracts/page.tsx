import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { IconDocument } from "@/components/ui/icons";
import { t } from "@/i18n";
import { api } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { PageSkeleton } from "../_components/PageSkeleton";

const c = t.app.contracts;

export const metadata: Metadata = { title: c.title };

async function ContractsView() {
  await requireSession(["accountant", "owner"]);
  const [contracts, templates] = await Promise.all([
    api.contracts.list(),
    api.contracts.templates(),
  ]);
  return (
    <>
      <PageHeader title={c.title} meta={c.meta} />
      {contracts.length === 0 && (
        <EmptyState icon={<IconDocument size={26} />} title={c.empty.title}>
          {c.empty.text}
        </EmptyState>
      )}
      <section aria-labelledby="tpl-title" className="flex flex-col gap-3">
        <h2
          id="tpl-title"
          className="text-caption font-bold tracking-[0.06em] text-muted uppercase"
        >
          {c.templatesTitle}
        </h2>
        <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
          {templates.map((tpl) => {
            const [title, text] = t.domain.contractKinds[tpl.kind];
            return (
              <Card as="li" key={tpl.id} padding="md" className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-10 items-center justify-center rounded-button bg-success-bg text-primary">
                    <IconDocument />
                  </span>
                  {!tpl.available && <Badge tone="neutral">{c.soon}</Badge>}
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted">{text}</p>
              </Card>
            );
          })}
        </ul>
      </section>
    </>
  );
}

export default function ContractsPage() {
  return (
    <Suspense fallback={<PageSkeleton kpis={0} rows={3} />}>
      <ContractsView />
    </Suspense>
  );
}
