import type { Metadata } from "next";
import { Faq, Stats, StartSteps } from "@/components/landing/Blocks";
import { Calculator } from "@/components/landing/Calculator";
import { Features } from "@/components/landing/Features";
import { LandingFooter } from "@/components/landing/Footer";
import { LandingHeader } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { How } from "@/components/landing/How";
import { Marquee } from "@/components/landing/Marquee";
import { Pricing } from "@/components/landing/Pricing";
import { Waitlist } from "@/components/landing/Waitlist";
import { t } from "@/i18n";
import { calculateEmployee, calculatePayroll, rates2026 } from "@/lib/payroll";

export const metadata: Metadata = {
  title: { absolute: t.landing.meta.title },
  description: t.landing.meta.description,
  openGraph: {
    title: t.landing.meta.title,
    description: t.landing.meta.description,
    locale: "ru_KZ",
    type: "website",
  },
};

/** Компания из дизайна: цифры на лендинге считает тот же модуль, что и сервис. */
const SALARIES = [550_000, 320_000, 300_000, 250_000, 250_000, 200_000];
const company = calculatePayroll(
  SALARIES.map((gross, i) => ({ id: String(i), gross, hasDeduction: true })),
  rates2026,
).totals;
const daniyar = calculateEmployee({ gross: 320_000, hasDeduction: true }, rates2026);

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <Hero
          numbers={{
            net: company.net,
            toBudget: company.toBudget,
            daniyarExtra: daniyar.employer.total,
          }}
        />
        <Marquee />
        <Features />
        <Calculator />
        <How net={company.net} taxes={company.toBudget} />
        <Stats />
        <Pricing />
        <StartSteps />
        <Faq />
        <Waitlist />
      </main>
      <LandingFooter />
    </>
  );
}
