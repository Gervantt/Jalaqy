import type { Metadata } from "next";
import { t } from "@/i18n";
import { LegalPage } from "../LegalPage";

const o = t.landing.legal.offer;

export const metadata: Metadata = { title: o.title };

export default function OfferPage() {
  return <LegalPage title={o.title} sections={o.sections} />;
}
