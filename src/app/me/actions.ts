"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { CertificateKind } from "@/lib/api/contracts";
import { str, toActionError, type ActionResult } from "@/lib/actions";
import { requireSession } from "@/lib/session";

export type MeFormState = ActionResult | null;

async function employeeId(): Promise<string> {
  const session = await requireSession(["employee"]);
  if (!session.employeeId) throw new Error("employeeId missing in session");
  return session.employeeId;
}

export async function requestLeaveAction(_prev: MeFormState, form: FormData): Promise<MeFormState> {
  try {
    await api.timesheet.requestLeave({
      employeeId: await employeeId(),
      from: str(form, "from"),
      to: str(form, "to"),
      comment: str(form, "comment") || undefined,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return toActionError(e);
  }
}

export async function requestCertificateAction(
  _prev: MeFormState,
  form: FormData,
): Promise<MeFormState> {
  try {
    await api.employees.requestCertificate(await employeeId(), {
      kind: str(form, "kind") as CertificateKind,
      purpose: str(form, "purpose"),
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return toActionError(e);
  }
}
