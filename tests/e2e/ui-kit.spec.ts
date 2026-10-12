import { expect, test } from "@playwright/test";

test.describe("UI-кит на /styleguide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/styleguide");
  });

  test("модалка: открывается с клавиатуры, фокус внутри, Esc закрывает и возвращает фокус", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "Открыть окно" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Отправить расчёт на подтверждение?" });
    await expect(dialog).toBeVisible();
    // фокус внутри окна
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("модалка: кнопка в состоянии загрузки, затем закрытие", async ({ page }) => {
    await page.getByRole("button", { name: "Открыть окно" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Отправить на подтверждение" }).click();
    await expect(
      dialog.getByRole("button", { name: /Отправить на подтверждение/ }),
    ).toHaveAttribute("aria-busy", "true");
    await expect(dialog).toBeHidden();
  });

  test("шторка закрывается кнопкой «Закрыть»", async ({ page }) => {
    await page.getByRole("button", { name: "Открыть шторку" }).click();
    const sheet = page.getByRole("dialog", { name: "Заявка на отпуск" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: "Закрыть" }).click();
    await expect(sheet).toBeHidden();
  });

  test("тосты попадают в живые регионы и скрываются", async ({ page }) => {
    await page.getByRole("button", { name: "Показать успех" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Расчёт отправлен владельцу" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Показать ошибку" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "Не удалось выгрузить в 1С" });
    await expect(alert).toBeVisible();
    await alert.getByRole("button", { name: "Скрыть уведомление" }).click();
    await expect(alert.getByText("Не удалось выгрузить в 1С")).toBeHidden();
  });

  test("мобильное меню: выезжает, пункты — ссылки, Esc закрывает", async ({ page }) => {
    const open = page.locator("header").getByRole("button", { name: "Открыть меню" });
    await open.click();
    const drawer = page.getByRole("dialog", { name: "Основное меню" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Зарплата" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(open).toBeFocused();
  });

  test("таблица: область прокрутки доступна с клавиатуры", async ({ page }) => {
    const region = page.getByRole("region", { name: /Зарплата за октябрь 2026/ });
    await region.focus();
    await expect(region).toBeFocused();
  });

  test("switch переключается с клавиатуры", async ({ page }) => {
    const sw = page.getByRole("switch", { name: /SMS-уведомления · Обычное/ });
    await sw.focus();
    await page.keyboard.press("Space");
    await expect(sw).toBeChecked();
  });

  test("поле суммы форматирует ввод", async ({ page }) => {
    const input = page.getByRole("textbox", { name: "Оклад, ₸" }).first();
    await input.fill("");
    await input.pressSequentially("1558890");
    await expect(input).toHaveValue("1 558 890");
  });

  test("у всех кнопок есть доступное имя", async ({ page }) => {
    const unnamed = await page
      .locator("button")
      .evaluateAll((buttons) =>
        buttons
          .filter((b) => !(b.getAttribute("aria-label") || b.textContent?.trim()))
          .map((b) => b.outerHTML.slice(0, 120)),
      );
    expect(unnamed).toEqual([]);
  });
});
