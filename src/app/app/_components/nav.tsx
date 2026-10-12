import type { NavItem } from "@/components/ui";
import {
  IconCalendar,
  IconChart,
  IconDocument,
  IconPayroll,
  IconSettings,
  IconUsers,
} from "@/components/ui/icons";
import { t } from "@/i18n";

const n = t.app.shell.nav;

export const appNav: NavItem[] = [
  { href: "/app/payroll", label: n.payroll, icon: <IconPayroll size={18} /> },
  { href: "/app/employees", label: n.employees, icon: <IconUsers size={18} /> },
  { href: "/app/timesheet", label: n.timesheet, icon: <IconCalendar size={18} /> },
  { href: "/app/contracts", label: n.contracts, icon: <IconDocument size={18} /> },
  { href: "/app/taxes", label: n.taxes, icon: <IconChart size={18} /> },
];

export const appNavFooter: NavItem[] = [
  { href: "/app/settings", label: n.settings, icon: <IconSettings size={18} /> },
];
