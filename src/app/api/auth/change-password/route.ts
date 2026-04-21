import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
}

export async function POST(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as ChangePasswordBody;
  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (!currentPassword || !newPassword || !isStrongPassword(newPassword)) {
    return NextResponse.json({ error: "Please provide valid password details." }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: "New password must be different from current password." }, { status: 400 });
  }

  const authedSupabase = createAuthedSupabaseClient(auth.accessToken);
  const { data: userData, error: userError } = await authedSupabase.auth.getUser();
  const userEmail = userData.user?.email?.trim().toLowerCase() ?? "";

  if (userError || !userEmail) {
    return NextResponse.json({ error: "Unable to resolve authenticated user." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: currentPassword,
  });

  if (signInError) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const { error: updateError } = await authedSupabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  auth.applyRefreshedCookies(response);
  return response;
}
