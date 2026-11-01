"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  CatalogItem,
  StockStatus,
  VEHICLES,
  calculateDeposit,
  formatTHB,
} from "@/lib/mock-erp-data";

const CATEGORIES: CatalogItem["category"][] = [
  "Performance",
  "Exterior",
  "Exhaust",
  "Interior",
  "Suspension",
  "Wheels",
  "Brakes",
  "Lifestyle",
];

function StockBadge({ item }: { item: CatalogItem }) {
  if (item.stockStatus === "IN_STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-medium text-foreground tabular-nums">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        อะไหล่พร้อมติด (คงเหลือ {item.stockQty} ชุดใน ERP)
      </span>
    );
  }
  if (item.stockStatus === "PRE_ORDER") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-secondary tabular-nums">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        พรีออเดอร์สั่งเบิก ({item.leadTimeDays} วันทำการถึงอู่)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
      บริการมาตรฐานอู่ (นัดคิวได้ทันที)
    </span>
  );
}

export default function ShopContent() {
  const {
    selectedVehicleId,
    setSelectedVehicleId,
    selectedItems,
    addItem,
    removeItem,
  } = useBooking();

  const [category, setCategory] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<StockStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("default");

  // Sync URL query params from IND Mega-Menu / Homepage Shop by Category & Vehicle cards
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const vParam = params.get("vehicle");
    const cParam = params.get("category");
    const qParam = params.get("q");

    if (vParam) setSelectedVehicleId(vParam);
    if (cParam) setCategory(cParam);
    if (qParam !== null) setSearchQuery(qParam);
  }, [setSelectedVehicleId]);

  const currentVehicle = VEHICLES.find((v) => v.id === selectedVehicleId);
  const summary = calculateDeposit(selectedItems);

  const filtered = useMemo(() => {
    const items = CATALOG_ITEMS.filter((item) => {
      const matchesVehicle =
        selectedVehicleId === "ALL" ||
        item.compatibleVehicles.includes("ALL") ||
        item.compatibleVehicles.includes(selectedVehicleId);

      const matchesCategory = !category || item.category === category;
      const matchesStock =
        stockFilter === "ALL" || item.stockStatus === stockFilter;
      const matchesQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesVehicle && matchesCategory && matchesStock && matchesQuery
      );
    });

    const totalCost = (i: CatalogItem) => i.partPrice + i.laborPrice;
    if (sort === "price-asc") items.sort((a, b) => totalCost(a) - totalCost(b));
    if (sort === "price-desc") items.sort((a, b) => totalCost(b) - totalCost(a));
    return items;
  }, [selectedVehicleId, category, stockFilter, searchQuery, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Vehicle Fitment Selector Bar */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              IND Style Vehicle Fitment Filter (กรองของแต่งตรงรุ่นรถ)
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold">
              {currentVehicle
                ? `กำลังแสดงของแต่งสำหรับ: ${currentVehicle.label}`
                : "แสดงสินค้าและแพ็กเกจทั้งหมดทุกรุ่นรถ"}
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            <select
              aria-label="เลือกรุ่นรถของคุณ"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="ALL">ทุกรุ่นรถ (Show All Vehicles)</option>
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="ค้นหาชื่ออะไหล่, แบรนด์ (Öhlins, Brembo, BBS) หรือรหัส SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Sidebar Filters */}
        <aside className="flex flex-col gap-6 lg:col-span-3">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-heading text-base font-semibold">
              หมวดหมู่สินค้า & บริการ (Shop by Category)
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    category === null
                      ? "bg-primary font-medium text-white"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  ทั้งหมด ({CATALOG_ITEMS.length})
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => setCategory(category === c ? null : c)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition ${
                      category === c
                        ? "bg-primary font-medium text-white"
                        : "text-muted hover:bg-background hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-heading text-base font-semibold">
              สถานะคลัง ERP (Stock Readiness)
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {[
                { value: "ALL", label: "ทั้งหมด (มีสต็อก + พรีออเดอร์)" },
                { value: "IN_STOCK", label: "มีสต็อกพร้อมติดทันที (Parts Ready)" },
                { value: "PRE_ORDER", label: "สินค้าพรีออเดอร์สั่งเบิก (Inbound PO)" },
                { value: "SERVICE_ONLY", label: "แพ็กเกจบริการ (Service Bundle)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setStockFilter(opt.value as StockStatus | "ALL")
                  }
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    stockFilter === opt.value
                      ? "border border-primary bg-background font-medium text-primary"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Live Booking Quotation Summary Box */}
          <section className="sticky top-28 rounded-xl border border-primary/50 bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-foreground">
                ใบประเมินราคา & จองคิว
              </h3>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white tabular-nums">
                {selectedItems.length} รายการ
              </span>
            </div>

            {selectedItems.length === 0 ? (
              <p className="mt-4 text-xs leading-relaxed text-muted">
                ยังไม่มีสินค้าในรายการจอง กดปุ่ม &ldquo;เลือกใส่รายการจองคิว&rdquo;
                เพื่อคำนวณค่าของ ค่าแรง และยอดมัดจำอัตโนมัติ
              </p>
            ) : (
              <>
                <ul className="mt-4 flex max-h-56 flex-col gap-2.5 overflow-y-auto pr-1 text-xs">
                  {selectedItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-border bg-background p-2.5"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-muted tabular-nums">
                          ของ {formatTHB(item.partPrice)} + ค่าแรง{" "}
                          {formatTHB(item.laborPrice)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted transition hover:text-primary"
                        aria-label={`ลบ ${item.name}`}
                      >
                        ลบ
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs tabular-nums">
                  <div className="flex justify-between text-muted">
                    <span>รวมค่าอะไหล่:</span>
                    <span className="text-foreground">
                      {formatTHB(summary.partsTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>รวมค่าแรงติดตั้งประเมิน:</span>
                    <span className="text-foreground">
                      {formatTHB(summary.laborTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>ยอดประเมินรวมทั้งสิ้น:</span>
                    <span>{formatTHB(summary.grandTotal)}</span>
                  </div>
                  <div className="mt-2 rounded-lg border border-primary/40 bg-background p-2.5">
                    <div className="flex justify-between font-bold text-primary">
                      <span>ยอดโอนมัดจำเพื่อล็อกคิว:</span>
                      <span>{formatTHB(summary.depositAmount)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      {summary.depositRuleText}
                    </p>
                  </div>
                </div>

                <Link
                  href="/booking"
                  className="mt-4 block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  ไปหน้าเลือกวันนัด & โอนมัดจำ
                </Link>
              </>
            )}
          </section>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted tabular-nums">
              พบสินค้าและแพ็กเกจที่รองรับ {filtered.length} รายการ
            </p>
            <select
              aria-label="เรียงลำดับราคา"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="default">เรียงตามรายการแนะนำ</option>
              <option value="price-asc">ราคารวม: ต่ำไปสูง</option>
              <option value="price-desc">ราคารวม: สูงไปต่ำ</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-border bg-surface p-12 text-center">
              <p className="text-base font-medium text-foreground">
                ไม่พบรายการอะไหล่ตามตัวกรองที่เลือก
              </p>
              <p className="mt-2 text-sm text-muted">
                ลองเปลี่ยนรุ่นรถ หรือกดล้างตัวกรองหมวดหมู่เพื่อดูสินค้าทั้งหมด
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedVehicleId("ALL");
                  setCategory(null);
                  setStockFilter("ALL");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                รีเซ็ตตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {filtered.map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                return (
                  <article
                    key={item.id}
                    className={`flex flex-col overflow-hidden rounded-2xl border transition ${
                      isSelected
                        ? "border-primary bg-surface"
                        : "border-border bg-surface hover:border-muted"
                    }`}
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-background">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={640}
                        height={420}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <StockBadge item={item} />
                      </div>
                      <div className="absolute right-3 bottom-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-secondary backdrop-blur tabular-nums">
                        SKU: {item.sku}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span className="font-semibold text-primary">
                          {item.brand}
                        </span>
                        <span>{item.category}</span>
                      </div>

                      <h3 className="mt-1.5 font-heading text-lg font-semibold leading-snug text-foreground">
                        {item.name}
                      </h3>

                      <ul className="mt-3 space-y-1 text-xs text-muted">
                        {item.specs.map((s) => (
                          <li key={s} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 rounded-xl border border-border bg-background p-3.5 text-xs tabular-nums">
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted">ราคาอะไหล่ (Parts):</span>
                          <span className="font-semibold text-foreground">
                            {item.partPrice > 0
                              ? formatTHB(item.partPrice)
                              : "ไม่มีค่าอะไหล่ (บริการล้วน)"}
                          </span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted">
                            ค่าแรงติดตั้งประเมิน ({item.installHours} ชม.):
                          </span>
                          <span className="font-semibold text-foreground">
                            {formatTHB(item.laborPrice)}
                          </span>
                        </div>
                        <div className="mt-1.5 flex justify-between border-t border-border pt-1.5 text-sm font-bold">
                          <span className="text-foreground">
                            รวมพร้อมติดตั้ง:
                          </span>
                          <span className="text-primary">
                            {formatTHB(item.partPrice + item.laborPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-muted tabular-nums">
                        <span>
                          รับประกัน ERP: {item.warrantyMonths} เดือน /{" "}
                          {item.warrantyKm.toLocaleString("th-TH")} กม.
                        </span>
                      </div>

                      <div className="mt-4 pt-2">
                        {isSelected ? (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="w-full rounded-full border border-primary bg-primary/15 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                          >
                            อยู่ในรายการจองคิวแล้ว (คลิกเพื่อนำออก)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addItem(item, true)}
                            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                          >
                            + เลือกใส่รายการจองคิวติดตั้ง
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
