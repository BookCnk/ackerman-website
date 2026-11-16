import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ShowcaseContent from "@/components/showcase/ShowcaseContent";

export const metadata: Metadata = {
  title: "แกลเลอรีผลงานแต่งรถ (Inspiration & Build Gallery) — Ackermann Garage",
  description:
    "ชมผลงานการแต่งรถสุดเท่จากทางร้าน เลือกเป็นแรงบันดาลใจในการแต่งรถ และสามารถกดเลือกแต่งตามสเปกคันจริงได้ทันที",
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-12 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Ackermann Inspiration & Build Gallery
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-5xl">
              แกลเลอรีผลงานแต่งรถ (Gallery)
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">
              ชมผลงานการโมดิฟายรถหรูและรถสปอร์ตระดับมาสเตอร์พีซ เลือกเป็นแรงบันดาลใจ (Inspiration) 
              ชอบสเปกคันไหนสามารถกด &ldquo;จองชุดแต่งตามคันนี้&rdquo; เพื่อดึงรายการอะไหล่เข้าตะกร้าและนัดวันติดตั้งได้ทันที
            </p>
            <nav aria-label="breadcrumb" className="mt-4 text-xs text-muted">
              <Link href="/" className="transition hover:text-foreground">
                หน้าแรก
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">แกลเลอรีผลงาน (Gallery)</span>
            </nav>
          </div>
        </section>
        <ShowcaseContent />
      </main>
      <Footer />
    </>
  );
}
