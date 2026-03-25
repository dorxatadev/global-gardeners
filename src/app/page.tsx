const heroImage =
  "https://www.figma.com/api/mcp/asset/d8253a0a-f335-4748-9997-a717ebe4c1b9";

const slides = [true, false, false, false];

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

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-4 py-6 text-[#182a17] sm:grid sm:place-items-center sm:p-8">
      <section className="mx-auto flex min-h-[844px] w-full max-w-[390px] flex-col overflow-hidden rounded-[32px] border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="flex items-center justify-between px-4 py-4">
          <p className="text-[24px] font-semibold tracking-[-0.06em] text-[#31674c]">
            Global Gardeners
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[14px] font-medium text-[#333333] transition hover:bg-[#ebe6da]"
          >
            <span>Skip</span>
            <ChevronRightIcon />
          </button>
        </header>

        <div className="flex flex-1 flex-col justify-between px-4 pb-8 pt-4">
          <div className="flex flex-1 flex-col justify-center gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-[443px] w-[357px] max-w-full overflow-hidden rounded-[16px] border border-black/10 bg-[#ebe5d9]">
                <img
                  alt="A welcoming arrangement of potted plants, gardening tools, and a watering can."
                  className="absolute left-1/2 top-0 h-[443px] w-[443px] max-w-none -translate-x-[50.7%] object-cover"
                  src={heroImage}
                />
              </div>

              <div className="flex items-center gap-2.5" aria-label="Slide progress">
                {slides.map((isActive, index) => (
                  <span
                    key={index}
                    className={`h-2.5 rounded-full ${
                      isActive ? "w-2.5 bg-[#5a8d4f]" : "w-2.5 bg-[#e7e1d7]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-[16px] border border-[#4579410d] bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[12px] font-medium leading-4 text-[#457941e6]">
                Welcome
              </div>
              <div className="space-y-4">
                <h1 className="text-[30px] font-semibold leading-[30px] tracking-[-0.033em] text-[#182a17]">
                  Your Garden Starts Here.
                </h1>
                <p className="mx-auto max-w-[320px] text-[14px] font-medium leading-5 text-[#333333cc]">
                  An all-in-one platform for plant identification, community,
                  and personalized care.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-8 h-[52px] w-full rounded-full bg-[#457941] text-[18px] font-medium text-[#f4f1e8] transition hover:bg-[#3b6838] focus:outline-none focus:ring-2 focus:ring-[#457941] focus:ring-offset-2 focus:ring-offset-[#f8f6f1]"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
