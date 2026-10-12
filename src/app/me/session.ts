import "server-only";
import type { Session } from "@/lib/api/contracts";
import { requireSession } from "@/lib/session";

/** Сессия сотрудника с обязательным employeeId. */
export async function requireEmployee(): Promise<Session & { employeeId: string }> {
  const session = await requireSession(["employee"]);
  if (!session.employeeId) throw new Error("В сессии сотрудника нет employeeId");
  return session as Session & { employeeId: string };
}
