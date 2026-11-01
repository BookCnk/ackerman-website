"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingContext";
import { VEHICLES } from "@/lib/mock-erp-data";

type HeroSlide = {
  no: string;
  tag: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  specs: string[];
  image: string;
  isVideo?: boolean;
  buildId?: string;
  vehicleId: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    no: "01",
    tag: "URBAN AUTOMOTIVE BESPOKE FILM",
    titleLine1: "BESPOKE STYLING",
    titleHighlight: "DESIGNED & HAND-ASSEMBLED",
    subtitle:
      "ยนตรกรรมคัสตอมระดับโลก รวบรวมชุดแต่งแอโร่คาร์บอนไฟเบอร์แท้ ล้อฟอร์จสั่งตัดพิเศษ และระบบท่อไอเสียปรับจูนเฉพาะคัน",
    specs: ["Urban Carbon Bodywork", "Bespoke Forged Wheels", "Handcrafted Assembly"],
    image: "/sites/urban/urban-hero-poster.jpg",
    isVideo: true,
    vehicleId: "urban-defender-110",
  },
  {
    no: "02",
    tag: "IND FLAGSHIP PROGRAMME",
    titleLine1: "BMW G87 M2 Sunrise Edition",
    titleHighlight: "Alpha-N Carbon × KW Clubsport × MMX Ceramic",
    subtitle:
      "สเปกแต่งเต็มสูตร IND Heritage สหรัฐอเมริกา โป่งหน้าคาร์บอนเจาะครีบระบายลม โช๊คอัพ KW 3-Way และระบบเบรกคาร์บอนเซรามิก 400 มม.",
    specs: ["Alpha-N V4 Fenders", "KW Clubsport 3-Way", "MMX Carbon Ceramic"],
    image: "/sites/ind/hero-g87-m2.jpg",
    buildId: "build-ind-g87-m2",
    vehicleId: "bmw-g87-m2",
  },
  {
    no: "03",
    tag: "URBAN WIDETRACK DEFENDER",
    titleLine1: "Land Rover Defender 110",
    titleHighlight: "Urban Widetrack Full Aerodynamic Kit",
    subtitle:
      "โป่งซุ้มล้อคาร์บอนไฟเบอร์รอบคัน สปอยเลอร์หลังคา ไฟ Roof Light Pod พร้อมฟิล์มใสกันรอยเกรดโรงพยาบาล Urban x Topaz",
    specs: ["Urban Widetrack Carbon", "22\" Vossen Forged", "Topaz Full Body PPF"],
    image: "/sites/urban/banner-defender-grey.webp",
    buildId: "build-urban-defender-110",
    vehicleId: "urban-defender-110",
  },
  {
    no: "04",
    tag: "IND SAV PERFORMANCE",
    titleLine1: "BMW G65 X5 × Heritage E53",
    titleHighlight: "Eventuri Carbon Intake × Eisenmann Valvetronic",
    subtitle:
      "ผสานความแรงและความหรูหราของตระกูล SAV ด้วยระบบไอดีคาร์บอน Eventuri ลิขสิทธิ์เฉพาะ และท่อไอเสียสแตนเลส T304 งานเยอรมันแท้",
    specs: ["Eventuri Patent Intake", "Eisenmann Exhaust", "BBS Forged Fitment"],
    image: "/sites/ind/hero-g65-x5.jpg",
    vehicleId: "bmw-g65-x5",
  },
];

