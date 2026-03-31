import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setAuthCookies } from "@/lib/supabase/auth-cookies";
import { getOnboardingStatus } from "@/lib/supabase/onboarding-status";

type LoginBody = {
  email?: string;
  password?: string;
  keepSignedIn?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const keepSignedIn = body.keepSignedIn ?? false;

  if (!email || !password || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email and password." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message ?? "Invalid email or password." }, { status: 401 });
  }

  const onboardingStatus = await getOnboardingStatus(data.session.access_token);
  const response = NextResponse.json({ user: data.user, nextStep: onboardingStatus.nextStep });
  setAuthCookies(response, data.session, { persistent: keepSignedIn });
  return response;
}
