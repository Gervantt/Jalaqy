import type { Metadata } from "next";
import { Suspense } from "react";
import { MobileContent } from "@/components/mobile/MobileShell";
import { Badge, Card, Skeleton, StatusPill } from "@/components/ui";
import { IconDownload } from "@/components/ui/icons";
import { t } from "@/i18n";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { requireEmployee } from "../session";
import { CertificateForm } from "./CertificateForm";

const c = t.mobile.certificate;

export const metadata: Metadata = { title: c.title };

async function Certificates() {
  const session = await requireEmployee();
  const list = await api.employees.certificates(session.employeeId);
  return (
    <Card as="section" aria-labelledby="cert-mine" padding="md" className="flex flex-col gap-2">
      <h2 id="cert-mine" className="text-caption font-bold tracking-[0.06em] text-muted uppercase">
        {c.mine}
      </h2>
      {list.length === 0 ? (
        <p className="text-body text-muted">{c.empty}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {list.map((cert) => (
            <li
              key={cert.id}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-divider py-2.5 first:border-t-0"
            >
              <span className="flex flex-col">
                <span className="font-semibold">{c.kinds[cert.kind]}</span>
                <span className="text-sm text-muted">
                  {cert.purpose} · {formatDate(cert.requestedAt.slice(0, 10), "short")}
                </span>
              </span>
              {cert.status === "ready" ? (
                <span className="flex items-center gap-2">
                  <StatusPill status="paid">{c.statuses.ready}</StatusPill>
                  <a
                    href={`/api/certificates/${cert.id}`}
                    download
                    className="inline-flex min-h-11 items-center gap-1 font-semibold no-underline"
                    aria-label={`${c.download}: ${c.kinds[cert.kind]}`}
                  >
                    <IconDownload size={18} />
                    {c.download}
                  </a>
                </span>
              ) : (
                <Badge tone="warning">{c.statuses.requested}</Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function CertificatePage() {
  return (
    <MobileContent>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-title font-extrabold tracking-display">{c.title}</h1>
        <p className="text-body text-muted">{c.text}</p>
      </div>
      <CertificateForm />
      <Suspense fallback={<Skeleton className="h-32 rounded-card-lg" />}>
        <Certificates />
      </Suspense>
    </MobileContent>
  );
}
