import type { NextResponse } from "next/server";

type SessionLike = {
  access_token: string;
  refresh_token: string;
};

export function setAuthCookies(
  response: NextResponse,
  session: SessionLike,
  options?: { persistent?: boolean },
) {
  const secure = process.env.NODE_ENV === "production";
  const persistent = options?.persistent ?? true;
  const common = {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    path: "/",
  };

  response.cookies.set(
    "gg_session",
    "1",
    persistent ? { ...common, maxAge: 60 * 60 * 24 * 30 } : common,
  );

  response.cookies.set(
    "gg_access_token",
    session.access_token,
    persistent ? { ...common, maxAge: 60 * 60 * 24 * 30 } : common,
  );

  response.cookies.set(
    "gg_refresh_token",
    session.refresh_token,
    persistent ? { ...common, maxAge: 60 * 60 * 24 * 30 } : common,
  );

  response.cookies.set(
    "gg_persistent",
    persistent ? "1" : "0",
    persistent ? { ...common, maxAge: 60 * 60 * 24 * 30 } : common,
  );
}
