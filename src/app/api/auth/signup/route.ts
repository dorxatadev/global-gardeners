import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setAuthCookies } from "@/lib/supabase/auth-cookies";

type SignupBody = {
  firstName?: string;
  fullName?: string;
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SignupBody;
  const fullName = body.fullName?.trim() || body.firstName?.trim() || "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!fullName || !email || !password || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide valid signup details." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({
    user: data.user,
    session: data.session,
    requiresEmailConfirmation: !data.session,
  });

  if (data.session) {
    setAuthCookies(response, data.session);
  }

  return response;
}
