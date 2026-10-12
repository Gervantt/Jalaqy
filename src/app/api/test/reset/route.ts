import { resetDb } from "@/lib/api/mock/db";

/** Только для e2e (JALAQY_E2E=1): вернуть мок-данные к исходным. В остальных случаях — 404. */
export async function POST() {
  if (process.env.JALAQY_E2E !== "1" || process.env.JALAQY_API_URL) {
    return new Response(null, { status: 404 });
  }
  resetDb();
  return new Response(null, { status: 204 });
}
