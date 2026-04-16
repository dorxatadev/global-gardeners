"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const onboardingHeroImage = "/images/figma/settings-experience-onboarding.png";

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function ExperienceOnboardingPage() {
  const router = useRouter();

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header fixed left-0 right-0 top-0 z-30 flex w-full items-center border-b border-black/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back to settings"
              className="rounded-full bg-[#f5f5f5] p-2 text-[#7a7a7a]"
              onClick={() => router.push("/settings")}
            >
              <BackIcon />
            </button>
            <p className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#31674c]">Global Gardeners</p>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 flex-col justify-between overflow-hidden px-4 pb-4 pt-[88px]">
          <div className="flex flex-1 min-h-0 flex-col gap-5">
            <div className="relative w-full flex-1 min-h-[240px] overflow-hidden rounded-3xl border border-black/10">
              <Image
                alt="A phone showing plant posts beside a potted plant"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 390px) 100vw, 390px"
                src={onboardingHeroImage}
              />
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-2xl bg-[rgba(255,255,255,0.5)] px-2 py-1">
                <p className="bg-[linear-gradient(90deg,#182a17_0%,#3c6838_20%,#5fa659_70%)] bg-clip-text text-[14px] font-medium leading-5 text-transparent">
                  Personalized for you
                </p>
              </div>
              <h1 className="w-[326px] text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">
                Let&apos;s build your garden experience
              </h1>
              <p className="w-full text-[14px] font-medium leading-6 text-[#333333cc]">
                Answer a few quick questions so we can personalize your plants, tips, and recommendations.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex h-[52px] w-full shrink-0 items-center justify-center rounded-full bg-[#457941] text-[14px] font-medium leading-5 text-[#fafafa] transition hover:bg-[#3b6838] focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-[#f8f6f1]"
            onClick={() => router.push("/settings/experience/level")}
          >
            Get started
          </button>
        </div>
      </section>
    </main>
  );
}
