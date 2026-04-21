"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ExperienceOption = {
  id: string;
  title: string;
  description: string;
};

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "I’m just getting started and excited to learn the basics.",
  },
  {
    id: "growing",
    title: "Growing",
    description: "I’ve been gardening a little while and want to deepen my skills.",
  },
  {
    id: "rooted",
    title: "Rooted",
    description: "I’m confident in my garden and enjoy learning new techniques.",
  },
  {
    id: "deeply-rooted",
    title: "Deeply Rooted",
    description: "Gardening is part of who I am — it’s a lifelong practice.",
  },
];

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 rounded-full border ${checked ? "border-[#457941] bg-[#457941]" : "border-[#cfcfcf] bg-transparent"}`}
    />
  );
}

export default function ExperienceLevelPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canContinue = useMemo(() => Boolean(selectedId), [selectedId]);

  const handleContinue = async () => {
    if (!selectedId) return;

    await fetch("/api/profile/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience: {
          gardeningExperience: selectedId,
        },
      }),
    });

    router.push("/settings/experience/learning-style");
  };

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header fixed left-0 right-0 top-0 z-30 flex w-full items-center border-b border-black/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              className="rounded-full bg-[#f5f5f5] p-2 text-[#7a7a7a]"
              onClick={() => router.push("/settings/experience")}
            >
              <BackIcon />
            </button>
            <p className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#31674c]">Global Gardeners</p>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 flex-col px-4 pb-[112px] pt-[96px]">
          <div className="inline-flex w-fit rounded-2xl border border-[#3333330d] bg-[#ffffff80] px-2 py-1 text-[14px] font-medium leading-5 text-[#333333cc]">
            Step 1 of 5
          </div>
          <h1 className="mt-3 text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">What&apos;s your gardening experience?</h1>
          <p className="mt-4 text-[16px] font-medium leading-6 text-[#333333cc]">This helps us tailor content to your level.</p>

          <div className="mt-8 flex flex-col gap-3">
            {EXPERIENCE_OPTIONS.map((option) => {
              const isSelected = option.id === selectedId;
              return (
                <button
                  key={option.id}
                  type="button"
                  className="flex min-h-[84px] items-center gap-4 rounded-2xl border border-[#e5e5e5] bg-white p-4 text-left"
                  onClick={() => setSelectedId(option.id)}
                >
                  <Radio checked={isSelected} />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium leading-5 text-[#333333]">{option.title}</span>
                    <span className="mt-1 block text-[12px] font-medium leading-4 text-[#333333cc]">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 w-full bg-[#f8f6f1] px-4 pb-4 pt-5">
          <button
            type="button"
            disabled={!canContinue}
            aria-disabled={!canContinue}
            className={`flex h-[52px] w-full items-center justify-center rounded-full text-[14px] font-medium leading-5 text-[#fafafa] transition ${
              canContinue ? "bg-[#457941] hover:bg-[#3b6838]" : "cursor-not-allowed bg-[#99b297] pointer-events-none"
            }`}
            onClick={() => {
              if (!canContinue) return;
              void handleContinue();
            }}
          >
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

