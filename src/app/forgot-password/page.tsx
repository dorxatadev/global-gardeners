"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trimmedEmail = email.trim().toLowerCase();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isValidEmail) {
      setError("*This field contains validation errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to send recovery code.");
        return;
      }

      router.push(`/forgot-password/verify?email=${encodeURIComponent(trimmedEmail)}`);
    } catch {
      setError("Unexpected error while sending recovery code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-4 sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] px-4 pb-10 pt-4 shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header pb-10">
          <p className="text-[24px] font-semibold tracking-[-0.06em] text-[#31674c]">Global Gardeners</p>
        </header>

        <div className="mx-auto flex w-full flex-1 flex-col">
          <div className="space-y-4">
            <h1 className="text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">
              Enter your registered email
            </h1>
            <p className="text-[16px] leading-6 text-[#333333cc]">
              We&apos;ll send you a code to help you recover your password.
            </p>
          </div>

          <form className="mt-8 flex min-h-0 flex-1 flex-col" noValidate onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[14px] font-semibold leading-5 text-[#333333]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                aria-invalid={Boolean(error)}
                className={`h-11 w-full rounded-[8px] border bg-white px-4 text-[14px] text-[#1f1f1f] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#457941] ${error ? "border-[#ef4444]" : "border-black/5"}`}
              />
              {error ? <p className="text-[12px] leading-4 text-[#ef4444]">{error}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValidEmail}
              className="mt-auto h-[52px] w-full rounded-full bg-[#457941] text-[14px] font-medium text-[#f4f1e8] transition hover:bg-[#3b6838] focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-[#f8f6f1] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending code..." : "Continue"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
