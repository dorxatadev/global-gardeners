"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ChallengeOption = {
  id: string;
  title: string;
  description: string;
};

const CHALLENGE_OPTIONS: ChallengeOption[] = [
  { id: "pests", title: "Pests", description: "They always seem one step ahead of me." },
  { id: "soil", title: "Soil", description: "I’m not sure how to improve or manage it." },
  { id: "watering", title: "Watering", description: "Too much? Too little? I’m never sure." },
  { id: "time", title: "Time", description: "I want to garden, but life gets busy." },
  { id: "space", title: "Space", description: "I’m working with a small or limited area." },
  { id: "climate", title: "Climate", description: "My weather makes gardening tricky." },
];

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-4 w-4 items-center justify-center rounded-[4px] border ${
        checked ? "border-[#171717] bg-[#171717]" : "border-[#d4d4d4] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      }`}
    >
      {checked ? (
        <svg className="h-[10px] w-[10px]" fill="none" viewBox="0 0 12 12">
          <path d="M2.5 6.2L5 8.7L9.5 3.8" stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      ) : null}
    </span>
  );
}

export default function ChallengesPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const canContinue = useMemo(() => selectedIds.size > 0, [selectedIds]);

  const handleContinue = async () => {
    if (selectedIds.size === 0) return;

    await fetch("/api/profile/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience: {
          challenges: [...selectedIds],
        },
      }),
    });

    router.push("/settings/experience/growing-zone");
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
              onClick={() => router.push("/settings/experience/learning-style")}
            >
              <BackIcon />
            </button>
            <p className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#31674c]">Global Gardeners</p>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 flex-col px-4 pb-[112px] pt-[96px]">
          <div className="inline-flex w-fit rounded-2xl border border-[#3333330d] bg-[#ffffff80] px-2 py-1 text-[14px] font-medium leading-5 text-[#333333cc]">
            Step 3 of 5
          </div>
          <h1 className="mt-3 text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">What challenges are you facing?</h1>
          <p className="mt-4 text-[16px] font-medium leading-6 text-[#333333cc]">Select all that apply - we&apos;ll focus on what matters most to you.</p>
          <p className="mt-4 text-[16px] font-medium leading-6 text-[#457941]">Options (multi-select)</p>

          <div className="mt-8 flex flex-col gap-3">
            {CHALLENGE_OPTIONS.map((option) => {
              const isSelected = selectedIds.has(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  className="flex items-center gap-4 rounded-2xl border border-[#e5e5e5] bg-white p-4 text-left"
                  onClick={() => toggleSelection(option.id)}
                >
                  <Checkbox checked={isSelected} />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium leading-5 text-[#333333]">{option.title}</span>
                    <span className="mt-1 block text-[12px] font-medium leading-4 text-[#333333cc]">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#f8f6f1] px-4 pb-4 pt-5">
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
