import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

/** Съёмка экранов в docs/screens: npm run screens */
export default defineConfig({
  ...base,
  testDir: "tests/screens",
  outputDir: "test-results/screens",
  projects: [{ name: "screens", use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" } }],
});
