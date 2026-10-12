import type { Metadata, Viewport } from "next";
import { t } from "@/i18n";
import { golos, onest } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: t.meta.titleDefault, template: t.meta.titleTemplate },
  description: t.meta.description,
};

export const viewport: Viewport = {
  themeColor: "#0F2A24",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${onest.variable} ${golos.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
