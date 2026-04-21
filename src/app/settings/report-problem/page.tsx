"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M8 3.25v9.5M3.25 8h9.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export default function ReportProblemPage() {
  const router = useRouter();
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");

  const canSubmit = issueDescription.trim().length > 0;

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header sticky top-0 z-20 flex items-center border-b border-black/10 bg-white p-4">
          <button type="button" aria-label="Go back to settings" className="inline-flex h-10 w-10 items-center justify-center" onClick={() => router.push("/settings")}>
            <Image src="/icons/back-button.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10" />
          </button>
          <h1 className="flex-1 pl-4 pr-10 text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#457941]">Report a problem</h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-8">
          <div className="flex flex-col gap-10">
            <section className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold leading-5 text-[#333333]">Describe the issue</p>
              <textarea
                value={issueDescription}
                onChange={(event) => setIssueDescription(event.target.value)}
                placeholder="Tell us what happened and what you expected to happen..."
                className="h-[76px] w-full resize rounded-[8px] border border-black/10 bg-white p-2 text-[14px] font-normal leading-5 text-[#333333] shadow-[0_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[rgba(51,51,51,0.5)] focus:outline-none focus:ring-2 focus:ring-[#457941]"
              />
            </section>

            <section className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold leading-5 text-[#333333]">Attach screenshot (optional)</p>
              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setAttachedFileName(file?.name ?? "");
                }}
              />
              <button
                type="button"
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-6 py-[10px] text-[14px] font-medium leading-5 text-white"
                onClick={() => screenshotInputRef.current?.click()}
              >
                <PlusIcon />
                <span>Add screenshot</span>
              </button>
              {attachedFileName ? <p className="text-[12px] leading-4 text-[#404040]">{attachedFileName}</p> : null}
            </section>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            className={`mt-auto h-[52px] w-full rounded-[1000px] px-6 py-[10px] text-[14px] font-medium leading-5 text-[#fafafa] ${
              canSubmit ? "bg-[#457941]" : "bg-[#457941] opacity-50"
            }`}
          >
            Submit
          </button>
        </div>
      </section>
    </main>
  );
}
