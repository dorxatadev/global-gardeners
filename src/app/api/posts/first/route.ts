import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

export async function POST(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);

  const { count } = await supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", auth.userId);
  if ((count ?? 0) > 0) {
    const response = NextResponse.json({ created: false, reason: "already_exists" });
    auth.applyRefreshedCookies(response);
    return response;
  }

  const { error } = await supabase.from("posts").insert({
    user_id: auth.userId,
    content: "First onboarding post",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({ created: true });
  auth.applyRefreshedCookies(response);
  return response;
}
