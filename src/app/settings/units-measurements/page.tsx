"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TemperatureUnit = "c" | "f";
type SizeUnit = "cm" | "in";
type WaterUnit = "ml" | "oz";

const STORAGE_KEYS = {
  temperature: "gg_units_temperature",
  size: "gg_units_size",
  water: "gg_units_water",
} as const;

function getInitialTemperatureUnit(): TemperatureUnit {
  if (typeof window === "undefined") return "c";
  const stored = window.localStorage.getItem(STORAGE_KEYS.temperature);
  return stored === "f" ? "f" : "c";
}

function getInitialSizeUnit(): SizeUnit {
  if (typeof window === "undefined") return "cm";
  const stored = window.localStorage.getItem(STORAGE_KEYS.size);
  return stored === "in" ? "in" : "cm";
}

function getInitialWaterUnit(): WaterUnit {
  if (typeof window === "undefined") return "ml";
  const stored = window.localStorage.getItem(STORAGE_KEYS.water);
  return stored === "oz" ? "oz" : "ml";
}

function SegmentedControl<T extends string>({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  selectedValue,
  onChange,
}: {
  leftLabel: string;
  leftValue: T;
  rightLabel: string;
  rightValue: T;
  selectedValue: T;
  onChange: (value: T) => void;
}) {
  const leftSelected = selectedValue === leftValue;

  return (
    <div className="flex h-10 w-[240px] items-center">
      <button
        type="button"
        className={`flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-l-full border py-[9.5px] text-[14px] font-medium leading-5 ${
          leftSelected ? "border-[#3e6d3b] bg-[#457941] text-white" : "border-black/10 bg-white text-[rgba(51,51,51,0.8)]"
        }`}
        onClick={() => onChange(leftValue)}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        className={`flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-r-full border py-[9.5px] text-[14px] font-medium leading-5 ${
          !leftSelected ? "border-[#3e6d3b] bg-[#457941] text-white" : "border-black/10 bg-white text-[rgba(51,51,51,0.8)]"
        }`}
        onClick={() => onChange(rightValue)}
      >
        {rightLabel}
      </button>
    </div>
  );
}

export default function UnitsMeasurementsPage() {
  const router = useRouter();
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(getInitialTemperatureUnit);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>(getInitialSizeUnit);
  const [waterUnit, setWaterUnit] = useState<WaterUnit>(getInitialWaterUnit);

  const handleTemperatureChange = (nextValue: TemperatureUnit) => {
    setTemperatureUnit(nextValue);
    window.localStorage.setItem(STORAGE_KEYS.temperature, nextValue);
  };

  const handleSizeChange = (nextValue: SizeUnit) => {
    setSizeUnit(nextValue);
    window.localStorage.setItem(STORAGE_KEYS.size, nextValue);
  };

  const handleWaterChange = (nextValue: WaterUnit) => {
    setWaterUnit(nextValue);
    window.localStorage.setItem(STORAGE_KEYS.water, nextValue);
  };

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 text-[#182a17] sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-[#f8f6f1] shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header sticky top-0 z-20 flex items-center border-b border-black/10 bg-white p-4">
          <button type="button" aria-label="Go back to settings" className="inline-flex h-10 w-10 items-center justify-center" onClick={() => router.push("/settings")}>
            <Image src="/icons/back-button.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10" />
          </button>
          <h1 className="flex-1 pr-10 text-center text-[24px] font-semibold leading-[28.8px] tracking-[-1px] text-[#457941]">Units &amp; measurements</h1>
        </header>

        <div className="flex flex-1 flex-col gap-10 px-4 pb-4 pt-8">
          <section className="space-y-4">
            <p className="text-[14px] font-semibold leading-5 text-[#333333]">Temperature</p>
            <SegmentedControl
              leftLabel="°C"
              leftValue="c"
              rightLabel="°F"
              rightValue="f"
              selectedValue={temperatureUnit}
              onChange={handleTemperatureChange}
            />
          </section>

          <section className="space-y-4">
            <p className="text-[14px] font-semibold leading-5 text-[#333333]">Size</p>
            <SegmentedControl
              leftLabel="cm"
              leftValue="cm"
              rightLabel="in"
              rightValue="in"
              selectedValue={sizeUnit}
              onChange={handleSizeChange}
            />
          </section>

          <section className="space-y-4">
            <p className="text-[14px] font-semibold leading-5 text-[#333333]">Water</p>
            <SegmentedControl
              leftLabel="ml"
              leftValue="ml"
              rightLabel="oz"
              rightValue="oz"
              selectedValue={waterUnit}
              onChange={handleWaterChange}
            />
          </section>
        </div>
      </section>
    </main>
  );
}
