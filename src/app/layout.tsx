import type { Metadata, Viewport } from "next";
import { t } from "@/i18n";
import { golos, onest } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: t.meta.titleDefault, template: t.meta.titleTemplate },
  description: t.meta.description,
  applicationName: t.brand.name,
  appleWebApp: { capable: true, title: t.brand.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0F2A24",
  // контент под «чёлку» в установленном PWA; отступы — через env(safe-area-inset-*)
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${onest.variable} ${golos.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
