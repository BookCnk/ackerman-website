import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import BookingCheckout from "@/components/booking/BookingCheckout";

export const metadata: Metadata = {
  title: "จองคิวติดตั้ง & ชำระเงินมัดจำ — Ackermann Garage",
  description:
    "ระบบจองคิวช่องซ่อมออนไลน์และชำระเงินมัดจำผ่าน Payment Gateway เชื่อมต่อระบบคลังสินค้าและตารางนัดหมาย Ackermann ERP อัตโนมัติ",
};

export default function BookingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-12 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <span className="inline-block rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-primary">
              Direct ERP Booking & Deposit Gateway
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">
              จองคิวติดตั้ง & โอนมัดจำล็อกสต็อก
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              เมื่อชำระมัดจำสำเร็จ ระบบจะตัดจองอะไหล่ในคลังและสร้างคิวนัดหมายเข้าสู่ตารางช่องซ่อมของ
              Ackermann ERP ทันที
            </p>
            <nav aria-label="breadcrumb" className="mt-4 text-xs text-muted">
              <Link href="/" className="transition hover:text-foreground">
                หน้าแรก
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">จองคิว & โอนมัดจำ</span>
            </nav>
          </div>
        </section>
        <BookingCheckout />
      </main>
      <Footer />
    </>
  );
}

