"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { bool, money, str, toActionError, type ActionResult } from "@/lib/actions";
import { requireSession } from "@/lib/session";

export type EmployeeFormState = ActionResult<{ id: string }> | null;

export async function createEmployeeAction(
  _prev: EmployeeFormState,
  form: FormData,
): Promise<EmployeeFormState> {
  await requireSession(["accountant"]);
  try {
    const employee = await api.employees.create({
      firstName: str(form, "firstName"),
      lastName: str(form, "lastName"),
      position: str(form, "position"),
      salary: money(form, "salary"),
      hireDate: str(form, "hireDate"),
      iin: str(form, "iin").replace(/\s/g, ""),
      phone: str(form, "phone") || undefined,
      hasDeduction: bool(form, "hasDeduction"),
    });
    revalidatePath("/", "layout");
    return { ok: true, data: { id: employee.id } };
  } catch (e) {
    return toActionError(e);
  }
}

export async function updateEmployeeAction(
  _prev: EmployeeFormState,
  form: FormData,
): Promise<EmployeeFormState> {
  await requireSession(["accountant"]);
  const id = str(form, "id");
  try {
    await api.employees.update(id, {
      position: str(form, "position"),
      salary: money(form, "salary"),
      phone: str(form, "phone"),
      hasDeduction: bool(form, "hasDeduction"),
    });
    revalidatePath("/", "layout");
    return { ok: true, data: { id } };
  } catch (e) {
    return toActionError(e);
  }
}
