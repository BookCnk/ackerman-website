"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  SHOWCASE_BUILDS,
  VEHICLES,
  calculateDeposit,
  formatTHB,
} from "@/lib/mock-erp-data";

export default function ShowcaseContent() {
  const router = useRouter();
  const { loadBuildPreset } = useBooking();
  const [vehicleFilter, setVehicleFilter] = useState<string>("ALL");
  const [activePhotoMap, setActivePhotoMap] = useState<Record<string, string>>(
    {}
  );

  const builds = SHOWCASE_BUILDS.filter(
    (b) => vehicleFilter === "ALL" || b.vehicleId === vehicleFilter
  );

  const handleBookThisBuild = (vehicleId: string, partIds: string[]) => {
    loadBuildPreset(vehicleId, partIds);
    router.push("/booking");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Fitment & Build Gallery
          </p>
          <h2 className="mt-1 font-heading text-xl font-bold">
            เลือกดูผลงานตามรุ่นรถ แล้วกดดึงสเปกเข้าตะกร้าจองคิวได้ทันที
          </h2>
        </div>

        <div className="w-full sm:w-72">
          <select
            aria-label="กรองผลงานตามรุ่นรถ"
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">แสดงผลงานทุกรุ่นรถ ({SHOWCASE_BUILDS.length} คัน)</option>
            {VEHICLES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Build Cards */}
      <div className="mt-8 flex flex-col gap-10">
        {builds.map((build) => {
          const buildItems = build.partIds
            .map((id) => CATALOG_ITEMS.find((item) => item.id === id))
            .filter((item): item is NonNullable<typeof item> => Boolean(item));

          const calc = calculateDeposit(buildItems);
          const activeImg = activePhotoMap[build.id] ?? build.heroImage;

          return (
            <article
              key={build.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="grid lg:grid-cols-12">
                {/* Left Column: Visual Gallery + Quick Stance Specs */}
                <div className="flex flex-col justify-between border-b border-border bg-background p-5 lg:col-span-5 lg:border-r lg:border-b-0">
                  <div>
                    <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-80">
                      <Image
                        src={activeImg}
                        alt={build.title}
                        width={800}
                        height={520}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        {build.categoryTag}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2.5">
                      {build.galleryImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setActivePhotoMap((prev) => ({
                              ...prev,
                              [build.id]: imgUrl,
                            }))
                          }
                          className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 transition ${
                            activeImg === imgUrl
                              ? "border-primary"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${build.title} มุมที่ ${idx + 1}`}
                            width={160}
                            height={100}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick-Spec Fitment Matrix */}
                  <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 text-xs">
                    <div>
                      <span className="text-muted">ช่วงล่าง (Suspension):</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {build.stanceSpecs.suspension}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">ล้อและยาง (Wheels/Tires):</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {build.stanceSpecs.wheels}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">ระบบเบรก (Brakes):</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {build.stanceSpecs.brakes}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">ท่อ / การปกป้องสี:</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {build.stanceSpecs.exhaustOrAero}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Build Story + BOM Parts Breakdown + Book This Build CTA */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted tabular-nums">
                      <span>เจ้าของรถ: {build.ownerHandle}</span>
                      <span>ส่งมอบเมื่อ: {build.completedDate}</span>
                    </div>

                    <h3 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      {build.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {build.summary}
                    </p>

                    {/* Bill of Materials (BOM) Table */}
                    <div className="mt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        รายการอะไหล่และบริการที่ใช้ในคันนี้ (Parts Breakdown / BOM)
                      </h4>
                      <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-background">
                        {buildItems.map((part) => (
                          <div
                            key={part.id}
                            className="flex flex-col justify-between gap-2 p-3.5 text-xs sm:flex-row sm:items-center"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">
                                  {part.name}
                                </span>
                                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted tabular-nums">
                                  {part.stockStatus === "IN_STOCK"
                                    ? "พร้อมติด"
                                    : part.stockStatus === "PRE_ORDER"
                                    ? `พรีออเดอร์ ${part.leadTimeDays} วัน`
                                    : "บริการ"}
                                </span>
                              </div>
                              <p className="mt-0.5 text-muted tabular-nums">
                                รหัส ERP: {part.sku} • เวลาติดตั้ง {part.installHours} ชม.
                              </p>
                            </div>
                            <div className="text-right tabular-nums">
                              <p className="font-semibold text-foreground">
                                {formatTHB(part.partPrice + part.laborPrice)}
                              </p>
                              <p className="text-[11px] text-muted">
                                (ของ {formatTHB(part.partPrice)} + แรง{" "}
                                {formatTHB(part.laborPrice)})
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Summary & Conversion Bar */}
                  <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-primary/40 bg-background p-4 sm:flex-row sm:items-center">
                    <div className="tabular-nums">
                      <p className="text-xs text-muted">
                        งบประมาณทั้งเซ็ตพร้อมติดตั้ง ({buildItems.length} รายการ):
                      </p>
                      <div className="mt-0.5 flex items-baseline gap-3">
                        <span className="font-heading text-2xl font-bold text-foreground">
                          {formatTHB(calc.grandTotal)}
                        </span>
                        <span className="text-xs font-semibold text-primary">
                          (มัดจำจองคิว {formatTHB(calc.depositAmount)})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          handleBookThisBuild(build.vehicleId, build.partIds)
                        }
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                      >
                        จองชุดแต่งตามคันนี้ (Book This Build)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

