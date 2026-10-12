import { type NextRequest, NextResponse } from "next/server";
import { decodeSession, homeFor, SESSION_COOKIE } from "@/lib/session-codec";

/** start_url установленного приложения: ведёт на «свой» экран по роли или на вход. */
export function GET(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.redirect(new URL(session ? homeFor(session.role) : "/login", request.url));
}
