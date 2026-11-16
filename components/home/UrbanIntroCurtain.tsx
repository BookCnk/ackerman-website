"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";

export default function UrbanIntroCurtain() {
  const pathname = usePathname();
  const { introReplayCount } = useBooking();
  const [phase, setPhase] = useState<"DRAWING" | "REVEALED" | "SLIDING_UP" | "HIDDEN">(
    "HIDDEN"
  );

  useEffect(() => {
    // Strictly ONLY play on Homepage ("/")
    if (pathname !== "/") {
      setPhase("HIDDEN");
      return;
    }

    // Don't replay on normal page transitions unless Replay button clicked
    try {
      const hasPlayed = sessionStorage.getItem("ackermann_intro_played");
      if (hasPlayed && introReplayCount === 0) {
        setPhase("HIDDEN");
        return;
      }
      sessionStorage.setItem("ackermann_intro_played", "true");
    } catch {
      // Ignore storage errors
    }

    setPhase("DRAWING");

    // Phase 1: Draw SVG frame & reveal typography
    const revealTimer = setTimeout(() => {
      setPhase("REVEALED");
    }, 750);

    // Phase 2: Slide up curtain (Urban Automotive slide-up effect)
    const slideTimer = setTimeout(() => {
      setPhase("SLIDING_UP");
    }, 1800);

    // Phase 3: Unmount curtain
    const hideTimer = setTimeout(() => {
      setPhase("HIDDEN");
    }, 2750);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(slideTimer);
      clearTimeout(hideTimer);
    };
  }, [introReplayCount, pathname]);

  if (phase === "HIDDEN" || pathname !== "/") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        phase === "SLIDING_UP" ? "-translate-y-full pointer-events-none" : "translate-y-0"
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

      {/* Urban Automotive Animated Box & Letter Reveal */}
      <div className="relative flex flex-col items-center px-6">
        {/* SVG Drawing Box (Exact Urban Automotive loader frame) */}
        <div className="relative flex h-52 w-72 items-center justify-center sm:h-64 sm:w-96">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="2"
              width="396"
              height="256"
              rx="4"
              stroke="#e5e5e5"
              strokeWidth="2"
              strokeDasharray="1312"
              strokeDashoffset={phase === "DRAWING" ? "1312" : "0"}
              className="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>

          {/* Center Brand Emblem & Bespoke Text */}
          <div
            className={`flex flex-col items-center justify-center transition-all duration-700 ${
              phase === "DRAWING"
                ? "scale-90 opacity-0"
                : "scale-100 opacity-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/sites/urban/urban-shield-logo.svg"
                alt="Urban Bespoke"
                width={28}
                height={28}
                className="h-7 w-7 invert brightness-200"
              />
              <span className="text-[11px] font-bold tracking-[0.4em] text-white uppercase">
                ACKERMANN
              </span>
            </div>

            <div className="my-3 h-px w-36 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <h1 className="font-heading text-lg font-bold tracking-[0.25em] text-white uppercase sm:text-xl">
              BESPOKE STYLING
            </h1>

            <p className="mt-1 text-[10px] font-medium tracking-[0.3em] text-[#a3a3a3] uppercase">
              DESIGNED & HAND-ASSEMBLED
            </p>
          </div>
        </div>

        {/* Bottom Loading Progress Status */}
        <div
          className={`mt-6 flex flex-col items-center gap-2 transition-opacity duration-500 ${
            phase === "DRAWING" ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
            <div
              className={`h-full bg-white transition-all duration-1000 ease-out ${
                phase === "DRAWING" ? "w-1/3" : "w-full"
              }`}
            />
          </div>
          <span className="text-[10px] font-semibold tracking-widest text-[#737373] uppercase tabular-nums">
            {phase === "DRAWING" ? "SYNCHRONIZING BESPOKE SYSTEMS" : "ENTERING ACKERMANN GARAGE"}
          </span>
        </div>
      </div>
    </div>
  );
}
