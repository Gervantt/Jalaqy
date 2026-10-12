import { mkdirSync } from "node:fs";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { loginAs, resetData } from "../e2e/helpers";

/**
 * Скриншоты всех экранов на 390 и 1440 → docs/screens/<экран>-<ширина>.png.
 * Плюс кадры для сравнения с design/screens (в 2× и размере макета) → docs/screens/compare/.
 * Порядок повторяет демо: панель и владелец — до подтверждения, сотрудник — после (октябрь, как в макете).
 */
const OUT = "docs/screens";
const WIDTHS = [390, 1440] as const;

test.describe.configure({ mode: "serial" });

async function shoot(page: Page, name: string, path: string) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
  }
}

async function compareShot(
  context: BrowserContext,
  path: string,
  file: string,
  width: number,
  height: number,
) {
  const page = await context.browser()!.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
    storageState: await context.storageState(),
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/compare/${file}` });
  await page.close();
}

test("все экраны", async ({ page, context, baseURL }) => {
  test.setTimeout(240_000);
  mkdirSync(`${OUT}/compare`, { recursive: true });
  await resetData(page);

  // Публичные
  await shoot(page, "landing", "/");
  await shoot(page, "privacy", "/privacy");
  await shoot(page, "offer", "/offer");
  await shoot(page, "login", "/login");
  await shoot(page, "onboarding", "/onboarding");
  await shoot(page, "offline", "/offline");
  await shoot(page, "not-found", "/net-takoy-stranicy");
  await shoot(page, "styleguide", "/styleguide");

  // Бухгалтер (расчёт за октябрь не отправлен — как в Payroll.dc.html)
  await loginAs(context, baseURL!, "accountant");
  await compareShot(context, "/app/payroll", "payroll-1440@2x.png", 1440, 947);
  await shoot(page, "app-payroll", "/app/payroll");
  await shoot(page, "app-employees", "/app/employees");
  await shoot(page, "app-employee-card", "/app/employees/daniyar");
  await shoot(page, "app-timesheet", "/app/timesheet");
  await shoot(page, "app-timesheet-november", "/app/timesheet?month=2026-11");
  await shoot(page, "app-contracts", "/app/contracts");
  await shoot(page, "app-taxes", "/app/taxes");
  await shoot(page, "app-settings", "/app/settings");

  // Владелец (до подтверждения — как в Owner-Approve.dc.html)
  await context.clearCookies();
  await loginAs(context, baseURL!, "owner");
  await compareShot(context, "/owner", "owner-390@2x.png", 390, 844);
  await shoot(page, "owner", "/owner");
  await shoot(page, "owner-breakdown", "/owner/breakdown");
  await page.goto("/owner");
  await page.getByRole("button", { name: "Подтвердить выплату" }).click();
  await page.waitForURL(/approved/);
  await shoot(page, "owner-approved", "/owner/approved?period=2026-10");

  // Сотрудник (после подтверждения — октябрь, как в Payslip.dc.html)
  await context.clearCookies();
  await loginAs(context, baseURL!, "employee");
  await compareShot(context, "/me", "payslip-390@2x.png", 390, 844);
  await shoot(page, "me-payslip", "/me");
  await shoot(page, "me-leave", "/me/leave");
  await shoot(page, "me-certificate", "/me/certificate");
  await shoot(page, "me-history", "/me/history");
  await shoot(page, "me-profile", "/me/profile");
});
