"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { OnboardingInput } from "@/lib/api/contracts";
import { toActionError, type ActionResult } from "@/lib/actions";
import { setSession } from "@/lib/session";

/** Сохранить компанию и сотрудников, войти бухгалтером и открыть расчёт. */
export async function finishOnboardingAction(input: OnboardingInput): Promise<ActionResult> {
  try {
    const company = await api.company.onboard(input);
    // В моке новая компания заменяет демо-компанию; бэкенд создаст отдельную
    await setSession({
      userId: "u-acc",
      role: "accountant",
      name: company.name,
      companyId: company.id,
    });
  } catch (e) {
    return toActionError(e);
  }
  redirect("/app/payroll");
}
