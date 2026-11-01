"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  SHOWCASE_BUILDS,
  VEHICLES,
  calculateDeposit,
  formatTHB,
} from "@/lib/mock-erp-data";

export default function SlideOverDrawer() {
  const router = useRouter();
  const {
    selectedVehicleId,
    selectedItems,
    addItem,
    removeItem,
    clearItems,
    loadBuildPreset,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    inspectedBuildId,
    setInspectedBuildId,
  } = useBooking();

  const isOpen = isCartDrawerOpen || Boolean(inspectedBuildId);
  const inspectedBuild = SHOWCASE_BUILDS.find(
    (b) => b.id === inspectedBuildId
  );

  const summary = calculateDeposit(selectedItems);
  const currentVehicle = VEHICLES.find((v) => v.id === selectedVehicleId);

  const closeAll = () => {
    setIsCartDrawerOpen(false);
    setInspectedBuildId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeAll}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg border-l border-border bg-surface shadow-2xl">
          <div className="flex h-full flex-col justify-between">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border bg-background px-6 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  {inspectedBuild
                    ? "BESPOKE BUILD SPECIFICATION"
                    : "ERP BOOKING & QUOTATION DRAWER"}
                </p>
                <h2 className="mt-1 font-heading text-lg font-bold text-foreground">
                  {inspectedBuild
                    ? "รายละเอียดสเปกรถแต่ง (Build Sheet)"
                    : `รายการจองคิวติดตั้ง (${selectedItems.length} รายการ)`}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeAll}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-primary hover:text-foreground"
                aria-label="ปิดหน้าต่างสไลด์"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mode Switcher Tabs inside Drawer */}
            {inspectedBuild && (
              <div className="grid grid-cols-2 border-b border-border bg-background px-6 py-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className={`rounded-lg py-2 ${
                    !isCartDrawerOpen
                      ? "bg-primary text-white"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  สเปกรถคันนี้ (Build BOM)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInspectedBuildId(null);
                    setIsCartDrawerOpen(true);
                  }}
                  className="rounded-lg py-2 text-muted hover:text-foreground tabular-nums"
                >
                  ตะกร้าจองคิว ({selectedItems.length})
                </button>
              </div>
            )}

            {/* Drawer Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {inspectedBuild && !isCartDrawerOpen ? (
                /* MODE A: Inspecting a Showcase Build */
                <div className="space-y-5">
                  <div className="relative h-52 w-full overflow-hidden rounded-xl border border-border bg-background">
                    <Image
                      src={inspectedBuild.heroImage}
                      alt={inspectedBuild.title}
                      width={640}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {inspectedBuild.categoryTag}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-muted tabular-nums">
                      {inspectedBuild.ownerHandle} • ส่งมอบเมื่อ{" "}
                      {inspectedBuild.completedDate}
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-bold text-foreground">
                      {inspectedBuild.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {inspectedBuild.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-border bg-background p-3.5 text-xs">
                    <div>
                      <span className="text-muted">Suspension:</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {inspectedBuild.stanceSpecs.suspension}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">Wheels & Tires:</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {inspectedBuild.stanceSpecs.wheels}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">Brakes:</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {inspectedBuild.stanceSpecs.brakes}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">Exhaust / PPF:</span>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {inspectedBuild.stanceSpecs.exhaustOrAero}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      รายการอะไหล่ที่ใช้ในคันนี้ (กดเลือกทีละชิ้น หรือเหมาทั้งเซ็ต)
                    </h4>
                    <div className="mt-3 space-y-2.5">
                      {inspectedBuild.partIds.map((pid) => {
                        const part = CATALOG_ITEMS.find((i) => i.id === pid);
                        if (!part) return null;
                        const inCart = selectedItems.some(
                          (s) => s.id === part.id
                        );
                        return (
                          <div
                            key={part.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-xs"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {part.name}
                              </p>
                              <p className="mt-0.5 text-muted tabular-nums">
                                ของ {formatTHB(part.partPrice)} + แรง{" "}
                                {formatTHB(part.laborPrice)} •{" "}
                                {part.stockStatus === "IN_STOCK"
                                  ? "มีสต็อกพร้อมติด"
                                  : part.stockStatus === "PRE_ORDER"
                                  ? `พรีออเดอร์ ${part.leadTimeDays} วัน`
                                  : "บริการมาตรฐาน"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                inCart
                                  ? removeItem(part.id)
                                  : addItem(part, false)
                              }
                              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                inCart
                                  ? "border border-primary text-primary"
                                  : "bg-primary text-white hover:bg-primary-hover"
                              }`}
                            >
                              {inCart ? "เลือกแล้ว" : "+ เลือกชิ้นนี้"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* MODE B: Booking Cart & Live Quotation */
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-background p-3.5 text-xs">
                    <span className="text-muted">รุ่นรถที่เลือกปัจจุบัน:</span>
                    <p className="mt-0.5 font-semibold text-foreground">
                      {currentVehicle
                        ? currentVehicle.label
                        : "ยังไม่ได้ระบุรุ่นรถเฉพาะเจาะจง (สามารถเลือกในหน้าจองได้)"}
                    </p>
                  </div>

                  {selectedItems.length === 0 ? (
                    <div className="rounded-xl border border-border bg-background p-8 text-center">
                      <p className="text-sm font-medium text-foreground">
                        ยังไม่มีรายการสินค้าในตะกร้าจองคิว
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        เลือกของแต่งจากหน้าแคตตาล็อก หรือดึงสเปกจากหน้าผลงานร้านได้เลย
                      </p>
                      <Link
                        href="/shop"
                        onClick={closeAll}
                        className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
                      >
                        ไปหน้าเลือกสินค้า & เช็คราคา
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-secondary">
                          รายการที่เลือก ({selectedItems.length} รายการ)
                        </span>
                        <button
                          type="button"
                          onClick={clearItems}
                          className="text-muted transition hover:text-primary"
                        >
                          ล้างทั้งหมด
                        </button>
                      </div>

                      <ul className="space-y-3">
                        {selectedItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-3.5 text-xs"
                          >
                            <div className="flex gap-3">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                              />
                              <div>
                                <span className="text-[11px] font-semibold text-primary">
                                  {item.brand} • {item.sku}
                                </span>
                                <p className="font-semibold text-foreground">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-muted tabular-nums">
                                  ของ {formatTHB(item.partPrice)} + ค่าแรง{" "}
                                  {formatTHB(item.laborPrice)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-muted transition hover:text-primary"
                            >
                              ลบ
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Action */}
            <div className="border-t border-border bg-background p-6">
              {inspectedBuild && !isCartDrawerOpen ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      loadBuildPreset(
                        inspectedBuild.vehicleId,
                        inspectedBuild.partIds
                      );
                      closeAll();
                      router.push("/booking");
                    }}
                    className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                  >
                    จองชุดแต่งตามคันนี้ทั้งเซ็ต (Book This Build)
                  </button>
                </div>
              ) : (
                <div className="space-y-3 tabular-nums">
                  <div className="flex justify-between text-xs text-muted">
                    <span>ยอดประเมินรวม (ของ + ค่าแรง):</span>
                    <span className="font-semibold text-foreground">
                      {formatTHB(summary.grandTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary">
                    <span>ยอดโอนมัดจำเพื่อล็อกคิว ERP:</span>
                    <span>{formatTHB(summary.depositAmount)}</span>
                  </div>
                  <p className="text-[11px] text-muted">
                    สถานะความพร้อมอะไหล่:{" "}
                    <span className="font-semibold text-secondary">
                      {summary.overallReadiness}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <Link
                      href="/shop"
                      onClick={closeAll}
                      className="rounded-full border border-border bg-surface py-3 text-center text-xs font-semibold text-foreground transition hover:border-primary"
                    >
                      เลือกของเพิ่ม
                    </Link>
                    <Link
                      href="/booking"
                      onClick={closeAll}
                      className="rounded-full bg-primary py-3 text-center text-xs font-semibold text-white transition hover:bg-primary-hover"
                    >
                      ไปหน้าโอนมัดจำ & นัดวัน
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

