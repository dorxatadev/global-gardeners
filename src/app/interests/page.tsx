"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const INTERESTS = [
  "Vegetable Gardening",
  "Indoor Plants",
  "Organic Gardening",
  "Fruit Trees",
  "Succulents",
  "Vertical Gardening",
  "Water Conservation",
  "Hügelkultur",
  "Wildlife Preservation",
  "Season Extension",
  "Flower Gardening",
  "Hydroponics",
  "Landscaping",
  "Herbs",
  "Composting",
  "Container Gardening",
  "Smart Gardening",
  "Pollinator Gardens",
  "Greenhouse Growing",
  "Sustainability",
];

const MIN_REQUIRED_TOPICS = 3;

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 4.5L11.25 9L6.75 13.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    () => new Set(),
  );

  const selectedCount = selectedInterests.size;
  const remainingToSelect = Math.max(MIN_REQUIRED_TOPICS - selectedCount, 0);
  const canContinue = selectedCount >= MIN_REQUIRED_TOPICS;

  const selectedCountMessage = useMemo(() => {
    if (canContinue) {
      return `${MIN_REQUIRED_TOPICS} of ${MIN_REQUIRED_TOPICS} selected`;
    }

    return `${selectedCount} of ${MIN_REQUIRED_TOPICS} selected`;
  }, [canContinue, selectedCount]);

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((current) => {
      const next = new Set(current);

      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }

      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-4 py-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="flex items-center justify-between px-4 py-4">
          <p className="text-[24px] font-semibold tracking-[-0.06em] text-[#31674c]">
            Global Gardeners
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[14px] font-medium text-[#333333] transition hover:bg-[#ebe6da]"
          >
            <span>Skip</span>
            <ChevronRightIcon />
          </Link>
        </header>

        <div className="flex flex-1 flex-col px-4 pb-0 pt-8">
          <div className="space-y-4">
            <h1 className="max-w-[315px] text-[30px] font-semibold leading-[30px] tracking-[-0.033em] text-[#182a17]">
              What are you interested in growing?
            </h1>
            <p className="max-w-[358px] text-[16px] font-medium leading-6 text-[#333333cc]">
              Choose topics you&apos;re interested in so we can personalize your
              experience.
            </p>
            <p className="text-[16px] font-medium leading-6 text-[#457941]">
              Select at least 3 topics to get started.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap content-start gap-4">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.has(interest);

              return (
                <button
                  key={interest}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleToggleInterest(interest)}
                  className={`rounded-full px-3 py-2 text-[14px] leading-5 transition ${
                    isSelected
                      ? "bg-black text-white"
                      : "border border-black/5 bg-white text-[#333333]"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>

          <div className="mt-auto border-t border-[#e5e5e5] px-0 pb-4 pt-5">
            <p className="text-[14px] font-medium leading-6 text-[#333333cc]">{selectedCountMessage}</p>
            <Link
              href="/onboarding"
              aria-disabled={!canContinue}
              onClick={(event) => {
                if (!canContinue) {
                  event.preventDefault();
                }
              }}
              className={`mt-4 flex h-[52px] w-full items-center justify-center rounded-full text-[14px] font-medium leading-5 text-[#f4f1e8] transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                canContinue
                  ? "bg-[#457941] hover:bg-[#3b6838] focus:ring-[#457941] focus:ring-offset-[#f8f6f1]"
                  : "cursor-not-allowed bg-[#99b297] text-[#edf2ec]"
              }`}
            >
              Continue
            </Link>
            {!canContinue ? (
              <p className="mt-2 text-[12px] leading-4 text-[#666666]">
                Select {remainingToSelect} more topic
                {remainingToSelect === 1 ? "" : "s"} to continue.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
