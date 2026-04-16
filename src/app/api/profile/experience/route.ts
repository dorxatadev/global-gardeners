import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

type ExperienceSettings = {
  gardeningExperience?: string;
  learningStyle?: string;
  challenges?: string[];
  growingZone?: {
    input?: string;
    detectedZone?: string;
    selectedZone?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    skipped?: boolean;
  };
  climate?: string;
};

function sanitizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function sanitizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const unique = new Set(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  return [...unique];
}

function sanitizeGrowingZone(value: unknown): ExperienceSettings["growingZone"] | undefined {
  if (!value || typeof value !== "object") return undefined;

  const source = value as Record<string, unknown>;
  return {
    input: sanitizeString(source.input),
    detectedZone: sanitizeString(source.detectedZone),
    selectedZone: sanitizeString(source.selectedZone),
    city: sanitizeString(source.city),
    state: sanitizeString(source.state),
    country: sanitizeString(source.country),
    postalCode: sanitizeString(source.postalCode),
    skipped: typeof source.skipped === "boolean" ? source.skipped : undefined,
  };
}

function sanitizeExperiencePatch(payload: unknown): ExperienceSettings {
  if (!payload || typeof payload !== "object") return {};
  const source = payload as Record<string, unknown>;

  const patch: ExperienceSettings = {};
  const gardeningExperience = sanitizeString(source.gardeningExperience);
  const learningStyle = sanitizeString(source.learningStyle);
  const climate = sanitizeString(source.climate);
  const challenges = sanitizeStringArray(source.challenges);
  const growingZone = sanitizeGrowingZone(source.growingZone);

  if (gardeningExperience) patch.gardeningExperience = gardeningExperience;
  if (learningStyle) patch.learningStyle = learningStyle;
  if (climate) patch.climate = climate;
  if (challenges) patch.challenges = challenges;
  if (growingZone) patch.growingZone = growingZone;

  return patch;
}

export async function GET(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);
  const { data, error } = await supabase.from("profiles").select("user_settings").eq("user_id", auth.userId).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({
    experience: (data?.user_settings as { experience?: ExperienceSettings } | null)?.experience ?? {},
  });
  auth.applyRefreshedCookies(response);
  return response;
}

export async function POST(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { experience?: unknown };
  const patch = sanitizeExperiencePatch(body.experience);

  const supabase = createAuthedSupabaseClient(auth.accessToken);
  const { data, error } = await supabase.from("profiles").select("user_settings").eq("user_id", auth.userId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const existing = ((data?.user_settings ?? {}) as { experience?: ExperienceSettings }).experience ?? {};
  const userSettings = {
    ...((data?.user_settings ?? {}) as Record<string, unknown>),
    experience: {
      ...existing,
      ...patch,
      growingZone: {
        ...(existing.growingZone ?? {}),
        ...(patch.growingZone ?? {}),
      },
    },
  };

  const { error: updateError } = await supabase.from("profiles").update({ user_settings: userSettings }).eq("user_id", auth.userId);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const response = NextResponse.json({
    experience: (userSettings.experience ?? {}) as ExperienceSettings,
  });
  auth.applyRefreshedCookies(response);
  return response;
}

