"use client";

import { submitWith } from "@/lib/form-submit";
import { useActionState } from "react";
import { Button, Card, Input, MoneyInput, Switch, useToast } from "@/components/ui";
import { t } from "@/i18n";
import type { Employee } from "@/lib/api/contracts";
import { formatDate } from "@/lib/format";
import { formatKzPhone, normalizeKzPhone } from "@/lib/validation/contact";
import { maskIin } from "@/lib/validation/iin";
import { updateEmployeeAction, type EmployeeFormState } from "../actions";

const c = t.employees.card;

export function EditEmployeeForm({
  employee,
  readOnly,
}: {
  employee: Employee;
  readOnly: boolean;
}) {
  const toast = useToast();
  const [state, action, pending] = useActionState<EmployeeFormState, FormData>(
    async (prev, form) => {
      const result = await updateEmployeeAction(prev, form);
      if (result?.ok) toast.show({ title: c.saved });
      return result;
    },
    null,
  );
  const errors = state && !state.ok ? (state.fields ?? {}) : {};

  return (
    <Card as="section" aria-labelledby="emp-details" padding="lg" className="flex flex-col gap-4">
      <h2 id="emp-details" className="font-display text-xl font-bold tracking-display">
        {c.details}
      </h2>
      <form
        action={action}
        onSubmit={submitWith(action)}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value={employee.id} />
        <Input
          name="position"
          label={c.position}
          defaultValue={employee.position}
          required
          disabled={readOnly}
          error={errors.position}
        />
        <MoneyInput
          name="salary"
          label={c.salary}
          defaultValue={employee.salary}
          hint={c.salaryFromHint}
          required
          disabled={readOnly}
          error={errors.salary}
        />
        <Input
          name="phone"
          type="tel"
          label={c.phone}
          defaultValue={
            normalizeKzPhone(employee.phone)
              ? formatKzPhone(normalizeKzPhone(employee.phone)!)
              : employee.phone
          }
          disabled={readOnly}
          error={errors.phone}
        />
        <dl className="m-0 grid grid-cols-2 gap-4 sm:col-span-1">
          <div className="flex flex-col gap-1.5">
            <dt className="text-sm font-semibold">{c.hireDate}</dt>
            <dd className="m-0 flex min-h-12 items-center text-base">
              {formatDate(employee.hireDate)}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="text-sm font-semibold">{c.iin}</dt>
            <dd className="m-0 flex min-h-12 items-center text-base tabular-nums">
              {maskIin(employee.iin)}
            </dd>
          </div>
        </dl>
        <div className="sm:col-span-2">
          <Switch
            name="hasDeduction"
            label={c.deduction}
            description={c.deductionHint}
            defaultChecked={employee.hasDeduction}
            disabled={readOnly}
          />
        </div>
        {state && !state.ok && !state.fields && (
          <p role="alert" className="text-body text-danger sm:col-span-2">
            {state.error}
          </p>
        )}
        {!readOnly && (
          <div className="sm:col-span-2">
            <Button type="submit" loading={pending}>
              {c.save}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
