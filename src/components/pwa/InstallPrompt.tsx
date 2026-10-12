"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button, Card } from "@/components/ui";
import { t } from "@/i18n";

const p = t.mobile.pwa;
const DISMISS_KEY = "jalaqy.install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

const noop = () => () => {};

/**
 * Предложение установить приложение на домашний экран.
 * Android/Chrome — системный диалог (beforeinstallprompt), iPhone — подсказка «Поделиться → На экран „Домой“».
 * Не показываем в уже установленном приложении и после «Не сейчас».
 */
export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);
  const env = useSyncExternalStore(
    noop,
    () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      return `${standalone ? 1 : 0}${ios ? 1 : 0}${readDismissed() ? 1 : 0}`;
    },
    () => "100",
  );
  const [standalone, ios, dismissed] = [...env].map((c) => c === "1");

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone || dismissed || hidden || (!event && !ios)) return null;

  function dismiss() {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // приватный режим — просто прячем до перезагрузки
    }
  }

  return (
    <Card
      as="aside"
      aria-labelledby="pwa-title"
      padding="sm"
      className="flex flex-col gap-3 border border-border"
    >
      <div className="flex flex-col gap-1">
        <h2 id="pwa-title" className="text-base font-semibold">
          {p.installTitle}
        </h2>
        <p className="text-sm text-muted">{event ? p.installText : p.iosHint}</p>
      </div>
      <div className="flex gap-2">
        <Button size="md" variant="secondary" className="flex-1" onClick={dismiss}>
          {p.later}
        </Button>
        {event && (
          <Button
            size="md"
            className="flex-1"
            onClick={async () => {
              await event.prompt();
              await event.userChoice;
              setEvent(null);
            }}
          >
            {p.install}
          </Button>
        )}
      </div>
    </Card>
  );
}
