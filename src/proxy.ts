import { NextResponse, type NextRequest } from "next/server";
import { canAccess, decodeSession, homeFor, SESSION_COOKIE } from "@/lib/session-codec";

/**
 * Оптимистичная проверка доступа: без сессии — на /login?next=…,
 * с чужой ролью — на свою главную. Окончательная проверка — в данных (requireSession).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (!canAccess(session.role, pathname)) {
    return NextResponse.redirect(new URL(homeFor(session.role), request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/owner/:path*", "/me/:path*"],
};
