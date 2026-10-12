import { t } from "@/i18n";
import {
  BottomTabBar,
  Button,
  IconButton,
  MobileNavBar,
  PageHeader,
  Sidebar,
  type NavItem,
} from "@/components/ui";
import {
  IconBell,
  IconCalendar,
  IconChart,
  IconDocument,
  IconPayroll,
  IconSettings,
  IconUser,
  IconUsers,
} from "@/components/ui/icons";
import { DemoPanel } from "./StateRow";

const n = t.styleguide.kit.nav;
const btn = t.styleguide.kit.buttons;

const items: NavItem[] = [
  { href: "/app/payroll", label: n.items.payroll, icon: <IconPayroll size={18} /> },
  { href: "/app/employees", label: n.items.employees, icon: <IconUsers size={18} /> },
  { href: "/app/timesheet", label: n.items.timesheet, icon: <IconCalendar size={18} /> },
  { href: "/app/contracts", label: n.items.contracts, icon: <IconDocument size={18} /> },
  { href: "/app/taxes", label: n.items.taxes, icon: <IconChart size={18} /> },
];
const footerItems: NavItem[] = [
  { href: "/app/settings", label: n.items.settings, icon: <IconSettings size={18} /> },
];
const tabs: NavItem[] = [
  { href: "/me", label: n.items.payroll, icon: <IconPayroll size={22} />, exact: true },
  { href: "/me/leave", label: n.items.vacation, icon: <IconCalendar size={22} /> },
  { href: "/me/profile", label: n.items.profile, icon: <IconUser size={22} /> },
];

export function NavDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted">{n.sidebar}</span>
          <Sidebar
            items={items}
            footerItems={footerItems}
            companyLabel={n.companyLabel}
            companyName={n.companyName}
            activePath="/app/payroll"
            className="h-[560px] rounded-card-lg"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <DemoPanel title={n.pageHeader} tone="paper">
            <PageHeader
              meta={n.headerMeta}
              title={n.headerTitle}
              actions={
                <>
                  <Button variant="secondary">{btn.export}</Button>
                  <Button>{btn.send}</Button>
                </>
              }
            />
            <PageHeader back={{ href: "/styleguide", label: n.back }} title="Данияр К." />
          </DemoPanel>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted">{n.mobileBar}</span>
            <div className="max-w-[390px] overflow-hidden rounded-card-lg">
              <MobileNavBar
                items={items}
                footerItems={footerItems}
                companyLabel={n.companyLabel}
                companyName={n.companyName}
                activePath="/app/payroll"
                actions={
                  <IconButton label={t.ui.notifications} icon={<IconBell />} variant="onInk" />
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted">{n.tabBar}</span>
            <div className="max-w-[390px] overflow-hidden rounded-card-lg border border-border">
              <BottomTabBar items={tabs} activePath="/me" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
