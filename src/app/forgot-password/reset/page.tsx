"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
}

export default function ForgotPasswordResetPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const passwordError = !password || !isStrongPassword(password) ? "*This field contains validation errors." : "";
    const confirmPasswordError = password !== confirmPassword ? "*This field contains validation errors." : "";

    setErrors({
      password: passwordError || undefined,
      confirmPassword: confirmPasswordError || undefined,
    });

    if (passwordError || confirmPasswordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setSubmitError(result.error ?? "Unable to reset password.");
        return;
      }

      router.push("/login");
    } catch {
      setSubmitError("Unexpected error while resetting password.");
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
          <h1 className="text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">Set a New Password</h1>

          <form className="mt-8 flex min-h-0 flex-1 flex-col" noValidate onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-[14px] font-semibold leading-5 text-[#333333]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  placeholder="Password"
                  className={`h-11 w-full rounded-[8px] border bg-white px-4 text-[14px] text-[#1f1f1f] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#457941] ${errors.password ? "border-[#ef4444]" : "border-black/5"}`}
                />
                {errors.password ? (
                  <p className="text-[12px] leading-4 text-[#ef4444]">{errors.password}</p>
                ) : (
                  <p className="text-[12px] leading-4 text-[#333333cc]">Minimum 8 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-[14px] font-semibold leading-5 text-[#333333]">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  placeholder="Confirm password"
                  className={`h-11 w-full rounded-[8px] border bg-white px-4 text-[14px] text-[#1f1f1f] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#457941] ${errors.confirmPassword ? "border-[#ef4444]" : "border-black/5"}`}
                />
                {errors.confirmPassword ? <p className="text-[12px] leading-4 text-[#ef4444]">{errors.confirmPassword}</p> : null}
              </div>

              {submitError ? <p className="text-[12px] leading-4 text-[#ef4444]">{submitError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-auto h-[52px] w-full rounded-full bg-[#457941] text-[14px] font-medium text-[#f4f1e8] transition hover:bg-[#3b6838] focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-[#f8f6f1]"
            >
              {isSubmitting ? "Updating password..." : "Continue"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
