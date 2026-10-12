import type { NextRequest } from "next/server";
import { api } from "@/lib/api";
import { isPeriod } from "@/lib/period";
import { getSession } from "@/lib/session";

/** Скачивание выгрузки для 1С: CSV (UTF-8 с BOM, разделитель «;»). */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role === "employee") return new Response(null, { status: 401 });
  const period = request.nextUrl.searchParams.get("period");
  if (!isPeriod(period)) return new Response(null, { status: 400 });
  const file = await api.payroll.export1c(period);
  return new Response(file.content, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${file.filename}"`,
      "cache-control": "no-store",
    },
  });
}
