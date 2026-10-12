"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { IconClose } from "./icons";

export type DialogVariant = "modal" | "sheet" | "drawer";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Заголовок только для скринридера. */
  hideTitle?: boolean;
  description?: ReactNode;
  children?: ReactNode;
  /** Кнопки внизу. */
  footer?: ReactNode;
  /**
   * modal  — по центру;
   * sheet  — снизу на телефоне, по центру на широком экране;
   * drawer — выезжает слева (мобильное меню).
   */
  variant?: DialogVariant;
  tone?: "surface" | "ink";
  className?: string;
}

const variants: Record<DialogVariant, string> = {
  modal: "m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-md rounded-sheet",
  sheet:
    "mx-0 mt-auto mb-0 max-h-[calc(100dvh-32px)] w-full max-w-none rounded-t-sheet md:m-auto md:w-[calc(100%-32px)] md:max-w-lg md:rounded-sheet",
  drawer: "my-0 mr-auto ml-0 h-dvh max-h-none w-[min(300px,85vw)] rounded-r-sheet",
};

/**
 * Модальное окно на нативном <dialog>: фокус заперт внутри, Esc закрывает,
 * фон инертен, фокус возвращается на кнопку-триггер. Одна мягкая тень — «выплывающий» элемент.
 */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  description,
  children,
  footer,
  variant = "modal",
  tone = "surface",
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Скрытый Activity-маршрут не должен держать модалку открытой
  useEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const ink = tone === "ink";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        // клик по затемнению (сам <dialog>, не содержимое) закрывает
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "border-0 p-0 shadow-float",
        "open:animate-[jq-sheet-in_0.2s_ease-out]",
        ink ? "on-ink bg-ink text-on-ink" : "bg-surface text-ink",
        variants[variant],
        className,
      )}
    >
      <div
        className={cn(
          "flex max-h-[inherit] flex-col gap-4 p-5 md:p-6",
          variant === "drawer" && "h-full",
          variant === "sheet" && "pb-[max(20px,env(safe-area-inset-bottom))]",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className={cn("flex min-w-0 flex-col gap-1", hideTitle && "sr-only")}>
            <h2 id={titleId} className="font-display text-xl font-bold tracking-display">
              {title}
            </h2>
            {description && (
              <p id={descId} className={cn("text-body", ink ? "text-on-ink-soft" : "text-muted")}>
                {description}
              </p>
            )}
          </div>
          <IconButton
            label={t.ui.close}
            icon={<IconClose />}
            variant={ink ? "onInk" : "ghost"}
            onClick={onClose}
            className="-mt-1.5 -mr-1.5 ml-auto"
          />
        </div>
        {children && <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>}
        {footer && <div className="flex flex-wrap justify-end gap-2.5">{footer}</div>}
      </div>
    </dialog>
  );
}

export type ModalProps = Omit<DialogProps, "variant">;
export const Modal = (props: ModalProps) => <Dialog variant="modal" {...props} />;
export const Sheet = (props: ModalProps) => <Dialog variant="sheet" {...props} />;
