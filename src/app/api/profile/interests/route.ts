import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

function sanitizeInterests(interests: unknown): string[] {
  if (!Array.isArray(interests)) return [];
  const unique = new Set(
    interests
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  return [...unique];
}

export async function GET(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);

  const { data, error } = await supabase.from("profiles").select("interests").eq("user_id", auth.userId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({
    interests: sanitizeInterests(data?.interests),
  });
  auth.applyRefreshedCookies(response);
  return response;
}

export async function POST(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { interests?: unknown };
  const interests = sanitizeInterests(body.interests);
  if (interests.length < 3) {
    return NextResponse.json({ error: "Please select at least 3 interests." }, { status: 400 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);

  const { error } = await supabase.from("profiles").update({ interests }).eq("user_id", auth.userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({ interests });
  auth.applyRefreshedCookies(response);
  return response;
}
