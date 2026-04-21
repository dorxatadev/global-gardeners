"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DetectedZone = {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  zone: string;
};

const GROWING_ZONES = [
  "1a", "1b", "2a", "2b", "3a", "3b", "4a", "4b", "5a", "5b", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b",
  "10a", "10b", "11a", "11b", "12a", "12b", "13a", "13b",
];

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 text-[#33333380] transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
      fill="none"
      viewBox="0 0 16 16"
    >
      <path d="M4 6.5L8 10L12 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  );
}

function isLookupCandidate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^\d{5}(?:-\d{4})?$/.test(trimmed)) return true;
  return trimmed.length >= 3;
}

export default function GrowingZonePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [detectedZone, setDetectedZone] = useState<DetectedZone | null>(null);
  const [showManualOverride, setShowManualOverride] = useState(false);
  const [isManualDropdownOpen, setIsManualDropdownOpen] = useState(false);
  const [manualZone, setManualZone] = useState("");

  const selectedZone = manualZone || detectedZone?.zone || "";
  const canContinue = Boolean(selectedZone);

  const saveGrowingZone = async (skipped: boolean) => {
    await fetch("/api/profile/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience: {
          growingZone: {
            input: inputValue.trim() || undefined,
            detectedZone: detectedZone?.zone,
            selectedZone: skipped ? undefined : selectedZone || undefined,
            city: detectedZone?.city,
            state: detectedZone?.state,
            country: detectedZone?.country,
            postalCode: detectedZone?.postalCode,
            skipped,
          },
        },
      }),
    });
  };

  useEffect(() => {
    if (!isLookupCandidate(inputValue)) {
      setLookupError("");
      setDetectedZone(null);
      setManualZone("");
      setShowManualOverride(false);
      setIsManualDropdownOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setLookupError("");

      try {
        const response = await fetch(`/api/profile/growing-zone?query=${encodeURIComponent(inputValue.trim())}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as DetectedZone & { error?: string };

        if (!response.ok) {
          setDetectedZone(null);
          setManualZone("");
          setShowManualOverride(false);
          setIsManualDropdownOpen(false);
          setLookupError(payload.error ?? "Unable to detect growing zone.");
          return;
        }

        setDetectedZone({
          city: payload.city,
          state: payload.state,
          country: payload.country,
          postalCode: payload.postalCode,
          zone: payload.zone,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setDetectedZone(null);
          setManualZone("");
          setShowManualOverride(false);
          setIsManualDropdownOpen(false);
          setLookupError("Unable to detect growing zone.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 550);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [inputValue]);

  const locationLabel = useMemo(() => {
    if (!detectedZone) return "";
    const segments = [detectedZone.city, detectedZone.state, detectedZone.country].filter(Boolean);
    return segments.join(", ");
  }, [detectedZone]);

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header fixed left-0 right-0 top-0 z-30 flex w-full items-center border-b border-black/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              className="rounded-full bg-[#f5f5f5] p-2 text-[#7a7a7a]"
              onClick={() => router.push("/settings/experience/challenges")}
            >
              <BackIcon />
            </button>
            <p className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#31674c]">Global Gardeners</p>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 flex-col px-4 pb-[112px] pt-[96px]">
          <div className="inline-flex w-fit rounded-2xl border border-[#3333330d] bg-[#ffffff80] px-2 py-1 text-[14px] font-medium leading-5 text-[#333333cc]">
            Step 4 of 5
          </div>
          <h1 className="mt-3 text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">What&apos;s your growing zone?</h1>
          <p className="mt-4 text-[16px] font-medium leading-6 text-[#333333cc]">Optional, but helps us recommend what to plant and when.</p>

          <div className="mt-6">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Enter zip code, city or state"
              className="h-[52px] w-full rounded-2xl border border-[#e5e5e5] bg-white px-4 text-[14px] font-medium leading-5 text-[#333333] outline-none placeholder:text-[#33333380] focus:border-[#457941]"
            />
          </div>

          {isLoading ? <p className="mt-3 text-[12px] font-medium leading-4 text-[#33333399]">Detecting location...</p> : null}
          {lookupError ? <p className="mt-3 text-[12px] font-medium leading-4 text-[#ef4444]">{lookupError}</p> : null}

          {detectedZone ? (
            <div className="mt-4 flex flex-col gap-2">
              <div className="rounded-xl border border-[#3333331a] bg-white p-3">
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold leading-5 text-[#333333]">
                    Growing zone: <span className="text-[#457941]">{detectedZone.zone}</span>
                  </p>
                  <p className="text-[14px] font-normal leading-5 text-[#33333380]">
                    {locationLabel}
                    <br />
                    Zip code: {detectedZone.postalCode}
                  </p>
                </div>
              </div>
              <p className="text-[12px] font-medium leading-4 text-[#333333cc]">Detected from your location.</p>
            </div>
          ) : null}

          {detectedZone ? (
            <button
              type="button"
              className="mt-4 w-fit text-[14px] font-medium leading-5 text-[#457941] underline underline-offset-2"
              onClick={() => {
                setShowManualOverride((current) => !current);
                setIsManualDropdownOpen(false);
              }}
            >
              Wrong zone? Enter it manually
            </button>
          ) : null}

          {showManualOverride ? (
            <div className="mt-4">
              <label htmlFor="manual-zone" className="mb-2 block text-[14px] font-medium leading-5 text-[#333333]">
                Choose a different growing zone
              </label>
              <button
                id="manual-zone"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isManualDropdownOpen}
                className="flex min-h-[48px] w-full items-center gap-2 rounded-lg border border-[#0000000d] bg-white px-4 py-3 text-left"
                onClick={() => setIsManualDropdownOpen((current) => !current)}
              >
                <span className={`flex-1 min-w-0 text-[14px] leading-5 ${manualZone ? "font-medium text-[#333333]" : "font-normal text-[#33333380]"}`}>
                  {manualZone || "Select your growing zone"}
                </span>
                <ChevronIcon isOpen={isManualDropdownOpen} />
              </button>
              {isManualDropdownOpen ? (
                <div className="mt-2 max-h-[180px] overflow-y-auto rounded-md border border-[#e5e5e5] bg-white px-3 py-2">
                  {GROWING_ZONES.map((zone, index) => (
                    <button
                      key={zone}
                      type="button"
                      role="option"
                      aria-selected={manualZone === zone}
                      className={`w-full py-2 text-left text-[12px] font-normal leading-[1.3] tracking-[0.18px] text-[#0a0a0a] ${
                        index !== GROWING_ZONES.length - 1 ? "border-b border-[#e5e5e5]" : ""
                      }`}
                      onClick={() => {
                        setManualZone(zone);
                        setIsManualDropdownOpen(false);
                      }}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 flex w-full flex-col gap-2 bg-[#f8f6f1] px-4 pb-4 pt-5">
          <button
            type="button"
            disabled={!canContinue}
            aria-disabled={!canContinue}
            className={`flex h-[52px] w-full items-center justify-center rounded-full text-[14px] font-medium leading-5 text-[#fafafa] transition ${
              canContinue ? "bg-[#457941] hover:bg-[#3b6838]" : "cursor-not-allowed bg-[#99b297] pointer-events-none"
            }`}
            onClick={() => {
              if (!canContinue) return;
              void (async () => {
                await saveGrowingZone(false);
                router.push("/settings/experience/climate");
              })();
            }}
          >
            Continue
          </button>
          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-white px-6 text-[14px] font-medium leading-5 text-[#333333] transition hover:bg-[#f5f5f5]"
            onClick={() => {
              void (async () => {
                await saveGrowingZone(true);
                router.push("/settings/experience/climate");
              })();
            }}
          >
            Skip this step
          </button>
        </div>
      </section>
    </main>
  );
}

