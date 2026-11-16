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
  getCategoryFallbackImage,
} from "@/lib/mock-erp-data";

const CATEGORY_THAI_MAP: Record<string, string> = {
  Tires: "ยางรถยนต์",
  Wheels: "ล้อแม็กซ์",
  "Shock Absorbers": "โช้คอัพ / ช่วงล่าง",
  "Brakes Calipers": "คาลิปเปอร์เบรก",
  "Brakes Pads": "ผ้าเบรก",
  "Brakes Rotor": "จานเบรก",
  "Brake Oil": "น้ำมันเบรก",
  "Engine Oil": "น้ำมันเครื่อง",
  "Air Filter": "กรองอากาศ",
  "Air Filter Box": "ชุดกรองอากาศ",
  Exhaust: "ท่อไอเสีย",
  "Body Parts": "ชุดแต่งตัวถัง",
  Spoilers: "สปอยเลอร์",
  Batteries: "แบตเตอรี่",
  Springs: "สปริงโหลด",
  Others: "อะไหล่อื่นๆ",
};

function StockBadge({ item }: { item: CatalogItem }) {
  if (item.stockStatus === "IN_STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-medium text-foreground tabular-nums">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        มีของพร้อมส่ง (คงเหลือ {item.stockQty} ชิ้น)
      </span>
    );
  }
  if (item.stockStatus === "PRE_ORDER") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-secondary tabular-nums">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        พรีออเดอร์ ({item.leadTimeDays || 14} วันทำการ)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
      บริการมาตรฐาน
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

  const [liveCategories, setLiveCategories] = useState<
    { id: number; name: string; product_count: number }[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string | null>(null);
  const [stockFilter, setStockFilter] = useState<StockStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("default");

  const [products, setProducts] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(CATALOG_ITEMS.length);
  const [isLoading, setIsLoading] = useState(false);

  // Sync URL query params
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const vParam = params.get("vehicle");
    const cParam = params.get("category");
    const qParam = params.get("q");

    if (vParam) setSelectedVehicleId(vParam);
    if (cParam) setSelectedCategoryId(cParam);
    if (qParam !== null) setSearchQuery(qParam);
  }, [setSelectedVehicleId]);

  // Real-time fetch from ERP Bridge API
  useEffect(() => {
    setIsLoading(true);
    const q = new URLSearchParams();
    q.set("page", page.toString());
    q.set("limit", "24");
    if (selectedCategoryId) q.set("category_id", selectedCategoryId.toString());
    if (searchQuery.trim()) q.set("search", searchQuery.trim());
    if (selectedVehicleId && selectedVehicleId !== "ALL") q.set("vehicleId", selectedVehicleId);

    fetch(`/api/v1/inventory/availability?${q.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setLiveCategories(data.categories);
          }
          if (Array.isArray(data.items)) {
            setProducts(data.items);
          }
          if (data.total !== undefined) setTotalCount(data.total);
          if (data.totalPages !== undefined) setTotalPages(data.totalPages);
        }
      })
      .catch(() => {
        // Fallback to local CATALOG_ITEMS
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, selectedCategoryId, searchQuery, selectedVehicleId]);

  const currentVehicle = VEHICLES.find((v) => v.id === selectedVehicleId);
  const summary = calculateDeposit(selectedItems);

  const displayedProducts = useMemo(() => {
    let items = [...products];
    if (stockFilter !== "ALL") {
      items = items.filter((i) => i.stockStatus === stockFilter);
    }
    const totalCost = (i: CatalogItem) => i.partPrice + i.laborPrice;
    if (sort === "price-asc") items.sort((a, b) => totalCost(a) - totalCost(b));
    if (sort === "price-desc") items.sort((a, b) => totalCost(b) - totalCost(a));
    return items;
  }, [products, stockFilter, sort]);

  const totalCatalogCount = liveCategories.reduce((acc, c) => acc + c.product_count, 0) || totalCount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Vehicle Fitment Selector Bar */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              ERP Real-Time Inventory & Fitment (คลังสินค้าสดจากระบบ ERP)
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold">
              {currentVehicle
                ? `กำลังแสดงสินค้าสำหรับ: ${currentVehicle.label}`
                : `แสดงแคตตาล็อกอะไหล่สดจาก ERP (${totalCatalogCount.toLocaleString("th-TH")} รายการ)`}
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            <select
              aria-label="เลือกรุ่นรถของคุณ"
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                setPage(1);
              }}
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
              placeholder="ค้นหาชื่ออะไหล่, แบรนด์ (Michelin, Motul, Brembo) หรือ SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Sidebar Filters */}
        <aside className="flex flex-col gap-6 lg:col-span-3">
          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold">
                หมวดหมู่สินค้า ERP (Categories)
              </h3>
              <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                {liveCategories.length || 16} หมวด
              </span>
            </div>

            <ul className="mt-3 flex max-h-[460px] flex-col gap-1.5 overflow-y-auto pr-1 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setPage(1);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                    selectedCategoryId === null
                      ? "bg-primary font-semibold text-white"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  <span>ทุกหมวดหมู่ (All Categories)</span>
                  <span className="tabular-nums font-mono opacity-80">
                    {totalCatalogCount.toLocaleString("th-TH")}
                  </span>
                </button>
              </li>

              {liveCategories.map((c) => {
                const thaiName = CATEGORY_THAI_MAP[c.name] || c.name;
                const isSelected = selectedCategoryId === c.id || selectedCategoryId === c.name;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(isSelected ? null : c.id);
                        setPage(1);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                        isSelected
                          ? "bg-primary font-semibold text-white"
                          : "text-muted hover:bg-background hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">
                        {c.name} ({thaiName})
                      </span>
                      <span className="tabular-nums font-mono opacity-80">
                        {c.product_count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-heading text-base font-semibold">
              สถานะสินค้าคงคลัง (Stock Status)
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-xs">
              {[
                { value: "ALL", label: "ทั้งหมด (มีสต็อก + พรีออเดอร์)" },
                { value: "IN_STOCK", label: "มีของพร้อมส่ง/ติดตั้ง (In Stock)" },
                { value: "PRE_ORDER", label: "สินค้าพรีออเดอร์สั่งเบิก (Pre-Order)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStockFilter(opt.value as StockStatus | "ALL")}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    stockFilter === opt.value
                      ? "border border-primary bg-background font-semibold text-primary"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Quick Quotation Summary Box */}
          <section className="sticky top-28 rounded-xl border border-primary/50 bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold">
                ตะกร้าจองคิว ({selectedItems.length})
              </h3>
              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                ERP Live
              </span>
            </div>

            {selectedItems.length === 0 ? (
              <p className="mt-3 text-xs text-muted">
                คลิกปุ่ม &quot;+ เลือกใส่รายการจองคิวติดตั้ง&quot; ที่สินค้าด้านขวาเพื่อเริ่มประเมินราคา
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="space-y-1 text-xs tabular-nums">
                  <div className="flex justify-between text-muted">
                    <span>รวมค่าอะไหล่:</span>
                    <span className="font-semibold text-foreground">
                      {formatTHB(summary.partsTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>รวมค่าแรงประเมิน:</span>
                    <span className="font-semibold text-foreground">
                      {formatTHB(summary.laborTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                    <span>ยอดประเมินรวม:</span>
                    <span className="text-foreground">
                      {formatTHB(summary.grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/40 bg-background p-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-primary tabular-nums">
                    <span>ยอดโอนมัดจำ:</span>
                    <span className="text-sm">
                      {formatTHB(summary.depositAmount)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">
                    {summary.depositRuleText}
                  </p>
                </div>

                <Link
                  href="/booking"
                  className="block w-full rounded-full bg-primary py-2.5 text-center text-xs font-semibold text-white transition hover:bg-primary-hover"
                >
                  ไปหน้าเลือกวันเวลา & โอนมัดจำ →
                </Link>
              </div>
            )}
          </section>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <p className="text-sm text-muted">
              พบสินค้าทั้งหมด{" "}
              <span className="font-bold text-foreground tabular-nums font-mono">
                {displayedProducts.length}
              </span>{" "}
              รายการในหน้านี้ (จากทั้งหมด {totalCount.toLocaleString("th-TH")} รายการ)
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">เรียงตาม:</span>
              <select
                aria-label="เรียงลำดับสินค้า"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="default">มาตรฐาน (ความนิยม / ลำดับ ERP)</option>
                <option value="price-asc">ราคา: ต่ำไปสูง</option>
                <option value="price-desc">ราคา: สูงไปต่ำ</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-12 flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted">กำลังดึงข้อมูลแคตตาล็อกสดจาก Ackermann ERP...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-base font-semibold">ไม่พบสินค้าในเงื่อนไขที่เลือก</p>
              <p className="mt-1 text-xs text-muted">
                ลองค้นหาด้วยคำอื่น หรือกดล้างตัวกรองหมวดหมู่
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSearchQuery("");
                  setStockFilter("ALL");
                  setPage(1);
                }}
                className="mt-4 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayedProducts.map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                const displayImage = item.image || getCategoryFallbackImage(item.category);

                return (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary"
                  >
                    <div>
                      <Link
                        href={`/shop/${encodeURIComponent(item.id)}`}
                        className="group relative block aspect-4/3 w-full bg-background overflow-hidden cursor-pointer"
                      >
                        <Image
                          src={displayImage}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute top-3 left-3">
                          <StockBadge item={item} />
                        </div>
                        <div className="absolute right-3 bottom-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-secondary backdrop-blur tabular-nums">
                          SKU: {item.sku}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-3 opacity-0 transition group-hover:opacity-100 flex items-center justify-center">
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                            ดูรายละเอียด & ภาพติดตั้งจริง →
                          </span>
                        </div>
                      </Link>

                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span className="font-semibold text-primary uppercase">
                            {item.brand}
                          </span>
                          <span className="text-muted">
                            {CATEGORY_THAI_MAP[item.category] || item.category}
                          </span>
                        </div>

                        <Link
                          href={`/shop/${encodeURIComponent(item.id)}`}
                          className="mt-2 block hover:text-primary transition"
                        >
                          <h3 className="font-heading text-base font-bold text-foreground line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>

                        {/* Specs & Detailed Attributes from ERP */}
                        {item.specs && item.specs.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-xs text-muted">
                            {item.specs.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                <span className="leading-snug">{s}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Single All-Inclusive Price Tag */}
                        <div className="mt-4 rounded-xl border border-border/80 bg-background/80 p-3.5 text-center">
                          <span className="text-[11px] text-muted block mb-0.5">
                            ราคาพิเศษ (พร้อมบริการติดตั้ง)
                          </span>
                          <div className="text-2xl font-extrabold text-primary tabular-nums tracking-tight">
                            {formatTHB(item.partPrice + item.laborPrice)}
                          </div>
                          <p className="mt-1 text-[11px] font-medium text-emerald-400">
                            ✓ ราคารวมติดตั้งเรียบร้อยแล้ว
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted tabular-nums">
                          <span>
                            รับประกัน ERP: {item.warrantyMonths} เดือน /{" "}
                            {item.warrantyKm?.toLocaleString("th-TH")} กม.
                          </span>
                          <span className="font-mono text-secondary">
                            {item.stockQty > 0 ? `สต็อก: ${item.stockQty}` : "สั่งเบิกศูนย์"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="w-full rounded-full border border-primary bg-primary/15 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          ✓ อยู่ในตะกร้าจองแล้ว (คลิกเพื่อนำออก)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addItem(item, true)}
                          className="w-full rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
                        >
                          + เลือกใส่รายการจองคิวติดตั้ง
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-6">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary disabled:opacity-40"
              >
                ← หน้าก่อนหน้า
              </button>

              <span className="px-3 text-xs text-muted tabular-nums font-mono">
                หน้า <span className="font-bold text-foreground">{page}</span> จาก {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary disabled:opacity-40"
              >
                หน้าถัดไป →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
