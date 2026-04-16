"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loaderAnimation from "../../../../../public/lottie/green-circle-loader.json";

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function OnboardingLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/settings/experience/success");
    }, 2400);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header fixed left-0 right-0 top-0 z-30 flex w-full items-center border-b border-black/10 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              className="rounded-full bg-[#f5f5f5] p-2 text-[#7a7a7a]"
              onClick={() => router.push("/settings/experience/climate")}
            >
              <BackIcon />
            </button>
            <p className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#31674c]">Global Gardeners</p>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 pt-[74px]">
          <div className="flex w-full max-w-[358px] flex-col items-center gap-10">
            <div className="h-[120px] w-[120px]">
              <Lottie animationData={loaderAnimation} autoplay loop />
            </div>
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h1 className="text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#182a17]">Personalizing your garden...</h1>
              <p className="w-full text-[16px] font-medium leading-6 text-[#333333cc]">
                We&apos;re tailoring tips, guides, and recommendations just for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
