"use client";

import { useEffect } from "react";

/** Регистрирует /sw.js (только в production-сборке: в dev он мешал бы горячей перезагрузке). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // без service worker приложение работает, просто без офлайн-экрана
    });
  }, []);
  return null;
}
