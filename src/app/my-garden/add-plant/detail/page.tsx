"use client";

import { useRouter } from "next/navigation";

const heroImage = "https://www.figma.com/api/mcp/asset/fa0e8278-4443-43c0-bc5d-1d6f10152dae";
const pagerDots = "https://www.figma.com/api/mcp/asset/64ba5c7c-1dd5-47a5-912a-361402dd6eae";
const closeIcon = "https://www.figma.com/api/mcp/asset/0e047919-5926-40b4-851c-d117eb1a32b8";
const moreIcon = "https://www.figma.com/api/mcp/asset/7eed89d7-c79f-4b0f-8090-57c4082ee0fd";
const leafIcon = "https://www.figma.com/api/mcp/asset/73bcf24a-c2a1-4db3-95b2-9025b5d79bf9";
const rightIcon = "https://www.figma.com/api/mcp/asset/0c3a4b8f-8cb1-45b9-bc7d-6e70d61a9e9c";
const sunIcon = "https://www.figma.com/api/mcp/asset/c070ddb8-9f54-4211-8a8d-8165e70366e2";
const dropletIcon = "https://www.figma.com/api/mcp/asset/235f98d7-abc6-43d9-8024-b45a95ec1440";
const thermoIcon = "https://www.figma.com/api/mcp/asset/3100a8fc-3e27-4cdc-a75b-b77bb38c709c";
const cloudyIcon = "https://www.figma.com/api/mcp/asset/4f89f694-8c7a-4476-99d7-be6a9ebe2d71";
const chevronUpIcon = "https://www.figma.com/api/mcp/asset/4da4cfbd-361e-40af-be4b-8a56ba6d8bbc";
const chevronDownIcon = "https://www.figma.com/api/mcp/asset/6eda77c8-e773-4950-9751-5269ae0235d0";

function DetailTile({ label, value, icon, tone }: { label: string; value: string; icon: string; tone: "yellow" | "blue" | "orange" | "teal" }) {
  const toneClass =
    tone === "yellow"
      ? "bg-[rgba(212,167,44,0.1)] text-[#d4a72c]"
      : tone === "blue"
        ? "bg-[rgba(47,128,197,0.1)] text-[#2f80c5]"
        : tone === "orange"
          ? "bg-[rgba(224,107,79,0.1)] text-[#e06b4f]"
          : "bg-[rgba(95,168,154,0.1)] text-[#5fa89a]";

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[8px] bg-white p-3">
      <div className={`rounded-[6px] p-2 ${toneClass}`}>
        <img src={icon} alt="" aria-hidden="true" className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className={`text-[14px] font-medium leading-5 ${toneClass.split(" ")[1]}`}>{label}</p>
        <p className="text-[14px] font-medium leading-5 text-[#333333]">{value}</p>
      </div>
    </div>
  );
}

function AccordionRow({ title, expanded = false }: { title: string; expanded?: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-black/10 py-4">
        <p className="text-[14px] font-medium leading-5 text-[#333333]">{title}</p>
        <img src={expanded ? chevronUpIcon : chevronDownIcon} alt="" aria-hidden="true" className="h-4 w-4" />
      </div>
      {expanded ? (
        <div className="border-b border-black/10 pb-4">
          <p className="text-[14px] font-medium leading-5 text-[#333333cc]">
            Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.
          </p>
        </div>
      ) : null}
    </>
  );
}

export default function PlantDetailPage() {
  const router = useRouter();

  return (
    <main className="client-main min-h-screen bg-[#f8f6f1] px-0 sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1]">
        <div className="relative h-[357px] w-full overflow-hidden">
          <img src={heroImage} alt="Rattlesnake Plant" className="h-full w-full object-cover" />

          <div className="absolute left-1/2 top-[325px] -translate-x-1/2 rounded-[999px] bg-[#f4f1e8] px-2 py-1.5">
            <img src={pagerDots} alt="" aria-hidden="true" className="h-2 w-[56px]" />
          </div>

          <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]">
            <button type="button" onClick={() => router.back()} className="flex min-h-10 min-w-10 items-center justify-center rounded-full border-[1.111px] border-[rgba(146,146,146,0.24)] bg-white p-[8.889px]">
              <img src={closeIcon} alt="" aria-hidden="true" className="h-6 w-6" />
            </button>
            <button type="button" className="flex min-h-10 min-w-10 items-center justify-center rounded-full border border-black/10 bg-white p-[8.889px]">
              <img src={moreIcon} alt="" aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-[104px] pt-6">
          <h1 className="text-[30px] font-semibold leading-[30px] tracking-[-1px] text-[#182a17]">Rattlesnake Plant</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-[#f0fdf4] p-1.5">
              <img src={leafIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </span>
            <p className="text-[16px] font-medium leading-6 text-[#333333cc]">Goeppertia insignis</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="flex min-h-10 items-center justify-between rounded-[100px] border border-black/10 bg-white py-4 pl-6 pr-4 text-[14px] font-medium leading-5 text-[#333333]">
              View growth timeline
              <img src={rightIcon} alt="" aria-hidden="true" className="h-6 w-6" />
            </button>
            <button type="button" className="flex min-h-10 items-center justify-between rounded-[100px] border border-black/10 bg-white py-4 pl-6 pr-4 text-left">
              <span>
                <span className="block text-[14px] font-medium leading-5 text-[#333333]">Ask Grow Mate</span>
                <span className="block text-[12px] font-medium leading-4 text-[#333333cc]">Get personalized care tips for this plant.</span>
              </span>
              <img src={rightIcon} alt="" aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex gap-2">
              <DetailTile label="Light" value="Medium Light" icon={sunIcon} tone="yellow" />
              <DetailTile label="Water" value="Every 5 days" icon={dropletIcon} tone="blue" />
            </div>
            <div className="flex gap-2">
              <DetailTile label="Temperature" value="65° - 75°" icon={thermoIcon} tone="orange" />
              <DetailTile label="Humidity" value="70%" icon={cloudyIcon} tone="teal" />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[14px] font-medium leading-5 text-[#333333]">Description and Care Details</p>
            <p className="mt-2 text-[14px] font-medium leading-5 text-[#333333cc]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s.</p>
          </div>

          <div className="mt-8 bg-[#f8f6f1]">
            <AccordionRow title="Watering & Moisture" expanded />
            <AccordionRow title="Light" />
            <AccordionRow title="Temperature" />
            <AccordionRow title="Humidity" />
            <AccordionRow title="Fertilizing" />
            <AccordionRow title="Repotting" />
            <AccordionRow title="Soil" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#f8f6f1] px-4 pb-4 pt-5">
          <button type="button" className="h-[52px] w-full rounded-[1000px] bg-[#457941] text-[14px] font-medium leading-5 text-[#fafafa]">
            Add to My Garden
          </button>
        </div>
      </section>
    </main>
  );
}

