import { api, isApiError } from "@/lib/api";
import { getSession } from "@/lib/session";

/** Черновик платёжки (текст) для загрузки в интернет-банк. */
export async function GET(_request: Request, ctx: RouteContext<"/api/payments/[id]">) {
  const session = await getSession();
  if (!session || session.role === "employee") return new Response(null, { status: 401 });
  const { id } = await ctx.params;
  try {
    const file = await api.taxes.paymentOrder(decodeURIComponent(id));
    return new Response(file.content, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${file.filename}"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    if (isApiError(e)) return new Response(null, { status: e.status });
    throw e;
  }
}
