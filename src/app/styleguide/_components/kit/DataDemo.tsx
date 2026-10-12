import { t } from "@/i18n";
import {
  Banner,
  Button,
  Card,
  CardEyebrow,
  KpiTile,
  Table,
  type TableColumn,
} from "@/components/ui";
import { formatNumber, formatTenge } from "@/lib/format";
import { DemoPanel } from "./StateRow";

const k = t.styleguide.kit;
const d = k.data;
const b = k.banners;
const tb = k.table;

interface DemoRow {
  name: string;
  role: string;
  salary: number;
  opv: number;
  vosms: number;
  ipn: number;
  net: number;
}

/** Цифры из design/Payroll.dc.html — только для витрины. В панели их считает lib/payroll. */
const rows: DemoRow[] = [
  {
    name: "Мадина Ж.",
    role: "Управляющая",
    salary: 550000,
    opv: 55000,
    vosms: 11000,
    ipn: 35425,
    net: 448575,
  },
  {
    name: "Данияр К.",
    role: "Старший бариста",
    salary: 320000,
    opv: 32000,
    vosms: 6400,
    ipn: 15185,
    net: 266415,
  },
  {
    name: "Асель Б.",
    role: "Кондитер",
    salary: 300000,
    opv: 30000,
    vosms: 6000,
    ipn: 13425,
    net: 250575,
  },
];

const sum = (key: keyof Omit<DemoRow, "name" | "role">) => rows.reduce((a, r) => a + r[key], 0);
const num = (
  key: keyof Omit<DemoRow, "name" | "role">,
  label: string,
  emphasis = false,
): TableColumn<DemoRow> => ({
  key,
  header: label,
  align: "right",
  emphasis,
  render: (r) => formatNumber(r[key]),
  footer: formatNumber(sum(key)),
});

const columns: TableColumn<DemoRow>[] = [
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
  num("salary", tb.salary),
  num("opv", tb.opv),
  num("vosms", tb.vosms),
  num("ipn", tb.ipn),
  num("net", tb.net, true),
];

export function DataDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <KpiTile tone="ink" label={d.toPay} value={1558890} />
        <KpiTile label={d.taxes} value={615546} hint={d.taxesHint} />
        <KpiTile label={d.fot} value={2174436} />
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
              {formatTenge(52096)}
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
      <Table caption={tb.caption} columns={columns} rows={rows} rowKey={(r) => r.name} footer />
      <p className="text-caption text-muted">{tb.note}</p>
      <DemoPanel tone="paper" title={tb.emptyCaption}>
        <Table
          caption={tb.emptyCaption}
          columns={columns}
          rows={[]}
          rowKey={(r) => r.name}
          minWidth={320}
          empty={<span className="text-muted">{tb.empty}</span>}
        />
      </DemoPanel>
    </div>
  );
}
