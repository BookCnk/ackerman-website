import type { Metadata } from "next";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import TrackBookingPortal from "@/components/booking/TrackBookingPortal";

export const metadata: Metadata = {
  title: "ติดตามสถานะการจองคิวและงานซ่อมสด — Ackermann Garage",
  description:
    "หน้าตรวจสอบสถานะอะไหล่และสถานะงานซ่อม 4 ขั้นตอนสดจากระบบ Ackermann Garage ERP",
};

export default async function TrackBookingPage({
  params,
}: {
  params: Promise<{ bookingNo: string }>;
}) {
  const { bookingNo } = await params;

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-surface pt-36 pb-10 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <span className="inline-block rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-primary">
              Safe Read-Only Customer Tracking Portal
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              ใบรับรองการจองคิว & ติดตามสถานะงานซ่อม
            </h1>
            <p className="mt-2 text-xs text-muted sm:text-sm">
              เชื่อมโยงสถานะจริงจากระบบปฏิบัติการอู่ Ackermann Garage ERP
            </p>
          </div>
        </section>
        <TrackBookingPortal bookingNo={decodeURIComponent(bookingNo)} />
      </main>
      <Footer />
    </>
  );
}

