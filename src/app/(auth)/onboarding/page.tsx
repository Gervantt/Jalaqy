import type { Metadata } from "next";
import { Suspense } from "react";
import { t } from "@/i18n";
import { today } from "@/lib/clock";
import { connection } from "next/server";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata: Metadata = { title: t.auth.onboarding.title };

async function Wizard() {
  await connection();
  return <OnboardingWizard defaultHireDate={today()} />;
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <Wizard />
    </Suspense>
  );
}
