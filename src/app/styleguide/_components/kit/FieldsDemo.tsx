import { t } from "@/i18n";
import {
  Checkbox,
  DatePicker,
  Input,
  MoneyInput,
  RadioGroup,
  Select,
  Switch,
} from "@/components/ui";
import { IconSearch } from "@/components/ui/icons";
import { DemoPanel, StateRow } from "./StateRow";

const k = t.styleguide.kit;
const st = k.states;
const f = k.fields;
const c = k.choices;

const regimeOptions = f.regimes.map((label, i) => ({ value: String(i), label }));
const wide = "w-full sm:w-64";

export function FieldsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <DemoPanel title="Input">
        <StateRow
          itemClassName={wide}
          items={[
            { label: st.normal, node: <Input label={f.name} placeholder={f.namePlaceholder} /> },
            {
              label: st.hover,
              node: <Input label={f.name} placeholder={f.namePlaceholder} data-preview="hover" />,
            },
            {
              label: st.focus,
              node: <Input label={f.name} placeholder={f.namePlaceholder} data-preview="focus" />,
            },
            {
              label: st.filled,
              node: (
                <Input
                  label={f.bin}
                  hint={f.binHint}
                  defaultValue="260140012345"
                  inputMode="numeric"
                />
              ),
            },
            {
              label: st.disabled,
              node: <Input label={f.email} defaultValue="buh@tulpan.kz" disabled />,
            },
            {
              label: st.error,
              node: (
                <Input
                  label={f.bin}
                  hint={f.binHint}
                  error={f.binError}
                  defaultValue={f.binValue}
                  required
                />
              ),
            },
            {
              label: "startAdornment",
              node: (
                <Input
                  label={f.search}
                  hideLabel
                  placeholder={f.search}
                  startAdornment={<IconSearch size={18} />}
                  type="search"
                />
              ),
            },
          ]}
        />
      </DemoPanel>
      <DemoPanel title="Select · DatePicker">
        <StateRow
          itemClassName={wide}
          items={[
            {
              label: st.normal,
              node: (
                <Select
                  label={f.regime}
                  placeholder={f.regimePlaceholder}
                  options={regimeOptions}
                  defaultValue=""
                />
              ),
            },
            {
              label: st.focus,
              node: <Select label={f.regime} options={regimeOptions} data-preview="focus" />,
            },
            {
              label: st.disabled,
              node: <Select label={f.regime} options={regimeOptions} disabled />,
            },
            {
              label: st.error,
              node: (
                <Select
                  label={f.regime}
                  placeholder={f.regimePlaceholder}
                  options={regimeOptions}
                  defaultValue=""
                  required
                  error={f.regimePlaceholder}
                />
              ),
            },
            {
              label: "DatePicker",
              node: <DatePicker label={f.hireDate} defaultValue="2026-10-01" />,
            },
            {
              label: `DatePicker · ${st.error}`,
              node: <DatePicker label={f.hireDate} error={t.ui.required} required />,
            },
          ]}
        />
      </DemoPanel>
      <DemoPanel title="MoneyInput">
        <StateRow
          itemClassName={wide}
          items={[
            { label: st.normal, node: <MoneyInput label={f.salary} hint={f.salaryHint} /> },
            { label: st.filled, node: <MoneyInput label={f.salary} defaultValue={320000} /> },
            {
              label: st.focus,
              node: <MoneyInput label={f.salary} defaultValue={550000} data-preview="focus" />,
            },
            {
              label: st.disabled,
              node: <MoneyInput label={f.salary} defaultValue={250000} disabled />,
            },
            {
              label: st.error,
              node: <MoneyInput label={f.salary} defaultValue={60000} error={f.salaryError} />,
            },
          ]}
        />
        <div className="max-w-md">
          <MoneyInput label={f.salaryBig} defaultValue={320000} size="lg" />
        </div>
      </DemoPanel>
      <DemoPanel title={k.sections.choices}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col">
            <Checkbox label={c.deduction} description={c.deductionHint} defaultChecked />
            <Checkbox label={`${c.deduction} · ${st.focus}`} data-preview="focus" />
            <Checkbox label={`${c.deduction} · ${st.disabled}`} disabled />
            <Checkbox label={c.consent} error={c.consentError} />
          </div>
          <div className="flex flex-col gap-4">
            <RadioGroup
              legend={c.roleLegend}
              name="sg-role"
              orientation="horizontal"
              defaultValue="owner"
              options={[
                { value: "owner", label: c.roleOwner },
                { value: "acc", label: c.roleAccountant },
              ]}
            />
            <RadioGroup
              legend={`${c.roleLegend} · ${st.error}`}
              name="sg-role-err"
              orientation="horizontal"
              required
              error={t.ui.required}
              options={[
                { value: "owner", label: c.roleOwner },
                { value: "acc", label: c.roleAccountant, disabled: true },
              ]}
            />
          </div>
          <div className="flex flex-col">
            <Switch label={c.notify} description={c.notifyHint} defaultChecked />
            <Switch label={`${c.sms} · ${st.normal}`} />
            <Switch label={`${c.sms} · ${st.focus}`} data-preview="focus" />
            <Switch label={`${c.sms} · ${st.disabled}`} disabled />
          </div>
        </div>
      </DemoPanel>
    </div>
  );
}
