"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useBooking } from "@/components/booking/BookingContext";
import {
  CATALOG_ITEMS,
  ErpBookingRecord,
  VEHICLES,
  calculateDeposit,
  formatTHB,
} from "@/lib/mock-erp-data";

const TIME_SLOTS = [
  "09:00 - 10:30 น. (ช่วงเช้า)",
  "10:30 - 12:00 น. (ช่วงสาย)",
  "13:00 - 14:30 น. (ช่วงบ่ายต้น)",
  "14:30 - 16:00 น. (ช่วงบ่ายแก่)",
  "16:00 - 17:30 น. (ช่วงเย็น)",
];

type WebhookResult = {
  ok: boolean;
  deliveredToLiveErp?: boolean;
  syncStatus?: "DEPOSIT_PAID_ERP_SYNCED" | "PENDING_ERP_SYNC";
  event: string;
  erpEndpoint: string;
  httpStatus?: number;
  trackingUrl?: string;
  booking: ErpBookingRecord;
  erpSyncActions: {
    module: string;
    action: string;
    badge: string;
  }[];
};

export default function BookingCheckout() {
  const {
    selectedVehicleId,
    setSelectedVehicleId,
    selectedItems,
    addItem,
    removeItem,
    addBookingRecord,
  } = useBooking();

  const summary = calculateDeposit(selectedItems);

  const minDateString = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + Math.max(1, summary.maxLeadTimeDays));
    return d.toISOString().split("T")[0];
  }, [summary.maxLeadTimeDays]);

  const [customerName, setCustomerName] = useState("ธนภัทร อัครเดช");
  const [customerPhone, setCustomerPhone] = useState("089-456-7890");
  const [licensePlate, setLicensePlate] = useState("3ขฬ 9911 กรุงเทพมหานคร");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentSlot, setAppointmentSlot] = useState(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<
    "PROMPTPAY_QR" | "CREDIT_CARD"
  >("PROMPTPAY_QR");
  const [submitting, setSubmitting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<WebhookResult | null>(
    null
  );

  const effectiveDate = appointmentDate || minDateString;

  const selectedVehicleLabel =
    VEHICLES.find((v) => v.id === selectedVehicleId)?.label ??
    "2024 BMW 3 Series (G20) 330e M Sport";

  const handleSimulateGatewayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/erp/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          licensePlate,
          vehicleLabel: selectedVehicleLabel,
          appointmentDate: effectiveDate,
          appointmentSlot,
          paymentMethod,
          items: selectedItems.map((i) => ({
            sku: i.sku,
            name: i.name,
            partPrice: i.partPrice,
            laborPrice: i.laborPrice,
            stockStatus: i.stockStatus,
          })),
          partsTotal: summary.partsTotal,
          laborTotal: summary.laborTotal,
          grandTotal: summary.grandTotal,
          depositPaid: summary.depositAmount,
          remainingBalance: summary.remainingBalance,
        }),
      });
      const data = (await res.json()) as WebhookResult;
      if (data.ok) {
        addBookingRecord(data.booking);
        setWebhookResult(data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (webhookResult) {
    const b = webhookResult.booking;
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary bg-surface p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
            <div>
              {webhookResult.deliveredToLiveErp ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  ชำระเงินมัดจำสำเร็จ & ซิงค์เข้าสู่ระบบ Ackermann ERP เรียบร้อยแล้ว (Live 200 OK)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  ชำระเงินมัดจำสำเร็จ & บันทึกเข้า Storefront Outbox แล้ว (สถานะ PENDING_ERP_SYNC — พร้อมส่งเข้า ERP ทันที)
                </span>
              )}
              <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl tabular-nums">
                ใบยืนยันการจองคิวติดตั้ง #{b.bookingNo}
              </h2>
              <p className="mt-1 text-xs text-muted tabular-nums">
                เวลาทำรายการ: {b.createdAt} • Payment Gateway Ref:{" "}
                {b.paymentGatewayRef}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/track/${b.bookingNo}`}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                เปิดใบรับรอง QR สำหรับยื่นหน้าร้าน
              </Link>
              <Link
                href="/garage"
                className="rounded-full border border-primary bg-background px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                ดูใน My Garage
              </Link>
              <button
                type="button"
                onClick={() => setWebhookResult(null)}
                className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary"
              >
                จองคิวเพิ่ม
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="space-y-4 rounded-xl border border-border bg-background p-5 lg:col-span-6">
              <h3 className="font-heading text-lg font-bold">
                ข้อมูลนัดหมายและรถยนต์ (Customer Booking Slip)
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-xs tabular-nums">
                <div>
                  <dt className="text-muted">ชื่อลูกค้า:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {b.customerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">เบอร์โทรศัพท์:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {b.customerPhone}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">เลขทะเบียนรถ:</dt>
                  <dd className="mt-0.5 font-semibold text-primary">
                    {b.licensePlate}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">รุ่นรถยนต์:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {b.vehicleLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">วันที่นัดเข้าติดตั้ง:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {b.appointmentDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">ช่วงเวลานัดหมายเข้ารับบริการ:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {b.appointmentSlot}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-border pt-3">
                <p className="text-xs font-semibold text-muted">
                  ป้ายสถานะอะไหล่ในปฏิทิน ERP (Parts Readiness Badge):
                </p>
                <span className="mt-1.5 inline-block rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground">
                  {b.partsReadiness}
                </span>
              </div>

              <div className="space-y-1.5 border-t border-border pt-3 text-xs tabular-nums">
                <div className="flex justify-between text-muted">
                  <span>ยอดประเมินรวม (อะไหล่ + ค่าแรง):</span>
                  <span className="text-foreground">
                    {formatTHB(b.grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-primary">
                  <span>ชำระเงินมัดจำแล้ว ({b.paymentMethod}):</span>
                  <span>-{formatTHB(b.depositPaid)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>ยอดคงเหลือชำระที่หน้าเคาน์เตอร์ POS วันรับรถ:</span>
                  <span>{formatTHB(b.remainingBalance)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-background p-5 lg:col-span-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  การทำงานอัตโนมัติในระบบหลังร้าน (ERP Webhook Actions)
                </h3>
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  200 OK
                </span>
              </div>
              <p className="text-xs text-muted">
                เมื่อ Payment Gateway ยืนยันยอดมัดจำ ระบบได้ยิง Webhook ไปยัง{" "}
                <code className="text-secondary">{webhookResult.erpEndpoint}</code>{" "}
                และดำเนินการดังนี้:
              </p>

              <ul className="space-y-2.5 text-xs">
                {webhookResult.erpSyncActions.map((act, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg border border-border bg-surface p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        {idx + 1}. {act.module}
                      </span>
                      <span className="rounded border border-border px-2 py-0.5 text-[10px] text-secondary">
                        {act.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-muted">{act.action}</p>
                  </li>
                ))}
              </ul>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold text-muted">
                  ตัวอย่าง JSON Payload ที่ส่งเข้า Ackermann ERP:
                </p>
                <pre className="max-h-44 overflow-x-auto overflow-y-auto rounded-lg border border-border bg-surface p-3 text-[11px] text-secondary tabular-nums">
                  {JSON.stringify(webhookResult.booking, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-bold">
                1. รายการสินค้าและบริการที่เลือกจอง ({selectedItems.length} รายการ)
              </h2>
              <Link
                href="/shop"
                className="text-xs font-semibold text-primary transition hover:underline"
              >
                + เลือกสินค้าเพิ่มในหน้าแคตตาล็อก
              </Link>
            </div>

            {selectedItems.length === 0 ? (
              <div className="mt-4 rounded-xl border border-border bg-background p-6 text-center">
                <p className="text-sm text-muted">
                  ยังไม่มีสินค้าหรือบริการในตะกร้าจองคิว
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {CATALOG_ITEMS.slice(0, 3).map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => addItem(sample)}
                      className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary"
                    >
                      + เพิ่ม {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-background">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {item.name}
                        </span>
                        <span className="rounded border border-border px-2 py-0.5 text-[11px] text-muted tabular-nums">
                          {item.stockStatus === "IN_STOCK"
                            ? "อะไหล่พร้อมติด (Parts Ready)"
                            : item.stockStatus === "PRE_ORDER"
                            ? `พรีออเดอร์รอของ ${item.leadTimeDays} วัน`
                            : "บริการมาตรฐาน"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted tabular-nums">
                        SKU: {item.sku} • ค่าของ {formatTHB(item.partPrice)} +
                        ค่าแรงประเมิน {formatTHB(item.laborPrice)} (
                        {item.installHours} ชม.)
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="font-heading text-base font-bold text-foreground tabular-nums">
                        {formatTHB(item.partPrice + item.laborPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition hover:border-primary hover:text-primary"
                      >
                        ลบออก
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            id="booking-form"
            onSubmit={handleSimulateGatewayPayment}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="font-heading text-xl font-bold">
              2. ข้อมูลรถยนต์และเลือกวันเวลาเข้ารับบริการ (Service Schedule)
            </h2>

            {summary.maxLeadTimeDays > 0 && (
              <div className="mt-4 rounded-xl border border-primary/50 bg-background p-4 text-xs text-secondary">
                <strong className="text-primary">
                  แจ้งเตือนระบบซิงค์สต็อก ERP (Inbound PO Protection):
                </strong>{" "}
                เนื่องจากในรายการของคุณมีสินค้าพรีออเดอร์ที่ใช้เวลาเบิก{" "}
                <span className="font-bold tabular-nums">
                  {summary.maxLeadTimeDays} วันทำการ
                </span>{" "}
                ระบบจึงล็อกวันนัดหมายขั้นต่ำเป็นตั้งแต่วันที่{" "}
                <span className="font-bold tabular-nums">{minDateString}</span>{" "}
                เพื่อให้มั่นใจว่าอะไหล่ส่งถึงอู่ทันวันนัดติดตั้ง
              </div>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted">
                  รุ่นรถยนต์ที่เข้ารับบริการ (Vehicle Model)
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted">
                  เลขทะเบียนรถ (สำหรับเปิดใบงานใน ERP)
                </label>
                <input
                  type="text"
                  required
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="เช่น 3ขฬ 9911 กรุงเทพมหานคร"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted">
                  ชื่อ-นามสกุล ลูกค้า
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground tabular-nums focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted">
                  วันที่ต้องการนัดหมายเข้ารับบริการ
                </label>
                <input
                  type="date"
                  required
                  min={minDateString}
                  value={effectiveDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground tabular-nums focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted">
                  ช่วงเวลาเข้ารับบริการ (Service Time Slot)
                </label>
                <select
                  value={appointmentSlot}
                  onChange={(e) => setAppointmentSlot(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-primary/50 bg-surface p-6">
            <h2 className="font-heading text-xl font-bold">
              3. สรุปยอดประเมิน & ชำระเงินมัดจำ (Payment Gateway)
            </h2>
            <p className="mt-1 text-xs text-muted">
              ชำระผ่าน Payment Gateway อัตโนมัติ เมื่อชำระสำเร็จระบบจะยิง Webhook
              สร้างใบจองคิวและล็อกสต็อกใน Ackermann ERP ทันที
            </p>

            <div className="mt-5 space-y-2 rounded-xl border border-border bg-background p-4 text-xs tabular-nums">
              <div className="flex justify-between">
                <span className="text-muted">รวมค่าอะไหล่ (Parts Subtotal):</span>
                <span className="font-semibold text-foreground">
                  {formatTHB(summary.partsTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">
                  รวมค่าแรงติดตั้งประเมิน (Est. Labor):
                </span>
                <span className="font-semibold text-foreground">
                  {formatTHB(summary.laborTotal)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                <span className="text-foreground">ยอดประเมินรวมทั้งสิ้น:</span>
                <span className="text-foreground">
                  {formatTHB(summary.grandTotal)}
                </span>
              </div>

              <div className="mt-3 rounded-lg border border-primary bg-surface p-3">
                <div className="flex items-center justify-between text-base font-bold text-primary">
                  <span>ยอดโอนมัดจำวันนี้:</span>
                  <span>{formatTHB(summary.depositAmount)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  {summary.depositRuleText}
                </p>
              </div>

              <div className="flex justify-between pt-2 text-xs text-muted">
                <span>ยอดคงเหลือชำระวันรับรถ (POS):</span>
                <span className="font-semibold text-foreground">
                  {formatTHB(summary.remainingBalance)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-muted">
                เลือกช่องทางชำระเงินมัดจำ (Omise / Stripe Payment Gateway):
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PROMPTPAY_QR")}
                  className={`rounded-xl border p-3 text-left transition ${
                    paymentMethod === "PROMPTPAY_QR"
                      ? "border-primary bg-background font-semibold text-foreground"
                      : "border-border bg-background/50 text-muted hover:text-foreground"
                  }`}
                >
                  <span className="block text-primary">QR PromptPay</span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    สแกนจ่ายยืนยันยอดอัตโนมัติทันที
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={`rounded-xl border p-3 text-left transition ${
                    paymentMethod === "CREDIT_CARD"
                      ? "border-primary bg-background font-semibold text-foreground"
                      : "border-border bg-background/50 text-muted hover:text-foreground"
                  }`}
                >
                  <span className="block text-primary">บัตรเครดิต / เดบิต</span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    Visa / Mastercard / JCB
                  </span>
                </button>
              </div>
            </div>

            {paymentMethod === "PROMPTPAY_QR" ? (
              <div className="mt-4 rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs font-semibold text-foreground">
                  Dynamic PromptPay QR (ผูกยอดมัดจำอัตโนมัติ)
                </p>
                <div className="mx-auto my-3 flex h-36 w-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-3">
                  <svg
                    className="h-16 w-16 text-primary"
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
                  <span className="mt-1 text-[11px] font-bold text-foreground tabular-nums">
                    {formatTHB(summary.depositAmount)}
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-muted">
                  ไม่ต้องแนบสลิป ระบบตรวจจับยอดโอนผ่าน Payment Gateway Webhook อัตโนมัติ
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5 rounded-xl border border-border bg-background p-4 text-xs">
                <input
                  type="text"
                  defaultValue="4532 •••• •••• 8891"
                  aria-label="หมายเลขบัตรเครดิต"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground tabular-nums"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    defaultValue="08/29"
                    aria-label="วันหมดอายุบัตร"
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground tabular-nums"
                  />
                  <input
                    type="text"
                    defaultValue="992"
                    aria-label="รหัส CVV"
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-foreground tabular-nums"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              form="booking-form"
              disabled={submitting || selectedItems.length === 0}
              className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 tabular-nums"
            >
              {submitting
                ? "กำลังส่ง Webhook เข้าสู่ระบบ Ackermann ERP..."
                : `ชำระมัดจำ ${formatTHB(summary.depositAmount)} & ส่งเข้า ERP ทันที`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
