import { t } from "@/i18n";
import { Avatar, Badge, StatusPill, Stepper } from "@/components/ui";
import { DemoPanel } from "./StateRow";

const s = t.styleguide.kit.status;
const [ready, waitIin, failed, draft, fresh] = s.badgeLabels;

export function StatusDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DemoPanel title={s.pills}>
        <div className="flex flex-wrap gap-2">
          <StatusPill status="paid" />
          <StatusPill status="paid">{s.paidOn}</StatusPill>
          <StatusPill status="pending" />
          <StatusPill status="new" />
          <StatusPill status="approved" />
          <StatusPill status="rejected" />
          <StatusPill status="draft" />
        </div>
      </DemoPanel>
      <DemoPanel title={s.badges}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">{ready}</Badge>
          <Badge tone="warning">{waitIin}</Badge>
          <Badge tone="danger">{failed}</Badge>
          <Badge tone="neutral">{draft}</Badge>
          <Badge tone="primary">{fresh}</Badge>
        </div>
      </DemoPanel>
      <DemoPanel title={s.stepper} className="md:col-span-2">
        <Stepper steps={[...s.steps]} current={0} />
        <Stepper steps={[...s.steps]} current={1} />
        <Stepper steps={[...s.steps]} current={4} />
      </DemoPanel>
      <DemoPanel title={s.avatars}>
        <div className="flex flex-wrap items-center gap-3">
          <Avatar name="Мадина Ж." size={64} />
          <Avatar name="Данияр К." size={48} />
          <Avatar name="Асель Б." size={40} />
          <Avatar name="Тимур А." size={32} />
        </div>
      </DemoPanel>
    </div>
  );
}
