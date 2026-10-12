"use client";

import { submitWith } from "@/lib/form-submit";
import { useActionState, useState } from "react";
import { Button, DatePicker, Input, MoneyInput, Sheet, Switch, useToast } from "@/components/ui";
import { IconPlus } from "@/components/ui/icons";
import { t } from "@/i18n";
import { createEmployeeAction, type EmployeeFormState } from "./actions";

const f = t.employees.form;

/** Кнопка «Добавить сотрудника» и шторка с формой. */
export function AddEmployee({ defaultHireDate }: { defaultHireDate: string }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const toast = useToast();
  const [state, action, pending] = useActionState<EmployeeFormState, FormData>(
    async (prev, form) => {
      const result = await createEmployeeAction(prev, form);
      if (result?.ok) {
        setOpen(false);
        setFormKey((k) => k + 1); // следующая форма — пустая
        toast.show({ title: f.created });
      }
      return result;
    },
    null,
  );
  const errors = state && !state.ok ? (state.fields ?? {}) : {};
  const formError = state && !state.ok && !state.fields ? state.error : null;

  return (
    <>
      <Button icon={<IconPlus size={18} />} onClick={() => setOpen(true)}>
        {t.employees.add}
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title={f.title} description={f.description}>
        <form
          key={formKey}
          action={action}
          onSubmit={submitWith(action)}
          noValidate
          className="grid gap-4 sm:grid-cols-2"
        >
          <Input
            name="firstName"
            label={f.firstName}
            autoComplete="off"
            required
            error={errors.firstName}
          />
          <Input
            name="lastName"
            label={f.lastName}
            autoComplete="off"
            required
            error={errors.lastName}
          />
          <Input
            name="position"
            label={f.position}
            placeholder={f.positionPlaceholder}
            required
            error={errors.position}
            fieldClassName="sm:col-span-2"
          />
          <MoneyInput
            name="salary"
            label={f.salary}
            hint={f.salaryHint}
            required
            error={errors.salary}
          />
          <DatePicker
            name="hireDate"
            label={f.hireDate}
            defaultValue={defaultHireDate}
            required
            error={errors.hireDate}
          />
          <Input
            name="iin"
            label={f.iin}
            hint={f.iinHint}
            inputMode="numeric"
            maxLength={12}
            autoComplete="off"
            required
            error={errors.iin}
          />
          <Input
            name="phone"
            type="tel"
            label={f.phone}
            hint={f.phoneHint}
            autoComplete="off"
            error={errors.phone}
          />
          <div className="sm:col-span-2">
            <Switch
              name="hasDeduction"
              label={f.deduction}
              description={f.deductionHint}
              defaultChecked
            />
          </div>
          {formError && (
            <p role="alert" className="text-body text-danger sm:col-span-2">
              {formError}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2.5 sm:col-span-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {f.cancel}
            </Button>
            <Button type="submit" loading={pending}>
              {f.save}
            </Button>
          </div>
        </form>
      </Sheet>
    </>
  );
}
