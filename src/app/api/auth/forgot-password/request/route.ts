import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ForgotPasswordRequestBody = {
  email?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) {
    return email;
  }

  const visible = local.slice(0, 1);
  const masked = "*".repeat(Math.max(local.length - 1, 4));
  return `${visible}${masked}@${domain}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotPasswordRequestBody;
  const email = body.email?.trim().toLowerCase() ?? "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const origin = request.headers.get("origin");
  const appUrl = origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const redirectTo = appUrl ? `${appUrl}/forgot-password/reset` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, maskedEmail: maskEmail(email), email });
}
