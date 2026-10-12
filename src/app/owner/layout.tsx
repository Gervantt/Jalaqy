import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui";
import { MobileShell } from "@/components/mobile/MobileShell";
import { ServiceWorker } from "@/components/pwa/ServiceWorker";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function OwnerLayout({ children }: LayoutProps<"/owner">) {
  return (
    <ToastProvider>
      <ServiceWorker />
      <MobileShell>{children}</MobileShell>
    </ToastProvider>
  );
}
