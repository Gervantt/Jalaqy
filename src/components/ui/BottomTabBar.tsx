"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { isActivePath, type NavItem } from "./nav";

export interface BottomTabBarProps {
  items: NavItem[];
  activePath?: string;
  className?: string;
}

/** Нижняя навигация мобильных экранов (сотрудник). Ссылки, а не кнопки: это переходы. */
export function BottomTabBar({ items, activePath, className }: BottomTabBarProps) {
  const pathname = usePathname();
  const current = activePath ?? pathname;
  return (
    <nav
      aria-label={t.ui.tabNav}
      className={cn(
        "border-t border-divider bg-surface px-2 pt-2 pb-[max(24px,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <ul
        className="m-0 grid list-none p-0"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const active = isActivePath(current, item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-button text-xs no-underline",
                  active
                    ? "font-bold text-primary hover:text-primary"
                    : "font-semibold text-muted is-hover:text-ink",
                )}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
