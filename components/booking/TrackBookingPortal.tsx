"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBooking } from "@/components/booking/BookingContext";
import { INITIAL_ERP_BOOKINGS, formatTHB, ErpBookingRecord } from "@/lib/mock-erp-data";

const REPAIR_STAGES = [
  {
    step: 1,
    th: "รับรถเข้าอู่",
    en: "Vehicle Received",
    desc: "ตรวจรับรถ บันทึกเลขไมล์และสภาพรถเบื้องต้นเข้าสู่ระบบ ERP",
  },
  {
    step: 2,
    th: "อยู่ระหว่างซ่อมบำรุง",
    en: "Work in Progress",
    desc: "ช่างผู้เชี่ยวชาญกำลังดำเนินการติดตั้งอะไหล่และเซ็ตติ้งในช่องซ่อม",
  },
  {
    step: 3,
    th: "ตรวจเช็คคุณภาพและล้างรถ",
    en: "Quality Control & Wash",
    desc: "หัวหน้าช่างตรวจสอบมาตรฐานความปลอดภัย ตั้งศูนย์ และทำความสะอาดรถ",
  },
  {
    step: 4,
    th: "รถพร้อมส่งมอบ",
    en: "Ready for Pickup",
    desc: "ดำเนินการเสร็จสมบูรณ์ พร้อมรับรถและชำระยอดคงเหลือที่หน้าเคาน์เตอร์ POS",
  },
] as const;

export default function TrackBookingPortal({
  bookingNo,
}: {
  bookingNo: string;
}) {
  const { bookings } = useBooking();

  const fallbackRecord =
    bookings.find(
      (b) => b.bookingNo.toLowerCase() === bookingNo.toLowerCase()
    ) ?? INITIAL_ERP_BOOKINGS[0];

  const [liveRecord, setLiveRecord] = useState<ErpBookingRecord>(fallbackRecord);

  useEffect(() => {
    fetch(`/api/bookings/${encodeURIComponent(bookingNo)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && data.booking) {
          setLiveRecord(data.booking as ErpBookingRecord);
        }
      })
      .catch(() => {});
  }, [bookingNo]);

  const record = liveRecord;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white tabular-nums">
                #{record.bookingNo}
              </span>
              <span className="rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground">
                {record.partsReadiness}
              </span>
            </div>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl tabular-nums">
              ทะเบียน: {record.licensePlate}
            </h2>
            <p className="mt-1 text-sm text-muted">{record.vehicleLabel}</p>
          </div>

          {/* QR Code for Front-Desk Reception Scan */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-surface">
              <svg
                className="h-11 w-11 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h3M19 14v3" />
              </svg>
            </div>
            <div className="text-xs tabular-nums">
              <p className="font-semibold text-foreground">
                QR สำหรับยื่นหน้าเคาน์เตอร์อู่
              </p>
              <p className="mt-0.5 text-muted">นัดวันที่: {record.appointmentDate}</p>
              <p className="text-primary">{record.bayAssigned}</p>
            </div>
          </div>
        </div>

        {/* Strict Read-Only 4-Step Progress Tracker */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">
              สถานะการดำเนินงาน (4-Step Workshop Progress)
            </h3>
            <span className="text-xs text-muted">
              ซิงค์ข้อมูลอัตโนมัติแบบอ่านอย่างเดียว (Read-Only)
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {REPAIR_STAGES.map((stage) => {
              const isCompleted = record.repairStage > stage.step;
              const isCurrent = record.repairStage === stage.step;

              return (
                <div
                  key={stage.step}
                  className={`rounded-xl border p-4 ${
                    isCurrent
                      ? "border-primary bg-background"
                      : isCompleted
                      ? "border-border bg-background/80"
                      : "border-border bg-background/30 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span className="font-bold text-primary">
                      ขั้นตอนที่ {stage.step}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-secondary">
                      {isCurrent
                        ? "กำลังดำเนินการ"
                        : isCompleted
                        ? "เสร็จสมบูรณ์"
                        : "รอดำเนินการ"}
                    </span>
                  </div>
                  <p className="mt-2 font-heading text-base font-bold text-foreground">
                    {stage.th} ({stage.en})
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointment & Financial Summary */}
        <div className="mt-8 rounded-xl border border-border bg-background p-5">
          <h3 className="font-heading text-base font-bold text-foreground">
            สรุปรายการอะไหล่และยอดมัดจำที่ชำระแล้ว
          </h3>
          <div className="mt-3 divide-y divide-border text-xs tabular-nums">
            {record.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5"
              >
                <div>
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="ml-2 text-muted">({item.sku})</span>
                </div>
                <span className="font-semibold text-foreground">
                  {formatTHB(item.partPrice + item.laborPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs tabular-nums">
            <div className="flex justify-between text-muted">
              <span>ยอดประเมินรวม (อะไหล่ + ค่าแรง):</span>
              <span className="text-foreground">
                {formatTHB(record.grandTotal)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-primary">
              <span>หักเงินมัดจำที่โอนจองแล้ว:</span>
              <span>-{formatTHB(record.depositPaid)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
              <span>ยอดคงเหลือชำระวันรับรถ:</span>
              <span>{formatTHB(record.remainingBalance)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/garage"
            className="rounded-full border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary"
          >
            ← กลับหน้าพอร์ทัลรถของฉัน (My Garage)
          </Link>
          <a
            href="tel:021234567"
            className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover tabular-nums"
          >
            ติดต่อฝ่ายบริการลูกค้า: 02-123-4567
          </a>
        </div>
      </div>
    </div>
  );
}

