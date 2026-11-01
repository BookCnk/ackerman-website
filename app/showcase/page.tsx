import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ShowcaseContent from "@/components/showcase/ShowcaseContent";

export const metadata: Metadata = {
  title: "ผลงานการแต่งรถ (Build Gallery) — Ackermann Garage",
  description:
    "ชมผลงานการอัปเกรดช่วงล่าง เบรก ล้อฟอร์จ ท่อไทเทเนียม และฟิล์มใส PPF จากรถลูกค้าจริง พร้อมกดจองชุดแต่งสเปกเดียวกันเข้าตะกร้าได้ทันที",
};

export default function ShowcasePage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-12 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <span className="inline-block rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-primary">
              Ackermann Build Showcase
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">
              ผลงานร้าน & สเปกแต่งรถ (Build Gallery)
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              ดูรายละเอียดสเปกของแต่งและค่าเซ็ตอัพจริงในแต่ละคัน ชอบสเปกคันไหนกดปุ่ม
              &ldquo;จองชุดแต่งตามคันนี้&rdquo; เพื่อเช็คราคาและนัดวันเข้าติดตั้งได้ทันที
            </p>
            <nav aria-label="breadcrumb" className="mt-4 text-xs text-muted">
              <Link href="/" className="transition hover:text-foreground">
                หน้าแรก
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">ผลงานร้าน (Build Gallery)</span>
            </nav>
          </div>
        </section>
        <ShowcaseContent />
      </main>
      <Footer />
    </>
  );
}

