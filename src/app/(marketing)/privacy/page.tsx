import type { Metadata } from "next";
import { t } from "@/i18n";
import { LegalPage } from "../LegalPage";

const p = t.landing.legal.privacy;

export const metadata: Metadata = { title: p.title };

export default function PrivacyPage() {
  return <LegalPage title={p.title} sections={p.sections} />;
}
