import { t } from "@/i18n";
import { Button, ButtonLink, IconButton } from "@/components/ui";
import {
  IconBell,
  IconClose,
  IconDownload,
  IconMenu,
  IconPlus,
  IconTrash,
} from "@/components/ui/icons";
import type { ButtonVariant } from "@/components/ui/Button";
import { DemoPanel, StateRow } from "./StateRow";

const k = t.styleguide.kit;
const st = k.states;

const labels: Record<ButtonVariant, string> = {
  primary: k.buttons.send,
  secondary: k.buttons.export,
  soft: k.buttons.approve,
  ghost: k.buttons.details,
  danger: k.buttons.delete,
};

const variants: ButtonVariant[] = ["primary", "secondary", "soft", "ghost", "danger"];

export function ButtonsDemo() {
  return (
    <div className="flex flex-col gap-4">
      {variants.map((v) => (
        <DemoPanel key={v} title={k.variants[v]}>
          <StateRow
            items={[
              { label: st.normal, node: <Button variant={v}>{labels[v]}</Button> },
              {
                label: st.hover,
                node: (
                  <Button variant={v} data-preview="hover">
                    {labels[v]}
                  </Button>
                ),
              },
              {
                label: st.focus,
                node: (
                  <Button variant={v} data-preview="focus">
                    {labels[v]}
                  </Button>
                ),
              },
              {
                label: st.disabled,
                node: (
                  <Button variant={v} disabled>
                    {labels[v]}
                  </Button>
                ),
              },
              {
                label: st.loading,
                node: (
                  <Button variant={v} loading>
                    {labels[v]}
                  </Button>
                ),
              },
            ]}
          />
        </DemoPanel>
      ))}
      <DemoPanel title={k.sizesNote}>
        <StateRow
          items={[
            {
              label: "md · 44",
              node: (
                <Button size="md" variant="secondary">
                  {k.buttons.reject}
                </Button>
              ),
            },
            {
              label: "lg · 48",
              node: (
                <Button size="lg" icon={<IconDownload size={18} />} variant="secondary">
                  {k.buttons.export}
                </Button>
              ),
            },
            { label: "xl · 54", node: <Button size="xl">{k.buttons.approvePay}</Button> },
            {
              label: "ButtonLink",
              node: (
                <ButtonLink href="/styleguide" variant="primary" icon={<IconPlus size={18} />}>
                  {k.buttons.add}
                </ButtonLink>
              ),
            },
          ]}
        />
        <div className="flex max-w-sm flex-col gap-2.5 rounded-card bg-paper p-4">
          <Button size="xl" fullWidth>
            {k.buttons.approvePay}
          </Button>
          <div className="flex gap-2">
            <Button size="md" variant="secondary" fullWidth className="flex-1">
              {k.buttons.reject}
            </Button>
            <Button size="md" variant="soft" fullWidth className="flex-1">
              {k.buttons.approve}
            </Button>
          </div>
        </div>
      </DemoPanel>
      <DemoPanel title={k.sections.iconButtons} tone="paper">
        <StateRow
          items={[
            {
              label: st.normal,
              node: <IconButton label={t.ui.notifications} icon={<IconBell />} />,
            },
            {
              label: st.hover,
              node: (
                <IconButton label={t.ui.notifications} icon={<IconBell />} data-preview="hover" />
              ),
            },
            {
              label: st.focus,
              node: (
                <IconButton label={t.ui.notifications} icon={<IconBell />} data-preview="focus" />
              ),
            },
            {
              label: st.disabled,
              node: <IconButton label={t.ui.notifications} icon={<IconBell />} disabled />,
            },
            {
              label: "ghost",
              node: <IconButton label={k.buttons.delete} icon={<IconTrash />} variant="ghost" />,
            },
            { label: "48", node: <IconButton label={t.ui.close} icon={<IconClose />} size={48} /> },
          ]}
        />
      </DemoPanel>
      <DemoPanel title="onInk" tone="ink">
        <StateRow
          className="[&_span]:text-on-ink-muted"
          items={[
            {
              label: st.normal,
              node: <IconButton label={t.ui.openMenu} icon={<IconMenu />} variant="onInk" />,
            },
            {
              label: st.hover,
              node: (
                <IconButton
                  label={t.ui.openMenu}
                  icon={<IconMenu />}
                  variant="onInk"
                  data-preview="hover"
                />
              ),
            },
            {
              label: st.focus,
              node: (
                <IconButton
                  label={t.ui.openMenu}
                  icon={<IconMenu />}
                  variant="onInk"
                  data-preview="focus"
                />
              ),
            },
          ]}
        />
      </DemoPanel>
    </div>
  );
}
