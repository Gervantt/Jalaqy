import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const DATA = path.join(process.cwd(), ".e2e-data", "waitlist.json");

test.describe("лендинг", () => {
  test("первый экран, без внешних запросов и горизонтальной прокрутки", async ({
    page,
    baseURL,
  }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      if (!r.url().startsWith(baseURL!) && !r.url().startsWith("data:")) external.push(r.url());
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Зарплата без бухгалтера.");
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBe(0);
  });

  test("вкладки возможностей: стрелки и Home/End", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", { name: "Возможности" });
    await tablist.getByRole("tab", { name: "Расчёт зарплаты" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tablist.getByRole("tab", { name: "Отпуска и табель" })).toBeFocused();
    await expect(tablist.getByRole("tab", { name: "Отпуска и табель" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel", { name: "Отпуска и табель" })).toContainText(
      "без отдельного файла",
    );
    await page.keyboard.press("End");
    await expect(page.getByRole("tabpanel", { name: "Налоги и платёжки" })).toContainText(
      "форму 200.00",
    );
  });

  test("калькулятор считает как сервис", async ({ page }) => {
    await page.goto("/#calc");
    const calc = page.locator("#calc");
    await expect(calc).toContainText(/266\s415\s₸/);
    await calc.getByRole("button", { name: /550\s000/ }).click();
    await expect(calc).toContainText(/448\s575\s₸/);
    await expect(calc).toContainText(/89\s540\s₸/);
    await calc.getByLabel("Есть заявление на вычет 30 МРП").uncheck();
    await expect(calc).toContainText(/−48\s400\s₸/); // ИПН без вычета: 10% × 484 000
    const input = calc.getByLabel("Оклад до удержаний, ₸");
    await input.fill("");
    await input.pressSequentially("1000000");
    await expect(input).toHaveValue("1 000 000");
  });

  test("шаги месяца, цена, FAQ", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: /Подтвердите выплату/ }).click();
    await expect(page.getByRole("tabpanel", { name: /Подтвердите выплату/ })).toContainText(
      "Подтвердить выплату",
    );

    const slider = page.getByRole("slider", { name: "Сотрудников в компании" });
    await slider.focus();
    await page.keyboard.press("Home");
    await expect(page.locator("#price")).toContainText("1 сотрудник");
    await expect(page.locator("#price")).toContainText(/6\s000\s₸/);
    await page.keyboard.press("End");
    await expect(page.locator("#price")).toContainText(/55\s000\s₸/);

    const q = page.getByText("Нужен ли мне бухгалтер?");
    await q.click();
    await expect(page.getByText(/зарплату ему считать уже не нужно/)).toBeVisible();
  });

  test("форма: ошибки, затем заявка сохраняется с согласием и UTM", async ({ page }) => {
    await rm(DATA, { force: true });
    await page.goto("/?utm_source=threads&utm_campaign=pilot#waitlist");
    const form = page.locator("#waitlist");
    await form.getByRole("button", { name: "Оставить заявку" }).click();
    await expect(form.getByText("Напишите, как к вам обращаться")).toBeVisible();
    await expect(form.getByText("Без согласия мы не можем сохранить заявку")).toBeVisible();
    await expect(form.getByLabel("Имя")).toBeFocused();

    await form.getByLabel("Имя").fill("Асель");
    await form.getByLabel("Телефон или Telegram").fill("@tulpan_coffee");
    await form.getByLabel("Сотрудников").fill("12");
    await form.getByRole("radio", { name: "бухгалтер" }).check();
    await form.getByRole("checkbox", { name: /Согласен на обработку/ }).check();
    await form.getByRole("button", { name: "Оставить заявку" }).click();
    await expect(form.getByRole("status")).toContainText("Свяжемся в течение рабочего дня");

    const saved = JSON.parse(await readFile(DATA, "utf8"));
    expect(saved.at(-1)).toMatchObject({
      name: "Асель",
      contact: { kind: "telegram", value: "@tulpan_coffee" },
      employees: 12,
      role: "accountant",
      utm: { utm_source: "threads", utm_campaign: "pilot" },
      source: "threads",
      consent: { accepted: true },
    });
    expect(saved.at(-1).consent.text).toContain("политике конфиденциальности");
  });

  test("API: honeypot, валидация, лимит по IP", async ({ request }, info) => {
    const ip = `10.0.0.${info.project.name === "mobile-390" ? 1 : 2}`;
    const valid = {
      name: "Бот",
      contact: "+77011234514",
      employees: 3,
      role: "owner",
      consent: true,
    };
    const bot = await request.post("/api/waitlist", {
      data: { ...valid, website: "spam.example" },
      headers: { "x-real-ip": ip },
    });
    expect(await bot.json()).toEqual({ ok: true });

    const bad = await request.post("/api/waitlist", {
      data: { ...valid, consent: false },
      headers: { "x-real-ip": ip },
    });
    expect(bad.status()).toBe(422);
    expect((await bad.json()).errors.consent).toBeTruthy();

    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      statuses.push(
        (
          await request.post("/api/waitlist", { data: valid, headers: { "x-real-ip": ip } })
        ).status(),
      );
    }
    expect(statuses).toContain(429);
  });

  test("политика и оферта", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Политика конфиденциальности" })
      .click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Политика конфиденциальности" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /Где хранятся данные/ })).toBeVisible();
    await page.goto("/offer");
    await expect(page.getByRole("heading", { level: 1, name: "Публичная оферта" })).toBeVisible();
  });

  test("при «уменьшить движение» анимации выключены", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const duration = await page
      .getByRole("region", { name: "Коротко о сервисе" })
      .locator("div")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(duration).toBe("none");
    await ctx.close();
  });
});
