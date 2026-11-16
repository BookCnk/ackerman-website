"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  CatalogItem,
  SHOWCASE_BUILDS,
  ShowcaseBuild,
  VEHICLES,
  formatTHB,
} from "@/lib/mock-erp-data";

export default function ShowcaseContent() {
  const router = useRouter();
  const { addItem, setSelectedVehicleId } = useBooking();
  const [vehicleFilter, setVehicleFilter] = useState<string>("ALL");
  const [activePhotoMap, setActivePhotoMap] = useState<Record<string, string>>({});

  // Drawer state for "Clone This Build" customizer
  const [activeDrawerBuild, setActiveDrawerBuild] = useState<ShowcaseBuild | null>(null);
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);

  const builds = SHOWCASE_BUILDS.filter(
    (b) => vehicleFilter === "ALL" || b.vehicleId === vehicleFilter
  );

  const openCloneDrawer = (build: ShowcaseBuild) => {
    setActiveDrawerBuild(build);
    setSelectedPartIds([...build.partIds]);
  };

  const closeCloneDrawer = () => {
    setActiveDrawerBuild(null);
  };

  const togglePartSelection = (partId: string) => {
    setSelectedPartIds((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
    );
  };

  const handleConfirmCloneToBooking = () => {
    if (!activeDrawerBuild) return;
    setSelectedVehicleId(activeDrawerBuild.vehicleId);

    const partsToAdd = activeDrawerBuild.partIds
      .filter((id) => selectedPartIds.includes(id))
      .map((id) => CATALOG_ITEMS.find((item) => item.id === id))
      .filter((item): item is CatalogItem => Boolean(item));

    partsToAdd.forEach((item) => {
      addItem(item, false);
    });

    closeCloneDrawer();
    router.push("/booking");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Fitment & Build Gallery (แกลเลอรีผลงานแต่งจริง)
          </p>
          <h2 className="mt-1 font-heading text-xl font-bold">
            เลือกชมผลงานแต่งรถระดับมาสเตอร์พีซ แล้วกดเลือกชิ้นส่วนแต่งตามได้ทันที
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
      <div className="mt-8 flex flex-col gap-12">
        {builds.map((build) => {
          const buildItems = build.partIds
            .map((id) => CATALOG_ITEMS.find((item) => item.id === id))
            .filter((item): item is CatalogItem => Boolean(item));

          const grandTotal = buildItems.reduce(
            (sum, item) => sum + item.partPrice + item.laborPrice,
            0
          );
          const activeImg = activePhotoMap[build.id] ?? build.heroImage;

          return (
            <article
              key={build.id}
              className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lg transition hover:border-primary/50"
            >
              <div className="grid lg:grid-cols-12">
                {/* Left Column: Visual Gallery + Quick Stance Specs */}
                <div className="flex flex-col justify-between border-b border-border bg-background p-6 lg:col-span-5 lg:border-r lg:border-b-0">
                  <div>
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={activeImg}
                        alt={build.title}
                        fill
                        className="object-cover transition duration-500"
                        unoptimized
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow">
                        {build.categoryTag}
                      </span>
                    </div>

                    {/* Thumbnail Switcher */}
                    <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
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
                          className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activeImg === imgUrl
                              ? "border-primary scale-105"
                              : "border-border opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${build.title} มุมที่ ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick-Spec Fitment Matrix */}
                  <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-4 text-xs font-mono tabular-nums">
                    <div>
                      <span className="text-[11px] text-muted block">ช่วงล่าง (Suspension):</span>
                      <p className="mt-0.5 font-bold text-foreground truncate">
                        {build.stanceSpecs.suspension}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted block">ล้อและยาง (Wheels/Tires):</span>
                      <p className="mt-0.5 font-bold text-foreground truncate">
                        {build.stanceSpecs.wheels}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted block">ระบบเบรก (Brakes):</span>
                      <p className="mt-0.5 font-bold text-foreground truncate">
                        {build.stanceSpecs.brakes}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted block">ระบบไอเสีย / ชุดแต่ง:</span>
                      <p className="mt-0.5 font-bold text-foreground truncate">
                        {build.stanceSpecs.exhaustOrAero}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Build Story + BOM Parts Breakdown + Book This Build CTA */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted tabular-nums">
                      <span className="font-semibold text-secondary">
                        เจ้าของรถ: {build.ownerHandle}
                      </span>
                      <span>ส่งมอบเรียบร้อยเมื่อ: {build.completedDate}</span>
                    </div>

                    <h3 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      {build.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {build.summary}
                    </p>

                    {/* Bill of Materials (BOM) Table */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                          รายการอะไหล่และบริการที่ใช้ในคันนี้ (Parts Breakdown / BOM)
                        </h4>
                        <span className="text-xs text-muted tabular-nums">
                          {buildItems.length} รายการ
                        </span>
                      </div>

                      <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-background">
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
                                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-emerald-400 tabular-nums">
                                  {part.stockStatus === "IN_STOCK"
                                    ? "พร้อมติดตั้ง"
                                    : `พรีออเดอร์ ${part.leadTimeDays} วัน`}
                                </span>
                              </div>
                              <p className="mt-0.5 text-muted tabular-nums font-mono">
                                รหัส SKU: {part.sku} • ประกันศูนย์ {part.warrantyMonths} เดือน
                              </p>
                            </div>
                            <div className="text-right tabular-nums">
                              <p className="font-bold text-foreground font-mono text-sm">
                                {formatTHB(part.partPrice + part.laborPrice)}
                              </p>
                              <p className="text-[10px] text-emerald-400 font-medium">
                                ✓ รวมติดตั้งแล้ว
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Summary & Conversion Bar */}
                  <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-primary/40 bg-background p-4 sm:flex-row sm:items-center">
                    <div className="tabular-nums font-mono">
                      <p className="text-xs text-muted">
                        งบประมาณทั้งเซ็ต ({buildItems.length} รายการ รวมบริการติดตั้ง):
                      </p>
                      <div className="mt-0.5 text-2xl font-extrabold text-primary">
                        {formatTHB(grandTotal)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => openCloneDrawer(build)}
                        className="rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold text-foreground transition hover:border-primary hover:text-primary"
                      >
                        ปรับแต่งชิ้นส่วนเอง (Customize)
                      </button>

                      <button
                        type="button"
                        onClick={() => openCloneDrawer(build)}
                        className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25 transition hover:bg-primary-hover"
                      >
                        แต่งตามสเปกคันนี้ (Clone This Build) →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Slide-over Drawer: "Clone This Build" Part Customizer */}
      {activeDrawerBuild && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative flex h-full w-full max-w-lg flex-col justify-between border-l border-border bg-surface p-6 shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    BOM Package Customizer
                  </span>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    เลือกชิ้นส่วนแต่งตาม {activeDrawerBuild.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeCloneDrawer}
                  className="rounded-lg border border-border p-2 text-muted transition hover:text-foreground"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Part Checkbox List */}
              <div className="mt-4 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {activeDrawerBuild.partIds.map((partId) => {
                  const part = CATALOG_ITEMS.find((c) => c.id === partId);
                  if (!part) return null;
                  const isChecked = selectedPartIds.includes(part.id);
                  const itemTotal = part.partPrice + part.laborPrice;

                  return (
                    <label
                      key={part.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                        isChecked
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background opacity-60 hover:opacity-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePartSelection(part.id)}
                        className="mt-1 h-4 w-4 rounded border-border accent-primary"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-foreground block">
                          {part.name}
                        </span>
                        <span className="text-[11px] text-muted font-mono block">
                          SKU: {part.sku} • {part.category}
                        </span>
                        <span className="text-xs font-bold text-primary tabular-nums font-mono block mt-1">
                          {formatTHB(itemTotal)} (รวมติดตั้ง)
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Action */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-xs font-mono tabular-nums mb-3">
                <span className="text-muted">
                  ยอดรวม ({selectedPartIds.length} ชิ้นที่เลือก):
                </span>
                <span className="text-xl font-extrabold text-primary">
                  {formatTHB(
                    activeDrawerBuild.partIds
                      .filter((id) => selectedPartIds.includes(id))
                      .map((id) => CATALOG_ITEMS.find((item) => item.id === id))
                      .filter((item): item is CatalogItem => Boolean(item))
                      .reduce((sum, item) => sum + item.partPrice + item.laborPrice, 0)
                  )}
                </span>
              </div>

              <button
                type="button"
                disabled={selectedPartIds.length === 0}
                onClick={handleConfirmCloneToBooking}
                className="w-full rounded-full bg-primary py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover disabled:opacity-50"
              >
                ส่งรายการที่เลือกเข้าหน้าจองคิวมัดจำทันที →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
