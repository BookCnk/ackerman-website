import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ShopContent from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "เลือกสินค้า & เช็คราคาพร้อมติดตั้ง — Ackermann Garage",
  description:
    "ค้นหาของแต่งรถตรงรุ่น โช๊คอัพ เบรก ล้อฟอร์จ ท่อไอเสีย และฟิล์มใส PPF เช็คราคาอะไหล่พร้อมค่าแรงติดตั้งและสต็อกจริงจากระบบ Ackermann ERP",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-12 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <span className="inline-block rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-primary">
              Parts & Installation Configurator
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">
              เลือกสินค้า & เช็คราคาพร้อมติดตั้ง
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              ซิงค์ข้อมูลสต็อกจริงจากคลัง Ackermann ERP แสดงราคาอะไหล่ ค่าแรงติดตั้งประเมิน
              และคำนวณเงินมัดจำสำหรับล็อกคิวช่องซ่อมทันที
            </p>
            <nav aria-label="breadcrumb" className="mt-4 text-xs text-muted">
              <Link href="/" className="transition hover:text-foreground">
                หน้าแรก
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">เลือกสินค้า & เช็คราคา</span>
            </nav>
          </div>
        </section>
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
