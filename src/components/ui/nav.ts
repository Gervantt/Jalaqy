import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  /** Активен только при точном совпадении пути (для корневых разделов вроде /me). */
  exact?: boolean;
}

export function isActivePath(pathname: string, item: Pick<NavItem, "href" | "exact">): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
