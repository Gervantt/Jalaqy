import type { MetadataRoute } from "next";
import { t } from "@/i18n";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/launch",
    name: t.brand.name,
    short_name: t.brand.name,
    description: t.meta.description,
    lang: "ru",
    start_url: "/launch",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F3F5F0",
    theme_color: "#0F2A24",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
