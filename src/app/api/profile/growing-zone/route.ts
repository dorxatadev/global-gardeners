import { NextResponse } from "next/server";

type LookupResult = {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  zone: string;
};

function normalizeInput(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isLikelyZip(value: string) {
  return /^\d{5}(?:-\d{4})?$/.test(value.trim());
}

function zoneFromLatitude(latitude: number) {
  const lat = Math.abs(latitude);

  if (lat >= 66) return "1a";
  if (lat >= 63) return "1b";
  if (lat >= 60) return "2a";
  if (lat >= 57) return "2b";
  if (lat >= 54) return "3a";
  if (lat >= 51) return "3b";
  if (lat >= 48) return "4a";
  if (lat >= 45) return "4b";
  if (lat >= 42) return "5a";
  if (lat >= 39) return "5b";
  if (lat >= 36) return "6a";
  if (lat >= 33) return "6b";
  if (lat >= 30) return "7a";
  if (lat >= 27) return "7b";
  if (lat >= 24) return "8a";
  if (lat >= 21) return "8b";
  if (lat >= 18) return "9a";
  if (lat >= 15) return "9b";
  if (lat >= 12) return "10a";
  if (lat >= 9) return "10b";
  if (lat >= 6) return "11a";
  if (lat >= 3) return "11b";
  if (lat >= 1.5) return "12a";
  if (lat >= 0.75) return "12b";
  if (lat >= 0.4) return "13a";
  return "13b";
}

async function lookupByZip(zip: string): Promise<LookupResult | null> {
  const zipResponse = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`, {
    cache: "no-store",
  });

  if (!zipResponse.ok) {
    return null;
  }

  const data = (await zipResponse.json()) as {
    "post code"?: string;
    country?: string;
    places?: Array<{
      "place name"?: string;
      "state abbreviation"?: string;
      state?: string;
      latitude?: string;
      longitude?: string;
    }>;
  };

  const place = data.places?.[0];
  if (!place?.latitude || !place?.longitude || !place["place name"]) {
    return null;
  }

  const latitude = Number(place.latitude);
  const longitude = Number(place.longitude);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    city: place["place name"],
    state: place["state abbreviation"] || place.state || "",
    country: data.country || "United States",
    postalCode: data["post code"] || zip,
    latitude,
    longitude,
    zone: zoneFromLatitude(latitude),
  };
}

async function lookupByCityState(query: string): Promise<LookupResult | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
      headers: {
        "User-Agent": "GlobalGardeners/1.0 (onboarding growing zone lookup)",
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Array<{
    lat?: string;
    lon?: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      postcode?: string;
      country?: string;
    };
  }>;

  const first = data[0];
  if (!first?.lat || !first?.lon) {
    return null;
  }

  const latitude = Number(first.lat);
  const longitude = Number(first.lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  const address = first.address ?? {};

  return {
    city: address.city || address.town || address.village || query,
    state: address.state || "",
    country: address.country || "",
    postalCode: address.postcode || "",
    latitude,
    longitude,
    zone: zoneFromLatitude(latitude),
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("query") ?? "";
  const query = normalizeInput(raw);

  if (!query) {
    return NextResponse.json({ error: "Enter ZIP code, city or state." }, { status: 400 });
  }

  try {
    const result = isLikelyZip(query) ? await lookupByZip(query) : await lookupByCityState(query);

    if (!result) {
      return NextResponse.json({ error: "Unable to detect growing zone for this location." }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to detect growing zone right now." }, { status: 500 });
  }
}

