import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import type { Role } from "../../src/lib/api/contracts";
import { loginAs, resetData } from "./helpers";

/**
 * Доступность и вёрстка всех экранов на 390, 768, 1280, 1440:
 * axe-core (WCAG 2.1 AA: контраст, подписи, роли), один h1, нет горизонтальной прокрутки.
 * Запускается в одном проекте — ширины перебираются внутри.
 */
const WIDTHS = [390, 768, 1280, 1440];

const PAGES: Array<{ path: string; role?: Role }> = [
  { path: "/" },
  { path: "/privacy" },
  { path: "/offer" },
  { path: "/login" },
  { path: "/onboarding" },
  { path: "/offline" },
  { path: "/styleguide" },
  { path: "/app/payroll", role: "accountant" },
  { path: "/app/employees", role: "accountant" },
  { path: "/app/employees/daniyar", role: "accountant" },
  { path: "/app/timesheet", role: "accountant" },
  { path: "/app/contracts", role: "accountant" },
  { path: "/app/taxes", role: "accountant" },
  { path: "/app/settings", role: "accountant" },
  { path: "/owner", role: "owner" },
  { path: "/owner/breakdown", role: "owner" },
  { path: "/me", role: "employee" },
  { path: "/me/leave", role: "employee" },
  { path: "/me/certificate", role: "employee" },
  { path: "/me/history", role: "employee" },
  { path: "/me/profile", role: "employee" },
];

async function audit(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes
        .map((n) => n.target.join(" "))
        .slice(0, 3)
        .join(" | ")}`,
  );
}

test.describe("доступность и ширины", () => {
  for (const { path, role } of PAGES) {
    test(path, async ({ page, context, baseURL }) => {
      test.skip(test.info().project.name !== "desktop-1440", "ширины перебираются в одном проекте");
      await resetData(page);
      if (role) await loginAs(context, baseURL!, role);
      const problems: string[] = [];
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (overflow > 0) problems.push(`${width}px: горизонтальная прокрутка ${overflow}px`);
        for (const v of await audit(page)) problems.push(`${width}px: ${v}`);
      }
      expect(problems).toEqual([]);
    });
  }
});
