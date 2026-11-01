"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SectionHeading from "./SectionHeading";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  SHOWCASE_BUILDS,
  calculateDeposit,
  formatTHB,
} from "@/lib/mock-erp-data";

export default function FeaturedBuilds() {
  const router = useRouter();
  const { loadBuildPreset, setInspectedBuildId, setIsCartDrawerOpen } =
    useBooking();

  return (
    <section id="featured-builds" className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="IND × Urban Portfolio Showcase"
          title="ผลงานแต่งรถระดับเรือธง พร้อมดึงสเปกจองคิว"
          description="เลือกชมผลงานการเซ็ตอัพจากรถลูกค้าจริง กดเปิดดูสเปกเจาะลึกแบบสไลด์ด้านข้าง (Slide-Over Spec) หรือกดจองชุดแต่งตามคันที่ชอบได้ทันที"
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {SHOWCASE_BUILDS.map((build) => {
            const parts = build.partIds
              .map((id) => CATALOG_ITEMS.find((i) => i.id === id))
              .filter((i): i is NonNullable<typeof i> => Boolean(i));
            const calc = calculateDeposit(parts);

            return (
              <article
                key={build.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary"
              >
                <div className="relative h-56 w-full overflow-hidden bg-background">
                  <Image
                    src={build.heroImage}
                    alt={build.title}
                    width={640}
                    height={420}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    {build.categoryTag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-medium text-muted tabular-nums">
                      ส่งมอบเมื่อ {build.completedDate} • {build.ownerHandle}
                    </p>
                    <h3 className="mt-1.5 font-heading text-xl font-bold leading-snug text-foreground">
                      {build.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted">
                      {build.summary}
                    </p>

                    <div className="mt-4 space-y-1.5 rounded-xl border border-border bg-background p-3 text-xs">
                      <p className="font-semibold text-secondary">
                        สเปกหลักในคันนี้ ({parts.length} รายการ):
                      </p>
                      <p className="text-muted">
                        • ช่วงล่าง: {build.stanceSpecs.suspension}
                      </p>
                      <p className="text-muted">
                        • เบรก: {build.stanceSpecs.brakes}
                      </p>
                      <p className="text-muted">
                        • ล้อ/ท่อ: {build.stanceSpecs.exhaustOrAero}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <div className="flex items-baseline justify-between tabular-nums">
                      <span className="text-xs text-muted">
                        งบประเมินทั้งเซ็ต:
                      </span>
                      <span className="font-heading text-xl font-bold text-primary">
                        {formatTHB(calc.grandTotal)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-right text-[11px] text-muted tabular-nums">
                      มัดจำล็อกคิวเพียง {formatTHB(calc.depositAmount)}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          loadBuildPreset(build.vehicleId, build.partIds);
                          router.push("/booking");
                        }}
                        className="rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
                      >
                        จองชุดแต่งตามคันนี้
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          setInspectedBuildId(build.id);
                        }}
                        className="rounded-full border border-border bg-background px-4 py-2.5 text-center text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
                      >
                        เปิดสไลด์ดูสเปก
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
