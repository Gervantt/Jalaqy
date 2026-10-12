"use client";

import { submitWith } from "@/lib/form-submit";
import { useActionState, useState } from "react";
import { Button, DatePicker, Input, RadioGroup, Select, Sheet, useToast } from "@/components/ui";
import { IconPlus } from "@/components/ui/icons";
import { t } from "@/i18n";
import { createAbsenceAction, type AbsenceFormState } from "./actions";

const f = t.timesheet.form;
const types = t.domain.absenceTypes;

export function MarkAbsence({
  employees,
  defaultDate,
}: {
  employees: Array<{ id: string; name: string }>;
  defaultDate: string;
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const toast = useToast();
  const [state, action, pending] = useActionState<AbsenceFormState, FormData>(
    async (prev, form) => {
      const result = await createAbsenceAction(prev, form);
      if (result?.ok) {
        setOpen(false);
        setFormKey((k) => k + 1);
        toast.show({ title: f.created });
      }
      return result;
    },
    null,
  );
  const errors = state && !state.ok ? (state.fields ?? {}) : {};

  return (
    <>
      <Button icon={<IconPlus size={18} />} onClick={() => setOpen(true)}>
        {t.timesheet.mark}
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title={f.title} description={f.description}>
        <form
          key={formKey}
          action={action}
          onSubmit={submitWith(action)}
          noValidate
          className="grid gap-4 sm:grid-cols-2"
        >
          <Select
            name="employeeId"
            label={f.employee}
            placeholder={f.employeePlaceholder}
            defaultValue=""
            required
            options={employees.map((e) => ({ value: e.id, label: e.name }))}
            error={errors.employeeId}
            fieldClassName="sm:col-span-2"
          />
          <RadioGroup
            legend={f.type}
            name="type"
            defaultValue="vacation"
            orientation="horizontal"
            options={(Object.keys(types) as Array<keyof typeof types>).map((k) => ({
              value: k,
              label: types[k],
            }))}
            error={errors.type}
            className="sm:col-span-2"
          />
          <DatePicker
            name="from"
            label={f.from}
            defaultValue={defaultDate}
            required
            error={errors.from}
          />
          <DatePicker
            name="to"
            label={f.to}
            defaultValue={defaultDate}
            required
            error={errors.to}
          />
          <Input name="comment" label={f.comment} fieldClassName="sm:col-span-2" />
          {state && !state.ok && !state.fields && (
            <p role="alert" className="text-body text-danger sm:col-span-2">
              {state.error}
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
