"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CatalogItem,
  formatTHB,
  getSmartProductGallery,
} from "@/lib/mock-erp-data";

function StockBadge({ item }: { item: CatalogItem }) {
  if (item.stockStatus === "IN_STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground tabular-nums">
        <span className="h-2 w-2 rounded-full bg-primary" />
        มีของพร้อมส่ง/ติดตั้ง (คงเหลือ {item.stockQty} ชิ้นในคลัง ERP)
      </span>
    );
  }
  if (item.stockStatus === "PRE_ORDER") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary tabular-nums">
        <span className="h-2 w-2 rounded-full bg-accent" />
        สินค้าพรีออเดอร์สั่งเบิกศูนย์ ({item.leadTimeDays || 14} วันทำการถึงอู่)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted">
      บริการมาตรฐานศูนย์ Ackermann Garage
    </span>
  );
}

export default function ProductDetailClient({ item }: { item: CatalogItem }) {
  const router = useRouter();
  const { selectedItems, addItem, removeItem } = useBooking();

  const isSelected = selectedItems.some((i) => i.id === item.id);
  const gallery =
    item.galleryImages && item.galleryImages.length > 0
      ? item.galleryImages
      : getSmartProductGallery(item.category, item.brand, item.name);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = gallery[activeImageIndex] || item.image;
  const totalPrice = item.partPrice + item.laborPrice;

  const handleBookNow = () => {
    if (!isSelected) {
      addItem(item, true);
    }
    router.push("/booking");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-8 text-xs text-muted">
        <Link href="/" className="transition hover:text-foreground">
          หน้าแรก
        </Link>
        <span className="mx-2">›</span>
        <Link href="/shop" className="transition hover:text-foreground">
          ร้านค้า (Shop)
        </Link>
        <span className="mx-2">›</span>
        <span className="text-secondary">{item.category}</span>
        <span className="mx-2">›</span>
        <span className="text-foreground font-medium truncate inline-block max-w-[200px] align-bottom sm:max-w-none">
          {item.name}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Interactive 3-4 Photo Gallery */}
        <div className="lg:col-span-7">
          <div className="sticky top-28 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-surface">
              <Image
                src={activeImage}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition duration-300"
                priority
                unoptimized
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <StockBadge item={item} />
                {activeImageIndex >= 1 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1 text-xs font-medium text-white shadow backdrop-blur border border-white/10">
                    <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                    ภาพตัวอย่างการติดตั้งในรถจริง (Installed on Vehicle)
                  </span>
                )}
              </div>

              <div className="absolute right-4 bottom-4 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-semibold text-secondary backdrop-blur tabular-nums">
                SKU: {item.sku}
              </div>
            </div>

            {/* Thumbnail Selector (3-4 images) */}
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-4/3 overflow-hidden rounded-xl border transition ${
                    activeImageIndex === idx
                      ? "border-primary ring-2 ring-primary/40 scale-[1.02]"
                      : "border-border opacity-70 hover:opacity-100 hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${item.name} photo ${idx + 1}`}
                    fill
                    sizes="20vw"
                    className="object-cover"
                    unoptimized
                  />
                  {idx >= 1 && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      ในรถ
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Photo Guide Tip */}
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted text-center">
              <svg className="h-3.5 w-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              คลิกดูรูปเพื่อชมทั้งมุมตัวสินค้าและตัวอย่างชิ้นงานจริงขณะประกอบติดตั้งในรถ
            </p>
          </div>
        </div>

        {/* Right Column: Details, Simplified All-Inclusive Price, and CTAs */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-bold text-primary tracking-wider uppercase">
                  {item.brand}
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-secondary">
                  {item.category}
                </span>
              </div>

              <h1 className="mt-3 font-heading text-2xl font-bold leading-tight sm:text-3xl text-foreground">
                {item.name}
              </h1>
            </div>

            {/* Clean All-Inclusive Price Card */}
            <div className="rounded-2xl border border-primary/50 bg-background p-5 text-center">
              <span className="text-xs font-medium text-muted block mb-1">
                ราคาพิเศษ (พร้อมบริการติดตั้งโดยช่างผู้เชี่ยวชาญ)
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums tracking-tight">
                {formatTHB(totalPrice)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span>✓</span>
                <span>ราคารวมติดตั้งเรียบร้อยแล้ว (All-Inclusive)</span>
              </div>
            </div>

            {/* Detailed Attribute Bullet Points from ERP */}
            {item.specs && item.specs.length > 0 && (
              <div className="space-y-3 border-t border-border pt-5">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted">
                  จุดเด่นและคุณสมบัติสินค้า (Specifications)
                </h3>
                <ul className="space-y-2 text-xs text-foreground/90">
                  {item.specs.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specs Grid */}
            <div className="space-y-3 border-t border-border pt-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted">
                ข้อมูลการรับประกันและบริการศูนย์ (Service Details)
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-xs tabular-nums">
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <dt className="text-muted text-[11px]">การรับประกัน ERP:</dt>
                  <dd className="font-bold text-foreground mt-0.5">
                    {item.warrantyMonths} เดือน / {item.warrantyKm?.toLocaleString("th-TH")} กม.
                  </dd>
                </div>

                <div className="rounded-lg border border-border bg-background p-2.5">
                  <dt className="text-muted text-[11px]">ระยะเวลาติดตั้งประเมิน:</dt>
                  <dd className="font-bold text-foreground mt-0.5">
                    {item.installHours || 1} ชั่วโมง
                  </dd>
                </div>

                <div className="rounded-lg border border-border bg-background p-2.5">
                  <dt className="text-muted text-[11px]">สถานะสต็อกใน ERP:</dt>
                  <dd className="font-bold text-primary mt-0.5">
                    {item.stockQty > 0 ? `มีสต็อก ${item.stockQty} ชิ้น` : "สั่งเบิกพิเศษ"}
                  </dd>
                </div>

                <div className="rounded-lg border border-border bg-background p-2.5">
                  <dt className="text-muted text-[11px]">ระบบการจอง:</dt>
                  <dd className="font-bold text-emerald-400 mt-0.5">
                    เชื่อมตรง Private ERP
                  </dd>
                </div>
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-[0.99]"
              >
                จองคิวติดตั้งรายการนี้ทันที (Book Now) →
              </button>

              {isSelected ? (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="w-full rounded-full border border-primary bg-primary/10 py-3 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  ✓ อยู่ในรายการจองคิวแล้ว (คลิกเพื่อนำออก)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => addItem(item, true)}
                  className="w-full rounded-full border border-border bg-background py-3 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
                >
                  + เลือกใส่รายการจองคิวติดตั้ง (Add to Cart)
                </button>
              )}
            </div>

            {/* Link to Inspiration Gallery */}
            <div className="rounded-xl border border-border bg-background p-4 text-center">
              <p className="text-xs text-muted">
                ต้องการดูสไตล์การแต่งของรถคันจริงที่ใส่ชิ้นงานนี้?
              </p>
              <Link
                href="/gallery"
                className="mt-1.5 inline-block text-xs font-bold text-primary hover:underline"
              >
                เปิดชมแกลเลอรีผลงานรถแต่งจริง (Inspiration Gallery) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
