"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeading from "./SectionHeading";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  IND_BRANDS,
  IND_CATEGORIES,
  VEHICLES,
  formatTHB,
} from "@/lib/mock-erp-data";

export function ShopByCategoryAndVehicleSection() {
  const router = useRouter();
  const { selectedVehicleId, setSelectedVehicleId } = useBooking();

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: IND Distribution 8 Shop by Category Tiles */}
        <SectionHeading
          subtitle="IND Distribution Data Architecture — Shop by Category"
          title="ค้นหาของแต่งตามหมวดหมู่ชิ้นส่วน"
          description="เลือกหมวดชิ้นส่วนที่ต้องการ เพื่อเข้าถึงอะไหล่แท้ตรงรุ่น พร้อมเช็คสถานะสต็อกในคลัง ERP และคำนวณเงินมัดจำทันที"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {IND_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                router.push(
                  `/shop?category=${encodeURIComponent(cat.enTitle)}`
                )
              }
              className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-border bg-surface p-5 text-left transition hover:border-primary"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="relative z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {cat.enTitle}
                </span>
                <h3 className="mt-1 font-heading text-xl font-bold text-white group-hover:text-primary">
                  {cat.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-neutral-300">
                  {cat.desc}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2.5 text-xs tabular-nums">
                  <span className="text-neutral-400">
                    เริ่มต้น {formatTHB(cat.startPrice)}
                  </span>
                  <span className="font-semibold text-primary">
                    เลือกดูหมวดนี้ →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Part 2: IND Distribution Chassis Code Fitment Selector */}
        <div className="mt-20 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                IND Style Fitment Matrix
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                เลือกรหัสตัวถัง (Chassis Code) เพื่อกรองของแต่งตรงรุ่น 100%
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-primary hover:underline"
            >
              ดูของแต่งทุกรุ่นรถทั้งหมด →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VEHICLES.map((v) => {
              const count = CATALOG_ITEMS.filter(
                (i) =>
                  i.compatibleVehicles.includes("ALL") ||
                  i.compatibleVehicles.includes(v.id)
              ).length;
              const isSelected = selectedVehicleId === v.id;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVehicleId(v.id);
                    router.push(`/shop?vehicle=${encodeURIComponent(v.id)}`);
                  }}
                  className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-background"
                      : "border-border bg-background/60 hover:border-primary"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs tabular-nums">
                      <span className="font-bold text-primary">{v.make}</span>
                      <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                        {v.chassisCode}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-heading text-base font-bold text-foreground group-hover:text-primary">
                      {v.model}
                    </h3>
                    <p className="text-xs text-muted">{v.submodel}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-2 text-[11px] tabular-nums">
                    <span className="text-secondary">{count} รายการตรงรุ่น</span>
                    <span className="font-semibold text-primary">เลือก →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Part 3: IND Distribution 12 Brands We Distribute */}
        <div className="mt-20">
          <SectionHeading
            subtitle="Authorised Brand Distribution"
            title="แบรนด์ระดับโลกที่เรานำเข้าและจัดจำหน่ายอย่างเป็นทางการ"
            description="พาร์ทเนอร์อย่างเป็นทางการของ IND Distribution สหรัฐอเมริกา พร้อมใบรับประกันตรงจากผู้ผลิตและคลัง ERP ตรวจสอบย้อนหลังได้"
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {IND_BRANDS.map((brand) => (
              <div
                key={brand.id}
                className="group flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-4 text-center transition hover:border-primary"
              >
                <div className="relative h-20 w-full overflow-hidden rounded-lg bg-black/40">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="mt-3 font-heading text-sm font-bold text-foreground group-hover:text-primary">
                  {brand.name}
                </h4>
                <p className="text-[11px] text-muted">{brand.specialty}</p>
                <span className="mt-1 text-[10px] uppercase tracking-wider text-primary">
                  {brand.country}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PopularCatalogSection() {
  const { selectedItems, addItem, removeItem } = useBooking();

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Direct ERP Catalog & Pricing"
          title="สินค้าและแพ็กเกจยอดนิยม พร้อมราคาติดตั้ง"
          description="แสดงราคาอะไหล่คู่กับค่าแรงติดตั้งประเมินและสถานะสต็อกจาก ERP กดเลือกใส่รายการจองเพื่อคำนวณเงินมัดจำ 25% ได้ทันที"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATALOG_ITEMS.slice(0, 4).map((item) => {
            const isSelected = selectedItems.some((i) => i.id === item.id);
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={480}
                      height={320}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary backdrop-blur tabular-nums">
                      {item.stockStatus === "IN_STOCK"
                        ? `พร้อมติด (${item.stockQty} ชุด)`
                        : `พรีออเดอร์ ${item.leadTimeDays} วัน`}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-[11px] font-semibold text-primary">
                      {item.brand} • {item.category}
                    </p>
                    <h3 className="mt-1 font-heading text-base font-bold leading-snug text-foreground">
                      {item.name}
                    </h3>

                    <div className="mt-3 space-y-1 border-t border-border pt-2.5 text-xs tabular-nums">
                      <div className="flex justify-between text-muted">
                        <span>ค่าอะไหล่:</span>
                        <span className="text-foreground">
                          {formatTHB(item.partPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted">
                        <span>ค่าแรง ({item.installHours} ชม.):</span>
                        <span className="text-foreground">
                          {formatTHB(item.laborPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 font-bold text-primary">
                        <span>รวมพร้อมติด:</span>
                        <span>
                          {formatTHB(item.partPrice + item.laborPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {isSelected ? (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="w-full rounded-full border border-primary bg-primary/15 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      อยู่ในตะกร้าจองแล้ว (นำออก)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addItem(item, true)}
                      className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
                    >
                      + เลือกใส่รายการจองคิว
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-primary px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            ดูแคตตาล็อกของแต่งและเช็คราคาทั้งหมด ({CATALOG_ITEMS.length} รายการ) →
          </Link>
        </div>
      </div>
    </section>
  );
}
