"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { toActionError, type ActionResult } from "@/lib/actions";
import { isPeriod } from "@/lib/period";
import { requireSession } from "@/lib/session";

export async function approvePayrollAction(period: string): Promise<ActionResult> {
  await requireSession(["owner"]);
  if (!isPeriod(period)) return { ok: false, error: "period" };
  try {
    await api.payroll.approve(period);
  } catch (e) {
    return toActionError(e);
  }
  revalidatePath("/", "layout");
  redirect(`/owner/approved?period=${period}`);
}
