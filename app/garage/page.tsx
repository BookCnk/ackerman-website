import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import MyGaragePortal from "@/components/garage/MyGaragePortal";

export const metadata: Metadata = {
  title: "รถของฉัน & ติดตามสถานะงานซ่อม (My Garage) — Ackermann Garage",
  description:
    "ตรวจสอบสถานะการจองคิว สถานะอะไหล่ สถานะงานซ่อม 4 ขั้นตอนสดจากระบบ Ackermann ERP และใบรับประกันสินค้าดิจิทัล",
};

export default function GaragePage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-12 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <span className="inline-block rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-primary">
              Customer Portal & Live ERP Tracking
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">
              รถของฉัน & ติดตามงานซ่อม (My Garage)
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              ดูประวัติการจองคิว เช็คสถานะอะไหล่ ติดตามขั้นตอนการติดตั้งสดจากช่องซ่อม
              และตรวจสอบใบรับประกันสินค้าดิจิทัลของคุณ
            </p>
            <nav aria-label="breadcrumb" className="mt-4 text-xs text-muted">
              <Link href="/" className="transition hover:text-foreground">
                หน้าแรก
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">รถของฉัน (My Garage)</span>
            </nav>
          </div>
        </section>
        <MyGaragePortal />
      </main>
      <Footer />
    </>
  );
}

