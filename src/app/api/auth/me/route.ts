import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

export async function GET(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  const response = NextResponse.json({
    loggedIn: true,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
  auth.applyRefreshedCookies(response);
  return response;
}
