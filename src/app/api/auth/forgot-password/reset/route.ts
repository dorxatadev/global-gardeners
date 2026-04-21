import { NextResponse } from "next/server";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

type ForgotPasswordResetBody = {
  password?: string;
};

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
}

export async function POST(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Recovery session expired. Please request a new code." }, { status: 401 });
  }

  const body = (await request.json()) as ForgotPasswordResetBody;
  const password = body.password ?? "";

  if (!password || !isStrongPassword(password)) {
    return NextResponse.json({ error: "Please provide a valid password." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json({ error: "Missing Supabase environment variables." }, { status: 500 });
  }

  const updateResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${auth.accessToken}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!updateResponse.ok) {
    const result = (await updateResponse.json().catch(() => null)) as { msg?: string; error_description?: string } | null;
    return NextResponse.json(
      { error: result?.msg ?? result?.error_description ?? "Unable to reset password." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ success: true });
  auth.applyRefreshedCookies(response);
  return response;
}
