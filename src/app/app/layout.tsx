import type { Metadata } from "next";
import { Suspense } from "react";
import { ToastProvider } from "@/components/ui";
import { t } from "@/i18n";
import { AppNav, AppNavFallback } from "./_components/AppNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <ToastProvider>
      <a
        href="#content"
        className="sr-only z-50 rounded-button bg-surface px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.app.shell.skipToContent}
      </a>
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <Suspense fallback={<AppNavFallback />}>
          <AppNav />
        </Suspense>
        <main
          id="content"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-[1200px] min-w-0 flex-1 flex-col gap-5 px-4 pt-6 pb-10 outline-none md:px-8 md:pt-7"
        >
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
