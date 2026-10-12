import { expect, test } from "@playwright/test";

test.describe("/styleguide", () => {
  test("открывается, шрифты свои, внешних запросов нет", async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (!url.startsWith(baseURL!) && !url.startsWith("data:")) external.push(url);
    });

    await page.goto("/styleguide");
    await expect(page.getByRole("heading", { level: 1, name: "Стайлгайд" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    const fonts = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
    );
    expect(fonts.some((f) => /onest/i.test(f))).toBe(true);
    expect(fonts.some((f) => /golos/i.test(f))).toBe(true);

    expect(external).toEqual([]);
  });

  test("нет горизонтальной прокрутки страницы", async ({ page }) => {
    await page.goto("/styleguide");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("логотип и иконки доступны по имени", async ({ page }) => {
    await page.goto("/styleguide");
    await expect(page.getByRole("img", { name: "Иконка приложения Jalaqy" }).first()).toBeVisible();
    await expect(page.getByRole("img", { name: "Иконка Jalaqy на жёлтом фоне" })).toBeVisible();
  });
});
