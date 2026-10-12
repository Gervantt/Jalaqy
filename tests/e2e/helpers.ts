import type { BrowserContext, Page } from "@playwright/test";
import type { Role } from "../../src/lib/api/contracts";
import { encodeSession, SESSION_COOKIE } from "../../src/lib/session-codec";

export async function resetData(page: Page) {
  const res = await page.request.post("/api/test/reset");
  if (res.status() !== 204)
    throw new Error(`reset: ${res.status()} — сервер запущен без JALAQY_E2E=1?`);
}

/** Войти без UI: кладём мок-сессию в cookie. */
export async function loginAs(context: BrowserContext, baseURL: string, role: Role = "accountant") {
  const session =
    role === "employee"
      ? { userId: "u-daniyar", role, name: "Данияр К.", companyId: "tulpan", employeeId: "daniyar" }
      : role === "owner"
        ? { userId: "u-owner", role, name: "Ержан Сейткали", companyId: "tulpan" }
        : { userId: "u-acc", role, name: "Гульмира Нурланова", companyId: "tulpan" };
  await context.addCookies([{ name: SESSION_COOKIE, value: encodeSession(session), url: baseURL }]);
}

/** Неразрывные пробелы → обычные, чтобы сравнивать суммы. */
export const plain = (s: string | null) => (s ?? "").replace(/ /g, " ");
