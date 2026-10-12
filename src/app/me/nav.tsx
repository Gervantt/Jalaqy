import type { NavItem } from "@/components/ui";
import { IconCalendar, IconPayroll, IconUser } from "@/components/ui/icons";
import { t } from "@/i18n";

const tabs = t.mobile.me.tabs;

export const meNav: NavItem[] = [
  { href: "/me", label: tabs.payslip, icon: <IconPayroll size={22} />, exact: true },
  { href: "/me/leave", label: tabs.leave, icon: <IconCalendar size={22} /> },
  { href: "/me/profile", label: tabs.profile, icon: <IconUser size={22} /> },
];
