import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ShopContent from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "ร้านค้า — Ackermann Garage",
  description:
    "เลือกซื้อผลิตภัณฑ์ดูแลรถคุณภาพสูง แชมพูล้างรถ เคลือบเซรามิก น้ำยาทำความสะอาดภายใน และอื่น ๆ จาก Ackermann Garage",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-14 text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">ร้านค้า</h1>
          <nav aria-label="breadcrumb" className="mt-4 text-sm text-muted">
            <Link href="/" className="transition hover:text-foreground">
              หน้าแรก
            </Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">ร้านค้า</span>
          </nav>
        </section>
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
