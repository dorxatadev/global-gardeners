import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";

export type OnboardingStatus = {
  pricingCompleted: boolean;
  interestsCompleted: boolean;
  firstPostCompleted: boolean;
  nextStep: "/feed" | "/pricing" | "/interests" | "/onboarding";
};

export async function getOnboardingStatus(accessToken: string): Promise<OnboardingStatus> {
  const supabase = createAuthedSupabaseClient(accessToken);
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    return {
      pricingCompleted: false,
      interestsCompleted: false,
      firstPostCompleted: false,
      nextStep: "/pricing",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_selected_at, interests")
    .eq("user_id", userId)
    .single();

  const { count: postCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  const pricingCompleted = Boolean(profile?.subscription_selected_at);
  const interestsCompleted = interests.length >= 3;
  const firstPostCompleted = (postCount ?? 0) > 0;

  if (!pricingCompleted) {
    return { pricingCompleted, interestsCompleted, firstPostCompleted, nextStep: "/pricing" };
  }
  if (!interestsCompleted) {
    return { pricingCompleted, interestsCompleted, firstPostCompleted, nextStep: "/interests" };
  }
  if (!firstPostCompleted) {
    return { pricingCompleted, interestsCompleted, firstPostCompleted, nextStep: "/onboarding" };
  }
  return { pricingCompleted, interestsCompleted, firstPostCompleted, nextStep: "/feed" };
}
