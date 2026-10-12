import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconChevronLeft } from "./icons";

export interface PageHeaderProps {
  title: ReactNode;
  /** Строка над заголовком: «6 сотрудников · период 1–31 октября». */
  meta?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
  /** 1 — заголовок страницы (по умолчанию); 2 — для витрин и вложенных разделов. */
  level?: 1 | 2;
  className?: string;
}

/** Заголовок страницы панели: H1 Onest 800/32, действия справа, переносятся на узком экране. */
export function PageHeader({ title, meta, actions, back, level = 1, className }: PageHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-1.5">
        {back && (
          <Link
            href={back.href}
            className="-ml-1 inline-flex min-h-11 items-center gap-1 self-start text-sm font-semibold no-underline"
          >
            <IconChevronLeft size={18} />
            {back.label}
          </Link>
        )}
        {meta && <div className="text-sm text-muted">{meta}</div>}
        <Heading className="m-0 font-display text-[26px] leading-tight font-extrabold tracking-display break-words md:text-h1">
          {title}
        </Heading>
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}
