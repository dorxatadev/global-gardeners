import { NextResponse } from "next/server";

const AUTH_COOKIE_NAMES = ["gg_session", "gg_access_token", "gg_refresh_token", "gg_persistent"] as const;

export async function POST() {
  const response = NextResponse.json({ loggedOut: true });

  for (const cookieName of AUTH_COOKIE_NAMES) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
