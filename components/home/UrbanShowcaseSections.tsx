"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  URBAN_BANNERS,
  URBAN_DISCOVER,
  URBAN_ONE_OF_ONE,
} from "@/lib/mock-erp-data";
import { useBooking } from "@/components/booking/BookingContext";

export default function UrbanShowcaseSections() {
  const router = useRouter();
  const { setSelectedVehicleId } = useBooking();
  const [activeOneIdx, setActiveOneIdx] = useState(0);

  return (
    <div className="bg-background text-foreground">
      {/* 1. URBAN CREST & INTRO STATEMENT */}
      <section className="relative overflow-hidden border-t border-border py-24 text-center sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Image
              src="/sites/urban/urban-shield-logo.svg"
              alt="Urban Automotive Crest"
              width={54}
              height={54}
              className="h-14 w-auto invert brightness-200"
            />
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-primary">
            CREATORS OF THE WORLD&apos;S MOST ICONIC MODIFIED VEHICLES
          </p>

          <h2 className="mt-4 font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-5xl lg:text-6xl">
            BESPOKE AUTOMOTIVE EXCELLENCE
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-secondary sm:text-base">
            ยินดีต้อนรับสู่ Ackermann Garage &times; Urban Automotive ตัวแทนผู้เชี่ยวชาญการติดตั้งชุดแต่งคาร์บอนไฟเบอร์แท้แบบ Widetrack สำหรับ Defender, Range Rover, Urus และ G-Wagon พร้อมทีมช่างระดับ Meister และระบบจองคิวเชื่อมต่อคลัง ERP โดยตรง
          </p>
        </div>
      </section>

      {/* 2. FULLSCREEN SLIDE-UP BESPOKE VEHICLE BANNERS */}
      <section className="space-y-4 px-4 sm:px-6 lg:px-8">
        {URBAN_BANNERS.map((banner, index) => (
          <article
            key={banner.id}
            className="group relative flex h-[70vh] min-h-[500px] w-full flex-col justify-end overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Dark gradient for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                    {banner.badge}
                  </span>
                  <span className="text-xs font-semibold tracking-wider text-neutral-300 uppercase tabular-nums">
                    PROGRAMME 0{index + 1}
                  </span>
                </div>

                <h3 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {banner.title}
                </h3>

                <p className="mt-3 text-sm text-neutral-300 sm:text-base">
                  {banner.subtitle}
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVehicleId(banner.vehicleId);
                      router.push(
                        `/shop?vehicle=${encodeURIComponent(banner.vehicleId)}`
                      );
                    }}
                    className="rounded-full bg-white px-7 py-3 text-xs font-bold tracking-widest text-black uppercase transition hover:bg-neutral-200"
                  >
                    {banner.linkText}
                  </button>
                  <Link
                    href="/showcase"
                    className="rounded-full border border-white/40 bg-black/40 px-7 py-3 text-xs font-bold tracking-widest text-white uppercase backdrop-blur transition hover:border-white hover:bg-black/60"
                  >
                    ดูผลงานคันนี้
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* 3. THE ART OF MODIFICATION — YOUTUBE CINEMA SHOWCASE */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              URBAN AUTOMOTIVE CINEMA
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              THE ART OF MODIFICATION
            </h2>
            <p className="mt-4 text-sm text-secondary sm:text-base">
              ชมวิดีโอกระบวนการออกแบบ ปั้นโมเดลแอโร่คาร์บอน และประกอบรถด้วยมืออย่างประณีต
            </p>
          </div>

          <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-2xl">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/GciY1-8fqBE?autoplay=0&mute=1&controls=1&rel=0"
              title="Urban Automotive - The Art of Modification"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* 4. "ONE OF ONE" BESPOKE CAROUSEL SECTION */}
      <section className="border-t border-border bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/sites/urban/urban-one-of-one.svg"
                  alt="One of One"
                  width={24}
                  height={24}
                  className="h-6 w-auto invert brightness-200"
                />
                <span className="text-xs font-bold tracking-[0.35em] text-primary uppercase">
                  BESPOKE COMMISSIONS
                </span>
              </div>
              <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
                ONE OF ONE
              </h2>
              <p className="mt-2 text-sm text-muted">
                ยานยนต์สั่งทำพิเศษแบบไม่ซ้ำใครในโลก ปรับแต่งตามอัตลักษณ์ของเจ้าของรถโดยเฉพาะ
              </p>
            </div>

            {/* Carousel navigation controls */}
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous Build"
                onClick={() =>
                  setActiveOneIdx((prev) =>
                    prev === 0 ? URBAN_ONE_OF_ONE.length - 1 : prev - 1
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background transition hover:border-primary"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next Build"
                onClick={() =>
                  setActiveOneIdx((prev) => (prev + 1) % URBAN_ONE_OF_ONE.length)
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background transition hover:border-primary"
              >
                →
              </button>
            </div>
          </div>

          {/* Overlap Cards Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {URBAN_ONE_OF_ONE.slice(activeOneIdx, activeOneIdx + 3).concat(
              URBAN_ONE_OF_ONE.slice(
                0,
                Math.max(0, activeOneIdx + 3 - URBAN_ONE_OF_ONE.length)
              )
            ).map((one) => (
              <article
                key={one.id}
                className="group relative flex h-[500px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-background p-6"
              >
                <Image
                  src={one.image}
                  alt={one.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                    {one.owner}
                  </span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-white group-hover:text-primary">
                    {one.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-300">{one.specs}</p>
                  <Link
                    href="/showcase"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    ดูรายละเอียดคันนี้ →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPLIT 2-COLUMN FEATURE BANNERS */}
      <section className="grid gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Banner 1: Topaz PPF */}
        <article className="group relative flex h-[480px] flex-col justify-end overflow-hidden rounded-3xl border border-border p-8 sm:p-12">
          <Image
            src="/sites/urban/banner-topaz-ppf.webp"
            alt="Urban x Topaz PPF"
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              PAINT PROTECTION FILM
            </span>
            <h3 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              URBAN &times; TOPAZ DETAILING
            </h3>
            <p className="mt-2 max-w-md text-xs text-neutral-300 sm:text-sm">
              ฟิล์มใสกันรอยสะท้อนแสงระดับสูง คืนตัวจากรอยขีดข่วนอัตโนมัติ ติดตั้งในห้องคลีนรูมปลอดฝุ่น 100%
            </p>
            <button
              type="button"
              onClick={() => router.push("/shop?category=Lifestyle")}
              className="mt-6 rounded-full bg-white px-7 py-3 text-xs font-bold tracking-widest text-black uppercase transition hover:bg-neutral-200"
            >
              ดูแพ็กเกจฟิล์ม PPF
            </button>
          </div>
        </article>

        {/* Banner 2: 10 Years of Bespoke Styling */}
        <article className="group relative flex h-[480px] flex-col justify-end overflow-hidden rounded-3xl border border-border p-8 sm:p-12">
          <Image
            src="/sites/urban/banner-10-years.webp"
            alt="10 Years of Bespoke Styling"
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              A DECADE OF INNOVATION
            </span>
            <h3 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              10 YEARS OF BESPOKE STYLING
            </h3>
            <p className="mt-2 max-w-md text-xs text-neutral-300 sm:text-sm">
              ฉลองครบรอบหนึ่งทศวรรษแห่งความเชี่ยวชาญการปรับแต่งยนตรกรรมระดับพรีเมียม สู่ Ackermann Garage
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-xs font-bold tracking-widest text-black uppercase transition hover:bg-neutral-200"
            >
              เกี่ยวกับเรา
            </Link>
          </div>
        </article>
      </section>

      {/* 6. "DISCOVER URBAN" SQUARE CAROUSEL */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
              EXPLORE OUR DEPARTMENTS
            </span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              DISCOVER URBAN &times; ACKERMANN
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {URBAN_DISCOVER.map((disc) => (
              <div
                key={disc.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-primary"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={disc.image}
                    alt={disc.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-heading text-xs font-bold uppercase text-foreground group-hover:text-primary">
                    {disc.title}
                  </h4>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-muted">
                    {disc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

