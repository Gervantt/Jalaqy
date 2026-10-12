"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { Role } from "@/lib/api/contracts";
import { toActionError, str, type ActionResult } from "@/lib/actions";
import { clearSession, setSession } from "@/lib/session";
import { canAccess, homeFor, safeNext } from "@/lib/session-codec";

export type RequestCodeState = ActionResult<{
  contact: string;
  channel: "sms" | "email";
  /** Когда отправлен код, мс — для таймера «отправить ещё раз» */
  sentAt: number;
  resendInSec: number;
}> | null;

export async function requestCodeAction(
  _prev: RequestCodeState,
  form: FormData,
): Promise<RequestCodeState> {
  const contact = str(form, "contact");
  try {
    const result = await api.auth.requestCode({ contact });
    return {
      ok: true,
      data: {
        contact,
        channel: result.channel,
        sentAt: Date.now(),
        resendInSec: result.resendInSec,
      },
    };
  } catch (e) {
    return toActionError(e);
  }
}

export type VerifyState = ActionResult | null;

const ROLES: Role[] = ["accountant", "owner", "employee"];

export async function verifyCodeAction(_prev: VerifyState, form: FormData): Promise<VerifyState> {
  const role = str(form, "role") as Role;
  let destination: string;
  try {
    const session = await api.auth.verifyCode({
      contact: str(form, "contact"),
      code: str(form, "code"),
      demoRole: ROLES.includes(role) ? role : "accountant",
    });
    await setSession(session);
    const next = safeNext(str(form, "next"));
    destination = next && canAccess(session.role, next) ? next : homeFor(session.role);
  } catch (e) {
    return toActionError(e);
  }
  redirect(destination);
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
