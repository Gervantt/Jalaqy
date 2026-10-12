"use client";

import { useRef, useState, type FormEvent } from "react";
import { Banner, Button, DatePicker, IconButton, Input, MoneyInput, Switch } from "@/components/ui";
import { IconAlert, IconClose, IconDownload, IconPlus, IconUpload } from "@/components/ui/icons";
import { interpolate, t } from "@/i18n";
import type { EmployeeInput } from "@/lib/api/contracts";
import { formatCount, formatTenge } from "@/lib/format";
import { EMPLOYEES_CSV_TEMPLATE, importEmployeesCsv } from "@/lib/import/employees";
import { hasErrors, validateEmployeeInput, type FieldErrors } from "@/lib/validation/forms";

const o = t.auth.onboarding.employees;
const f = t.employees.form;

export function EmployeesStep({
  employees,
  onChange,
  defaultHireDate,
}: {
  employees: EmployeeInput[];
  onChange: (list: EmployeeInput[]) => void;
  defaultHireDate: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{
    tone: "success" | "danger" | "warning";
    text: string;
  } | null>(null);
  const [manual, setManual] = useState(false);
  const [salary, setSalary] = useState<number | null>(null);
  const [errors, setErrors] = useState<FieldErrors<keyof EmployeeInput>>({});

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const result = importEmployeesCsv(await file.text());
      onChange([...employees, ...result.employees]);
      const parts = [
        interpolate(o.imported, {
          count: formatCount(result.employees.length, t.plural.employees),
        }),
      ];
      if (result.errors.length) {
        parts.push(
          interpolate(o.importErrors, { rows: result.errors.map((e) => e.line).join(", ") }),
        );
      }
      setImportMsg({ tone: result.errors.length ? "warning" : "success", text: parts.join(". ") });
    } catch {
      setImportMsg({ tone: "danger", text: o.importFailed });
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function addManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    const input: EmployeeInput = {
      firstName: get("firstName"),
      lastName: get("lastName"),
      position: get("position"),
      salary: salary ?? Number.NaN,
      hireDate: get("hireDate"),
      iin: get("iin").replace(/\D/g, ""),
      hasDeduction: form.get("hasDeduction") === "on",
    };
    const errs = validateEmployeeInput(input);
    setErrors(errs);
    if (hasErrors(errs)) return;
    onChange([...employees, input]);
    event.currentTarget.reset();
    setSalary(null);
  }

  const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(EMPLOYEES_CSV_TEMPLATE)}`;

  return (
    <div className="flex flex-col gap-5">
      <section
        aria-labelledby="ob-import"
        className="flex flex-col gap-3 rounded-card bg-paper p-4"
      >
        <h3 id="ob-import" className="text-base font-semibold">
          {o.importTitle}
        </h3>
        <p className="text-sm text-muted">{o.importText}</p>
        <div className="flex flex-wrap gap-2.5">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button
            variant="secondary"
            icon={<IconUpload size={18} />}
            onClick={() => fileRef.current?.click()}
          >
            {o.importButton}
          </Button>
          <a
            href={templateHref}
            download="jalaqy-sotrudniki.csv"
            className="inline-flex min-h-11 items-center gap-2 px-2 font-semibold"
          >
            <IconDownload size={18} />
            {o.template}
          </a>
        </div>
        {importMsg && (
          <Banner
            tone={importMsg.tone}
            role="status"
            icon={importMsg.tone === "warning" ? <IconAlert size={20} /> : undefined}
          >
            {importMsg.text}
          </Banner>
        )}
      </section>

      {!manual ? (
        <Button
          variant="ghost"
          icon={<IconPlus size={18} />}
          onClick={() => setManual(true)}
          className="self-start"
        >
          {o.addManually}
        </Button>
      ) : (
        <form onSubmit={addManual} noValidate className="grid gap-3 sm:grid-cols-2">
          <Input name="lastName" label={f.lastName} required error={errors.lastName} />
          <Input name="firstName" label={f.firstName} required error={errors.firstName} />
          <Input
            name="position"
            label={f.position}
            required
            error={errors.position}
            fieldClassName="sm:col-span-2"
          />
          <MoneyInput
            label={f.salary}
            value={salary}
            onValueChange={setSalary}
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
            inputMode="numeric"
            maxLength={12}
            required
            error={errors.iin}
            fieldClassName="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <Switch name="hasDeduction" label={f.deduction} defaultChecked />
          </div>
          <Button
            type="submit"
            variant="secondary"
            icon={<IconPlus size={18} />}
            className="sm:col-span-2 sm:justify-self-start"
          >
            {f.save}
          </Button>
        </form>
      )}

      <section aria-labelledby="ob-list" className="flex flex-col gap-2">
        <h3 id="ob-list" className="text-base font-semibold">
          {o.listTitle}
        </h3>
        {employees.length === 0 ? (
          <p className="text-sm text-muted">{o.none}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0" aria-live="polite">
            {employees.map((e, i) => {
              const name = `${e.lastName} ${e.firstName}`;
              return (
                <li
                  key={`${e.iin}-${i}`}
                  className="flex items-center justify-between gap-3 border-t border-divider py-2 first:border-t-0"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{name}</span>
                    <span className="text-sm text-muted">
                      {e.position} · {formatTenge(e.salary)}
                    </span>
                  </span>
                  <IconButton
                    label={interpolate(o.remove, { name })}
                    icon={<IconClose size={18} />}
                    variant="ghost"
                    onClick={() => onChange(employees.filter((_, j) => j !== i))}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
