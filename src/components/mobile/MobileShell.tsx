import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Каркас мобильных экранов (владелец, сотрудник): колонка до 480px по центру,
 * отступы под «чёлку» и полоску «Домой» в установленном PWA.
 */
export function MobileShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper", className)}>
      {children}
    </div>
  );
}

/** Прокручиваемая часть экрана. */
export function MobileContent({ children, className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <main
      {...rest}
      className={cn(
        "flex flex-1 flex-col gap-3.5 px-5 pt-[max(24px,env(safe-area-inset-top))] pb-4",
        className,
      )}
    >
      {children}
    </main>
  );
}

/** Нижняя зона с главной кнопкой: прилипает к низу экрана. */
export function MobileFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 flex flex-col gap-2.5 bg-paper px-5 pt-3 pb-[max(32px,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

/** Подзаголовок карточки: «ЧТО ИЗМЕНИЛОСЬ С СЕНТЯБРЯ». */
export function MobileEyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-caption font-bold tracking-[0.06em] text-muted uppercase">
      {children}
    </h2>
  );
}
