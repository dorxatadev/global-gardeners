"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LanguageOption = "en-US" | "es" | "fr";

const LANGUAGE_STORAGE_KEY = "gg_language";

const languageOptions: Array<{ value: LanguageOption; label: string }> = [
  { value: "en-US", label: "English (US)" },
  { value: "es", label: "Espa\u00f1ol" },
  { value: "fr", label: "Fran\u00e7ais" },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(() => {
    if (typeof window === "undefined") {
      return "en-US";
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "en-US" || stored === "es" || stored === "fr") {
      return stored;
    }

    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith("es")) return "es";
    if (browserLanguage.startsWith("fr")) return "fr";
    return "en-US";
  });

  const handleSelectLanguage = (value: LanguageOption) => {
    setSelectedLanguage(value);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  };

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header sticky top-0 z-20 flex items-center border-b border-black/10 bg-white p-4">
          <button type="button" aria-label="Go back to settings" className="inline-flex h-10 w-10 items-center justify-center" onClick={() => router.push("/settings")}>
            <Image src="/icons/back-button.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10" />
          </button>
          <h1 className="flex-1 pr-10 text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#457941]">Language</h1>
        </header>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
          <p className="text-[30px] font-semibold leading-5 text-[#333333] [font-size:clamp(14px,3.6vw,14px)]">Select your language</p>

          <div className="mt-4 flex flex-col gap-4">
            {languageOptions.map((option) => {
              const checked = selectedLanguage === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className="flex h-6 w-[240px] items-center gap-2 text-left"
                  onClick={() => handleSelectLanguage(option.value)}
                >
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                      checked ? "border-[#929292] bg-white" : "border-[#c9c9c9] bg-[#f8f6f1]"
                    }`}
                    aria-hidden="true"
                  >
                    {checked ? <span className="h-2 w-2 rounded-full bg-[#111111]" /> : null}
                  </span>
                  <span className="text-[14px] font-normal leading-5 text-[#404040]">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

