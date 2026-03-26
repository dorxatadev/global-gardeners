import Link from "next/link";

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
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

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 3V15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M3 9H15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function NewPostOnboardingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="flex items-center border-b border-black/10 bg-white p-4">
          <Link
            href="/onboarding"
            aria-label="Back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#333333] transition hover:bg-[#ebebeb]"
          >
            <ArrowLeftIcon />
          </Link>
          <h1 className="flex-1 pr-10 text-center text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#457941]">
            New post
          </h1>
        </header>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[14px] font-semibold leading-5 text-[#333333]">Add a photo</p>
              <Link
                href="/onboarding/new-post/camera"
                className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-black/20 bg-white/10 px-6 py-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#31674c] text-white">
                  <PlusIcon />
                </span>
                <span className="flex flex-col items-center gap-1">
                  <span className="text-[16px] font-medium leading-6 text-[#182a17]">
                    Add a photo
                  </span>
                  <span className="text-center text-[12px] leading-4 text-[#333333cc]">
                    Take or choose a photo to share.
                  </span>
                </span>
              </Link>
            </div>

            <div className="space-y-2">
              <label htmlFor="caption" className="text-[14px] font-semibold leading-5 text-[#333333]">
                Note
              </label>
              <textarea
                id="caption"
                placeholder="Write a caption..."
                className="h-[76px] w-full resize rounded-lg border border-black/10 bg-white p-2 text-[14px] leading-5 text-[#333333] placeholder:text-[#33333380] focus:outline-none focus:ring-2 focus:ring-[#457941]"
              />
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-auto h-[52px] w-full rounded-full bg-[#457941] text-[14px] font-medium leading-5 text-[#fafafa] opacity-50"
          >
            Post
          </button>
        </div>
      </section>
    </main>
  );
}
