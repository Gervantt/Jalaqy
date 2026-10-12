"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { IconAlert, IconCheck, IconClose, IconInfo } from "./icons";

export type ToastTone = "success" | "error" | "info";

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** мс; 0 — не скрывать автоматически. По умолчанию 5 с, ошибки — 8 с. */
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastInput, "description">> {
  id: number;
  description?: string;
}

interface ToastApi {
  show: (toast: ToastInput) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast: оберните дерево в <ToastProvider>");
  return ctx;
}

const icons: Record<ToastTone, ReactNode> = {
  success: <IconCheck size={20} strokeWidth={2.6} className="text-accent" />,
  error: <IconAlert size={20} className="text-accent" />,
  info: <IconInfo size={20} className="text-on-ink-soft" />,
};

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(onDismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        "on-ink pointer-events-auto flex items-start gap-3 rounded-card bg-ink py-3 pr-2 pl-4 text-on-ink shadow-float",
        "animate-[jq-toast-in_0.2s_ease-out]",
      )}
    >
      <span className="mt-2.5 shrink-0">{icons[toast.tone]}</span>
      <div className="min-w-0 flex-1 py-2">
        <p className="text-body font-semibold">{toast.title}</p>
        {toast.description && <p className="text-sm text-on-ink-soft">{toast.description}</p>}
      </div>
      <IconButton
        label={t.ui.dismiss}
        icon={<IconClose size={18} />}
        variant="onInk"
        onClick={onDismiss}
      />
    </div>
  );
}

/**
 * Всплывающие уведомления. Живые регионы есть в DOM всегда (иначе
 * скринридеры могут пропустить первое сообщение): обычные — polite, ошибки — assertive.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((input: ToastInput) => {
    const id = nextId.current++;
    const tone = input.tone ?? "success";
    const duration = input.duration ?? (tone === "error" ? 8000 : 5000);
    setToasts((list) => [...list.slice(-2), { ...input, tone, duration, id }]);
    return id;
  }, []);

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const region = (assertive: boolean) => (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className="flex flex-col gap-2"
    >
      {toasts
        .filter((x) => (x.tone === "error") === assertive)
        .map((x) => (
          <ToastView key={x.id} toast={x} onDismiss={() => dismiss(x.id)} />
        ))}
    </div>
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 md:right-6 md:bottom-6 md:left-auto md:w-96">
        {region(true)}
        {region(false)}
      </div>
    </ToastContext.Provider>
  );
}
