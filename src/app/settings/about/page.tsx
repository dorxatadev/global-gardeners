"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AboutGlobalGardenersPage() {
  const router = useRouter();

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header sticky top-0 z-20 flex items-center border-b border-black/10 bg-white p-4">
          <button type="button" aria-label="Go back to settings" className="inline-flex h-10 w-10 items-center justify-center" onClick={() => router.push("/settings")}>
            <Image src="/icons/back-button.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10" />
          </button>
          <h1 className="flex-1 pl-4 pr-10 text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#457941]">About Global Gardeners</h1>
        </header>

        <section className="flex flex-col px-4 pb-4 pt-8">
          <h2 className="text-[18px] font-medium leading-[27px] tracking-[0px] text-[#333333]">Grow Together, Thrive Together</h2>

          <div className="mt-4 text-[14px] font-medium leading-5 tracking-[0px] text-[rgba(51,51,51,0.8)]">
            <p className="mb-[14px]">Global Gardeners is a community-driven platform that brings people together through the shared experience of gardening.</p>
            <p className="mb-[14px]">Whether you&rsquo;re caring for your first plant or managing a full garden, the app helps you learn, grow, and connect with others along the way.</p>
            <p>Version 1.0.0</p>
          </div>
        </section>
      </section>
    </main>
  );
}
