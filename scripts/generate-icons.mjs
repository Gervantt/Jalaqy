/**
 * Генерация PNG-иконок PWA из SVG-знака (design/Main.dc.html) через Playwright.
 * Запуск: node scripts/generate-icons.mjs → public/icons/*.png и src/app/apple-icon.png
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const MARK = `
  <path d="M18 8 H38 L48 18 V54 a2 2 0 0 1 -2 2 H18 a2 2 0 0 1 -2 -2 V10 a2 2 0 0 1 2 -2 z" fill="#F3F5F0"/>
  <path d="M38 8 V18 H48" stroke="#0F2A24" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
  <path d="M23 35 L29.5 41.5 L41 28.5" stroke="#F2C14E" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

/** rounded — скруглённая плитка (radius 28/120); markShare — доля знака от стороны. */
function svg(size, { rounded, markShare }) {
  const r = rounded ? Math.round((size * 28) / 120) : 0;
  const mark = size * markShare;
  const offset = (size - mark) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${r}" fill="#0F2A24"/>
    <svg x="${offset}" y="${offset}" width="${mark}" height="${mark}" viewBox="0 0 64 64">${MARK}</svg>
  </svg>`;
}

const targets = [
  { file: "public/icons/icon-192.png", size: 192, rounded: true, markShare: 2 / 3 },
  { file: "public/icons/icon-512.png", size: 512, rounded: true, markShare: 2 / 3 },
  // maskable: фон на всю площадь, знак в безопасной зоне (круг 80%)
  { file: "public/icons/maskable-512.png", size: 512, rounded: false, markShare: 0.56 },
  // iOS сам скругляет углы и не любит прозрачность
  { file: "src/app/apple-icon.png", size: 180, rounded: false, markShare: 0.62 },
];

mkdirSync("public/icons", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const t of targets) {
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg(t.size, t)}</body></html>`,
  );
  await page.locator("svg").first().screenshot({ path: t.file, omitBackground: true });
  console.log("✓", t.file);
}
await browser.close();
