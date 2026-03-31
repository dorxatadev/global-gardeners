import { NextResponse } from "next/server";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";
import { getOnboardingStatus } from "@/lib/supabase/onboarding-status";

export async function GET(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const status = await getOnboardingStatus(auth.accessToken);
  const response = NextResponse.json(status);
  auth.applyRefreshedCookies(response);
  return response;
}
