"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { toActionError, type ActionResult } from "@/lib/actions";
import { isPeriod } from "@/lib/period";
import { requireSession } from "@/lib/session";

export async function submitPayrollAction(period: string): Promise<ActionResult> {
  await requireSession(["accountant"]);
  if (!isPeriod(period)) return { ok: false, error: "period" };
  try {
    await api.payroll.submit(period);
    // refresh() в production-сборке с cacheComponents не перерисовывал экран;
    // revalidatePath пересчитывает все разделы панели в ответе на action
    revalidatePath("/app", "layout");
    return { ok: true };
  } catch (e) {
    return toActionError(e);
  }
}
