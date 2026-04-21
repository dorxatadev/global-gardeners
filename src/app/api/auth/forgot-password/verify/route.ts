import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/supabase/auth-cookies";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ForgotPasswordVerifyBody = {
  email?: string;
  code?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidOtp(code: string) {
  return /^\d{8}$/.test(code);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotPasswordVerifyBody;
  const email = body.email?.trim().toLowerCase() ?? "";
  const code = body.code?.trim() ?? "";

  if (!email || !isValidEmail(email) || !code || !isValidOtp(code)) {
    return NextResponse.json({ error: "Please provide a valid email and 8-digit code." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "recovery",
  });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? "Invalid or expired code." }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  setAuthCookies(response, data.session, { persistent: false });

  return response;
}
