import type { Metadata } from "next";
import { MobileShell } from "@/components/mobile/MobileShell";
import { ServiceWorker } from "@/components/pwa/ServiceWorker";
import { BottomTabBar, ToastProvider } from "@/components/ui";
import { meNav } from "./nav";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MeLayout({ children }: LayoutProps<"/me">) {
  return (
    <ToastProvider>
      <ServiceWorker />
      <MobileShell>
        {children}
        <BottomTabBar items={meNav} className="sticky bottom-0 z-20" />
      </MobileShell>
    </ToastProvider>
  );
}
