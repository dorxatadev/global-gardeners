"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-[#737373]"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.42 6.42a2.23 2.23 0 0 1 3.16 3.16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        d="M2 2l12 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        d="M13.1 10.88C14.05 10.1 14.7 9.16 15 8c-.8-3-3.6-5-7-5-.73 0-1.43.09-2.09.26"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        d="M3.18 5.24C2.34 5.95 1.74 6.87 1.5 8c.8 3 3.6 5 7 5 .72 0 1.42-.1 2.07-.28"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (
    name: "currentPassword" | "newPassword" | "confirmNewPassword",
    value: string,
    allValues: typeof formValues,
  ) => {
    if (!value.trim()) {
      return "*This field contains validation errors.";
    }

    if (name === "newPassword" && !isStrongPassword(value)) {
      return "*This field contains validation errors.";
    }

    if (name === "confirmNewPassword" && value !== allValues.newPassword) {
      return "*This field contains validation errors.";
    }

    return "";
  };

  const inputBaseClass =
    "h-11 w-full rounded-[8px] border bg-white px-4 pr-12 text-[14px] font-normal text-[#1f1f1f] placeholder:text-[14px] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#457941]";

  const canSubmit =
    Boolean(formValues.currentPassword.trim()) &&
    Boolean(formValues.newPassword.trim()) &&
    Boolean(formValues.confirmNewPassword.trim()) &&
    !isSubmitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    const currentPasswordError = validateField("currentPassword", formValues.currentPassword, formValues);
    const newPasswordError = validateField("newPassword", formValues.newPassword, formValues);
    const confirmNewPasswordError = validateField("confirmNewPassword", formValues.confirmNewPassword, formValues);

    setErrors({
      currentPassword: currentPasswordError || undefined,
      newPassword: newPasswordError || undefined,
      confirmNewPassword: confirmNewPasswordError || undefined,
    });

    if (currentPasswordError || newPasswordError || confirmNewPasswordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setSubmitError(result.error ?? "Unable to update password.");
        return;
      }

      setSubmitMessage("Password updated successfully.");
      setFormValues({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch {
      setSubmitError("Unexpected error while updating password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header sticky top-0 z-20 flex items-center border-b border-black/10 bg-white p-4">
          <button type="button" aria-label="Go back to settings" className="inline-flex h-10 w-10 items-center justify-center" onClick={() => router.push("/settings")}>
            <Image src="/icons/back-button.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10" />
          </button>
          <h1 className="flex-1 pr-10 text-center text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#457941]">
            Change password
          </h1>
        </header>

        <form className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-8" noValidate onSubmit={handleSubmit}>
          <div className="space-y-10">
            <div className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="current-password" className="text-[14px] font-semibold leading-5 text-[#333333]">
                  Current password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formValues.currentPassword}
                    onChange={(event) => setFormValues((current) => ({ ...current, currentPassword: event.target.value }))}
                    aria-invalid={Boolean(errors.currentPassword)}
                    placeholder="Enter your current password"
                    className={`${inputBaseClass} ${errors.currentPassword ? "border-[#ef4444]" : "border-black/5"}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#737373]"
                    onClick={() => setShowCurrentPassword((current) => !current)}
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  >
                    <EyeOffIcon />
                  </button>
                </div>
              </div>
              {errors.currentPassword ? <p className="text-[12px] leading-4 text-[#ef4444]">{errors.currentPassword}</p> : null}
              <Link href="/forgot-password" className="text-[12px] font-medium leading-4 text-[rgba(51,51,51,0.8)] underline">
                Forgot password?
              </Link>
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-[14px] font-semibold leading-5 text-[#333333]">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={formValues.newPassword}
                    onChange={(event) => setFormValues((current) => ({ ...current, newPassword: event.target.value }))}
                    aria-invalid={Boolean(errors.newPassword)}
                    placeholder="Create a new password"
                    className={`${inputBaseClass} ${errors.newPassword ? "border-[#ef4444]" : "border-black/5"}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#737373]"
                    onClick={() => setShowNewPassword((current) => !current)}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    <EyeOffIcon />
                  </button>
                </div>
              </div>
              {errors.newPassword ? <p className="text-[12px] leading-4 text-[#ef4444]">{errors.newPassword}</p> : null}
              <p className="text-[12px] leading-4 text-[rgba(51,51,51,0.8)]">At least 8 characters</p>
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="confirm-new-password" className="text-[14px] font-semibold leading-5 text-[#333333]">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password"
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={formValues.confirmNewPassword}
                    onChange={(event) => setFormValues((current) => ({ ...current, confirmNewPassword: event.target.value }))}
                    aria-invalid={Boolean(errors.confirmNewPassword)}
                    placeholder="Repeat your new password"
                    className={`${inputBaseClass} ${errors.confirmNewPassword ? "border-[#ef4444]" : "border-black/5"}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#737373]"
                    onClick={() => setShowConfirmNewPassword((current) => !current)}
                    aria-label={showConfirmNewPassword ? "Hide confirm new password" : "Show confirm new password"}
                  >
                    <EyeOffIcon />
                  </button>
                </div>
              </div>
              {errors.confirmNewPassword ? <p className="text-[12px] leading-4 text-[#ef4444]">{errors.confirmNewPassword}</p> : null}
            </div>
          </div>

          {submitError ? <p className="mt-4 text-[12px] leading-4 text-[#dc2626]">{submitError}</p> : null}
          {submitMessage ? <p className="mt-4 text-[12px] leading-4 text-[#457941]">{submitMessage}</p> : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-full px-6 text-[14px] font-medium leading-5 text-[#fafafa] transition focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-[#f8f6f1] ${canSubmit ? "bg-[#457941]" : "bg-[#457941]/50"}`}
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
