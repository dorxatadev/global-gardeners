"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BillingCycle = "monthly" | "annual";

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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-[#22c55e]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 12.5L9.5 16.5L18.5 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [planError, setPlanError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkOnboardingStatus() {
      const response = await fetch("/api/profile/onboarding-status");
      if (!response.ok) {
        return;
      }

      const status = (await response.json()) as { nextStep?: string };
      if (!isMounted || !status.nextStep) {
        return;
      }

      if (status.nextStep !== "/pricing") {
        router.replace(status.nextStep);
      }
    }

    void checkOnboardingStatus();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const premiumPlan = useMemo(
    () =>
      billingCycle === "monthly"
        ? { price: "$5.99", cadence: "/month", toggleOnAnnual: false }
        : { price: "$59.99", cadence: "/year", toggleOnAnnual: true },
    [billingCycle],
  );

  const submitPlan = async (plan: "free" | "premium") => {
    if (isSubmittingPlan) {
      return;
    }

    setPlanError("");
    setIsSubmittingPlan(true);

    try {
      const response = await fetch("/api/profile/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setPlanError(result.error ?? "Unable to set subscription.");
        return;
      }

      router.push("/interests");
    } catch {
      setPlanError("Unable to set subscription.");
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-4 py-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header flex items-center justify-between px-4 py-4">
          <p className="text-[24px] font-semibold tracking-[-0.06em] text-[#31674c]">
            Global Gardeners
          </p>
          <Link
            href="/interests"
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[14px] font-medium text-[#333333] transition hover:bg-[#ebe6da]"
          >
            <span>Skip</span>
            <ChevronRightIcon />
          </Link>
        </header>

        <div className="flex flex-1 flex-col gap-8 px-4 pb-10 pt-4">
          <div className="space-y-4">
            <h1 className="max-w-[335px] text-[30px] font-semibold leading-[30px] tracking-[-0.033em] text-[#182a17]">
              Unlock the full gardening experience
            </h1>
            <p className="text-[16px] font-medium leading-6 text-[#333333cc]">
              Start your free month. Cancel anytime.
            </p>
          </div>

          <div className="space-y-8">
            <article className="rounded-[16px] border border-[#182a17] bg-white p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[20px] font-semibold leading-6 text-[#182a17]">
                      Premium
                    </h2>
                    <span className="rounded-full border border-[#22c55e] bg-[#f0fdf4] px-2 py-1 text-[12px] font-medium leading-4 text-[#166534]">
                      Save 15%
                    </span>
                  </div>
                  <p className="max-w-[310px] text-[16px] font-medium leading-[22px] text-[#333333cc]">
                    Start your gardening journey with first month free.
                  </p>
                </div>

                <div className="flex items-end">
                  <p className="text-[48px] font-semibold leading-[48px] tracking-[-0.05em] text-[#182a17]">
                    {premiumPlan.price}
                  </p>
                  <p className="mb-[2px] text-[16px] font-medium leading-6 text-[#333333cc]">
                    {premiumPlan.cadence}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[14px] leading-5">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`rounded px-1 py-0.5 font-medium transition ${
                      billingCycle === "monthly" ? "text-[#333333]" : "text-[#333333cc]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={premiumPlan.toggleOnAnnual}
                    aria-label="Toggle annual billing"
                    onClick={() =>
                      setBillingCycle((current) =>
                        current === "monthly" ? "annual" : "monthly",
                      )
                    }
                    className={`relative h-[18px] w-[33px] rounded-[12px] transition ${
                      premiumPlan.toggleOnAnnual ? "bg-[#457941]" : "bg-[#e5e5e5]"
                    }`}
                  >
                    <span
                      className={`absolute top-[1px] h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition ${
                        premiumPlan.toggleOnAnnual ? "left-[16px]" : "left-[1px]"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`rounded px-1 py-0.5 font-medium transition ${
                      billingCycle === "annual" ? "text-[#333333]" : "text-[#333333cc]"
                    }`}
                  >
                    Annual
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingPlan}
                  onClick={() => {
                    void submitPlan("premium");
                  }}
                  className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#457941] text-[14px] font-medium leading-5 text-[#f4f1e8] transition hover:bg-[#3b6838] focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingPlan ? "Please wait..." : "Start free trial"}
                </button>

                <p className="text-center text-[14px] font-normal leading-5 text-[#333333cc]">
                  Cancel anytime
                </p>

                <div className="space-y-4">
                  <p className="text-[16px] font-semibold leading-6 text-[#182a17]">
                    What&apos;s included:
                  </p>
                  <ul className="space-y-4 text-[16px] font-medium leading-6 text-[#333333cc]">
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Unlimited MyGrowMate guidance
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Full plant history &amp; growth track
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Export your entire garden archive
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Priority access to new features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Advanced plant insights
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="rounded-[16px] border border-black/10 bg-white p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-[20px] font-semibold leading-6 text-[#182a17]">
                    Starter
                  </h2>
                  <p className="text-[16px] font-medium leading-[22px] text-[#333333cc]">
                    Perfect for individuals and small projects.
                  </p>
                </div>

                <p className="text-[56px] font-semibold leading-[48px] tracking-[-0.05em] text-[#457941]">
                  Free
                </p>

                <button
                  type="button"
                  disabled={isSubmittingPlan}
                  onClick={() => {
                    void submitPlan("free");
                  }}
                  className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#f5f5f5] text-[14px] font-medium leading-5 text-[#333333] transition hover:bg-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingPlan ? "Please wait..." : "Continue with free"}
                </button>

                <div className="space-y-4">
                  <p className="text-[16px] font-semibold leading-6 text-[#333333]">
                    What&apos;s included:
                  </p>
                  <ul className="space-y-4 text-[16px] font-medium leading-6 text-[#333333cc]">
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Access to GardenStream
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Limited MyGrowMate queries
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      Basic Plant ID
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      View influencer spotlight
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
          {planError ? <p className="text-[12px] leading-4 text-[#ef4444]">{planError}</p> : null}
        </div>
      </section>
    </main>
  );
}
