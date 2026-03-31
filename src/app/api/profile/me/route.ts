import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

function toNickname(fullName: string) {
  const normalized = fullName.trim().replace(/\s+/g, "").toLowerCase();
  return normalized ? `@${normalized}` : "";
}

export async function GET(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unable to resolve authenticated user." }, { status: 400 });
  }

  const metadataName =
    typeof authData.user.user_metadata?.full_name === "string" ? authData.user.user_metadata.full_name.trim() : "";
  const emailName = authData.user.email?.split("@")[0]?.trim() ?? "";
  const fallbackFullName = metadataName || emailName || "Global Gardener";

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", auth.userId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let profile = data;

  if (!profile) {
    const { data: inserted, error: insertError } = await supabase
      .from("profiles")
      .insert({
        user_id: auth.userId,
        full_name: fallbackFullName,
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    profile = inserted;
  }

  const fullNameValue = typeof profile.full_name === "string" ? profile.full_name : "";
  const nicknameValue = typeof profile.nickname === "string" ? profile.nickname : "";
  const photoValue = typeof profile.profile_photo_url === "string" ? profile.profile_photo_url : null;

  const normalizedFullName = fullNameValue.trim() || fallbackFullName;
  const normalizedNickname = nicknameValue.trim() || toNickname(normalizedFullName);

  const response = NextResponse.json({
    fullName: normalizedFullName,
    nickname: normalizedNickname,
    profilePhotoUrl: photoValue,
  });
  auth.applyRefreshedCookies(response);
  return response;
}
