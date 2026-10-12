import "server-only";
import type { JalaqyApi } from "./client";
import { createHttpApi } from "./http";
import { mockApi } from "./mock";

/**
 * Точка входа в данные для серверных компонентов и Server Actions.
 * JALAQY_API_URL задан → настоящий бэкенд; иначе — мок в памяти.
 */
export const api: JalaqyApi = process.env.JALAQY_API_URL
  ? createHttpApi(process.env.JALAQY_API_URL)
  : mockApi;

export { ApiError, isApiError } from "./client";
export type * from "./contracts";