export default function Hero() {
  const router = useRouter();
  const {
    selectedVehicleId,
    setSelectedVehicleId,
    setInspectedBuildId,
    setIsCartDrawerOpen,
  } = useBooking();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[activeIndex];

  return (
    <section id="home" className="relative bg-background">
      {/* Fullscreen Video / Media Showcase (Urban Automotive Hero Layout) */}
      <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden pt-28 pb-8">
        {/* Background Media Layer */}
        <div className="absolute inset-0">
          {currentSlide.isVideo ? (
            <video
              key="urban-hero-video"
              className="h-full w-full object-cover transition-transform duration-1000 scale-100"
              src="/sites/urban/urban-hero.mp4"
              poster="/sites/urban/urban-hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              key={currentSlide.image}
              src={currentSlide.image}
              alt={currentSlide.titleLine1}
              fill
              priority
              className="object-cover transition-all duration-1000 scale-105"
            />
          )}

          {/* Luxury Vignette & Dark Overlay for Crisp Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
        </div>

        {/* Center Editorial Content */}
        <div className="relative z-10 mx-auto my-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary backdrop-blur tabular-nums">
              <span>SLIDE {currentSlide.no} / 04</span>
              <span className="text-muted">•</span>
              <span className="text-white">{currentSlide.tag}</span>
            </div>

            {/* Urban Automotive Bold Headline */}
            <h1 className="mt-5 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">{currentSlide.titleLine1}</span>
              <span className="mt-2 block text-2xl font-bold tracking-normal text-primary sm:text-4xl lg:text-5xl">
                {currentSlide.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
              {currentSlide.subtitle}
            </p>

            {/* Quick Spec Pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {currentSlide.specs.map((sp) => (
                <span
                  key={sp}
                  className="rounded-lg border border-white/15 bg-black/50 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur"
                >
                  {sp}
                </span>
              ))}
            </div>

            {/* Slide Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {currentSlide.buildId ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setInspectedBuildId(currentSlide.buildId!);
                  }}
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-hover"
                >
                  เปิดดูสเปก & จองชุดแต่งคันนี้ (Slide-Over Spec)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/booking")}
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-hover"
                >
                  ไปหน้าจองคิว & โอนมัดจำ (ERP Sync)
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setSelectedVehicleId(currentSlide.vehicleId);
                  router.push(
                    `/shop?vehicle=${encodeURIComponent(currentSlide.vehicleId)}`
                  );
                }}
                className="rounded-full border border-white/30 bg-black/60 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-primary hover:text-primary"
              >
                ดูของแต่งตรงรุ่นคันนี้ (Shop by Vehicle)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Urban Style Slide Thumbnails */}
        <div className="relative z-10 mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HERO_SLIDES.map((s, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={s.no}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative overflow-hidden rounded-xl border p-3.5 text-left transition backdrop-blur ${
                    active
                      ? "border-primary bg-black/80"
                      : "border-white/10 bg-black/40 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span
                      className={`font-bold ${
                        active ? "text-primary" : "text-neutral-400"
                      }`}
                    >
                      {s.no}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                      {active ? "กำลังแสดง" : "คลิกเพื่อดู"}
                    </span>
                  </div>
                  <p className="mt-1 truncate font-heading text-sm font-bold text-white">
                    {s.titleLine1}
                  </p>
                  <p className="truncate text-[11px] text-neutral-300">
                    {s.titleHighlight}
                  </p>

                  {/* Progress Line */}
                  <div className="mt-2.5 h-0.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className={`h-full bg-primary transition-all duration-500 ${
                        active ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* IND Distribution Docked Vehicle Fitment Command Bar */}
      <div className="border-y border-border bg-surface py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                IND STYLE VEHICLE SELECTOR
              </span>
              <h2 className="mt-0.5 font-heading text-xl font-bold text-foreground">
                ค้นหาของแต่งตรงรุ่นรถของคุณทันที
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-12 lg:col-span-8">
              <div className="sm:col-span-7">
                <select
                  aria-label="เลือกรุ่นรถของคุณ"
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="ALL">
                    แสดงทุกรุ่นรถ (All Vehicles & Universal Packages)
                  </option>
                  {VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({v.chassisCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2.5 sm:col-span-5">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/shop?vehicle=${encodeURIComponent(selectedVehicleId)}`
                    )
                  }
                  className="flex-1 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  ค้นหาของแต่งตรงรุ่น
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/showcase")}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                >
                  ดูผลงานร้าน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
