import {
  Banner,
  Button,
  Card,
  CardEyebrow,
  KpiTile,
  Table,
  type TableColumn,
} from "@/components/ui";
import { interpolate, t } from "@/i18n";
import { formatNumber, formatTenge } from "@/lib/format";
import { calculatePayroll, rates2026, type EmployeeMonthResult } from "@/lib/payroll";
import { DemoPanel } from "./StateRow";

const k = t.styleguide.kit;
const d = k.data;
const b = k.banners;
const tb = k.table;

interface DemoEmployee {
  id: string;
  name: string;
  role: string;
  gross: number;
}

/** Оклады из design/Payroll.dc.html; суммы считает lib/payroll. */
const employees: DemoEmployee[] = [
  { id: "madina", name: "Мадина Ж.", role: "Управляющая", gross: 550_000 },
  { id: "daniyar", name: "Данияр К.", role: "Старший бариста", gross: 320_000 },
  { id: "asel", name: "Асель Б.", role: "Кондитер", gross: 300_000 },
  { id: "erlan", name: "Ерлан Т.", role: "Бариста", gross: 250_000 },
  { id: "aigerim", name: "Айгерим С.", role: "Бариста", gross: 250_000 },
  { id: "timur", name: "Тимур А.", role: "Курьер", gross: 200_000 },
];

const payroll = calculatePayroll(
  employees.map((e) => ({ id: e.id, gross: e.gross, hasDeduction: true })),
  rates2026,
);
const totals = payroll.totals;

type Row = DemoEmployee & { result: EmployeeMonthResult };
const rows: Row[] = payroll.lines.map((line, i) => ({ ...employees[i]!, result: line.result }));

const num = (
  key: string,
  header: string,
  pick: (r: EmployeeMonthResult) => number,
  total: number,
  emphasis = false,
): TableColumn<Row> => ({
  key,
  header,
  align: "right",
  emphasis,
  render: (r) => formatNumber(pick(r.result)),
  footer: formatNumber(total),
});

const columns: TableColumn<Row>[] = [
  {
    key: "name",
    header: tb.employee,
    render: (r) => (
      <>
        <div className="font-semibold">{r.name}</div>
        <div className="text-caption text-muted">{r.role}</div>
      </>
    ),
    footer: tb.total,
  },
  num("salary", tb.salary, (r) => r.gross, totals.gross),
  num("opv", tb.opv, (r) => r.employee.opv, totals.opv),
  num("vosms", tb.vosms, (r) => r.employee.vosms, totals.vosms),
  num("ipn", tb.ipn, (r) => r.employee.ipn, totals.ipn),
  num("net", tb.net, (r) => r.net, totals.net, true),
];

const daniyar = rows[1]!.result;

export function DataDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <KpiTile tone="ink" label={d.toPay} value={totals.net} />
        <KpiTile
          label={d.taxes}
          value={totals.toBudget}
          hint={interpolate(d.taxesHint, {
            withheld: formatNumber(totals.withheld),
            employer: formatNumber(totals.employer),
          })}
        />
        <KpiTile label={d.fot} value={totals.cost} />
        <KpiTile label={d.fot} value={0} loading />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="flex flex-col gap-2.5" padding="sm">
          <CardEyebrow>{d.cardTitle}</CardEyebrow>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {d.cardItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body leading-snug">
                <span
                  aria-hidden="true"
                  className="mt-[7px] size-2 shrink-0 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card tone="ink" padding="sm" className="flex flex-col gap-1.5">
          <div className="text-sm text-on-ink-soft">{d.inkTitle}</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-accent tabular-nums">
              {formatTenge(daniyar.employer.total)}
            </span>
            <span className="text-sm text-on-ink-soft">{d.inkHint}</span>
          </div>
        </Card>
      </div>
      <h3 className="mt-2 text-sm font-bold">{k.sections.banners}</h3>
      <div className="flex flex-col gap-3">
        <Banner tone="warning" title={b.warningTitle}>
          {b.warningText}
        </Banner>
        <Banner tone="success" title={b.successTitle}>
          {b.successText}
        </Banner>
        <Banner
          tone="danger"
          title={b.dangerTitle}
          action={
            <Button size="md" variant="secondary">
              {b.retry}
            </Button>
          }
        >
          {b.dangerText}
        </Banner>
        <Banner tone="info" title={b.infoTitle}>
          {b.infoText}
        </Banner>
      </div>
      <h3 className="mt-2 text-sm font-bold">{k.sections.table}</h3>
      <Table caption={tb.caption} columns={columns} rows={rows} rowKey={(r) => r.id} footer />
      <p className="text-caption text-muted">{tb.note}</p>
      <DemoPanel tone="paper" title={tb.emptyCaption}>
        <Table
          caption={tb.emptyCaption}
          columns={columns}
          rows={[]}
          rowKey={(r) => r.id}
          minWidth={320}
          empty={<span className="text-muted">{tb.empty}</span>}
        />
      </DemoPanel>
    </div>
  );
}
