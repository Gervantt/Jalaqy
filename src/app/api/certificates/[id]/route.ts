import { t } from "@/i18n";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { getSession } from "@/lib/session";

/** Справка (в моке — текстовый файл). Сотрудник получает только свою готовую справку. */
export async function GET(_request: Request, ctx: RouteContext<"/api/certificates/[id]">) {
  const session = await getSession();
  if (!session?.employeeId) return new Response(null, { status: 401 });
  const { id } = await ctx.params;
  const [list, employee, company] = await Promise.all([
    api.employees.certificates(session.employeeId),
    api.employees.get(session.employeeId),
    api.company.get(),
  ]);
  const cert = list.find((c) => c.id === id && c.status === "ready");
  if (!cert) return new Response(null, { status: 404 });
  const content = [
    `СПРАВКА — ${t.mobile.certificate.kinds[cert.kind].toUpperCase()} (демо)`,
    `${company.name}, БИН ${company.bin}`,
    `${employee.lastName} ${employee.firstName}, ${employee.position}`,
    `Работает с ${formatDate(employee.hireDate)}`,
    `Назначение: ${cert.purpose}`,
  ].join("\r\n");
  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="jalaqy-spravka-${cert.id}.txt"`,
      "cache-control": "no-store",
    },
  });
}
