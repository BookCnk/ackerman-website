"use client";

import { useState } from "react";
import Link from "next/link";
import { useBooking } from "@/components/booking/BookingContext";
import { INITIAL_WARRANTIES, VEHICLES, formatTHB } from "@/lib/mock-erp-data";

const REPAIR_STAGES = [
  { step: 1, th: "รับรถเข้าอู่", en: "Vehicle Received" },
  { step: 2, th: "อยู่ระหว่างซ่อมบำรุง", en: "Work in Progress" },
  { step: 3, th: "ตรวจเช็คคุณภาพและล้างรถ", en: "Quality Control & Wash" },
  { step: 4, th: "รถพร้อมส่งมอบ", en: "Ready for Pickup" },
] as const;

type GarageVehicle = {
  plate: string;
  vehicleId: string;
  model: string;
  vin: string;
  lastKm: string;
  lastService: string;
};

export default function MyGaragePortal() {
  const { bookings, setSelectedVehicleId } = useBooking();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [customerProfile, setCustomerProfile] = useState({
    name: "ธนภัทร อัครเดช",
    phone: "089-456-7890",
    email: "thanaphat@ackerman.co.th",
    taxId: "1100400982115",
    erpId: "CUS-2026-0194",
  });

  const [activeTab, setActiveTab] = useState<
    "BOOKINGS" | "VEHICLES" | "WARRANTIES"
  >("BOOKINGS");
  const [stageOverrides, setStageOverrides] = useState<Record<string, number>>(
    {}
  );

  const [myVehicles, setMyVehicles] = useState<GarageVehicle[]>([
    {
      plate: "3ขฬ 9911 กรุงเทพมหานคร",
      vehicleId: "bmw-g20-330e",
      model: "2024 BMW 3 Series (G20) 330e M Sport",
      vin: "WBA5E31090G991824",
      lastKm: "14,850 กม.",
      lastService: "28/10/2026",
    },
    {
      plate: "9กษ 911 กรุงเทพมหานคร",
      vehicleId: "porsche-992-carrera",
      model: "2023 Porsche 911 (992) Carrera S",
      vin: "WP0ZZZ99ZPS210911",
      lastKm: "9,400 กม.",
      lastService: "18/10/2026",
    },
  ]);

  const [showAddCar, setShowAddCar] = useState(false);
  const [newCarPlate, setNewCarPlate] = useState("");
  const [newCarVehicleId, setNewCarVehicleId] = useState(VEHICLES[2].id);
  const [newCarVin, setNewCarVin] = useState("");

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarPlate.trim()) return;
    const found = VEHICLES.find((v) => v.id === newCarVehicleId) ?? VEHICLES[0];
    setMyVehicles((prev) => [
      ...prev,
      {
        plate: newCarPlate.trim(),
        vehicleId: found.id,
        model: found.label,
        vin: newCarVin.trim() || "ยังไม่ระบุเลขตัวถัง",
        lastKm: "0 กม.",
        lastService: "เพิ่งลงทะเบียนรถใหม่",
      },
    ]);
    setNewCarPlate("");
    setNewCarVin("");
    setShowAddCar(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex gap-2 rounded-xl bg-background p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode("LOGIN")}
              className={`flex-1 rounded-lg py-2 transition ${
                authMode === "LOGIN"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              เข้าสู่ระบบ (Login)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("REGISTER")}
              className={`flex-1 rounded-lg py-2 transition ${
                authMode === "REGISTER"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              สมัครสมาชิกใหม่ (Register)
            </button>
          </div>

          <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">
            {authMode === "LOGIN"
              ? "เข้าสู่ระบบพอร์ทัล My Garage"
              : "ลงทะเบียนเจ้าของรถ Ackermann"}
          </h2>
          <p className="mt-1 text-xs text-muted">
            ซิงค์ประวัติการจองคิว สถานะซ่อมสด และใบรับประกันสินค้าดิจิทัลโดยตรงจากระบบ ERP
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="mt-5 space-y-4 text-xs"
          >
            {authMode === "REGISTER" && (
              <div>
                <label className="block font-medium text-muted">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  required
                  value={customerProfile.name}
                  onChange={(e) =>
                    setCustomerProfile({
                      ...customerProfile,
                      name: e.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-muted">
                เบอร์โทรศัพท์ หรือ อีเมลที่ลงทะเบียนกับอู่
              </label>
              <input
                type="text"
                required
                defaultValue="089-456-7890"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground tabular-nums focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-muted">รหัสผ่าน</label>
              <input
                type="password"
                required
                defaultValue="ackermann123"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              {authMode === "LOGIN"
                ? "เข้าสู่ระบบ My Garage"
                : "ยืนยันการสมัครสมาชิก"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Customer Profile Banner (Strictly NO Loyalty Points per Ackermann ERP Policy) */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            เชื่อมต่อข้อมูลลูกค้าจากระบบ Ackermann ERP
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">
            คุณ{customerProfile.name} (Customer ID: {customerProfile.erpId})
          </h2>
          <p className="mt-1 text-xs text-muted tabular-nums">
            เบอร์โทรศัพท์: {customerProfile.phone} • เลขผู้เสียภาษีสำหรับใบกำกับภาษีเต็มรูป:{" "}
            {customerProfile.taxId}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className="rounded-full border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary"
          >
            เลือกของแต่งเพิ่ม
          </Link>
          <Link
            href="/booking"
            className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
          >
            + จองคิวติดตั้งใหม่
          </Link>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="rounded-full border border-border bg-background px-4 py-2.5 text-xs text-muted transition hover:text-foreground"
          >
            สลับบัญชี / ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("BOOKINGS")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "BOOKINGS"
              ? "bg-primary text-white"
              : "bg-surface text-muted hover:text-foreground"
          }`}
        >
          นัดหมาย & ติดตามสถานะงานซ่อมสด ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("VEHICLES")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "VEHICLES"
              ? "bg-primary text-white"
              : "bg-surface text-muted hover:text-foreground"
          }`}
        >
          รถยนต์ในโรงรถ (Vehicle Garage) ({myVehicles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("WARRANTIES")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "WARRANTIES"
              ? "bg-primary text-white"
              : "bg-surface text-muted hover:text-foreground"
          }`}
        >
          ใบรับประกันสินค้าดิจิทัล (Digital Warranty) ({INITIAL_WARRANTIES.length})
        </button>
      </div>

      {/* Tab 1: Active Bookings & 4-Step ERP Repair Status Tracker */}
      {activeTab === "BOOKINGS" && (
        <div className="mt-8 space-y-6">
          {bookings.map((b) => {
            const currentStage =
              stageOverrides[b.bookingNo] ?? b.repairStage;

            return (
              <article
                key={b.bookingNo}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-heading text-lg font-bold text-foreground tabular-nums">
                        ใบจองคิว #{b.bookingNo}
                      </span>
                      <span className="rounded-full border border-primary/50 bg-primary/15 px-3 py-0.5 text-xs font-semibold text-foreground">
                        {b.partsReadiness}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted tabular-nums">
                      ทะเบียน:{" "}
                      <strong className="text-foreground">
                        {b.licensePlate}
                      </strong>{" "}
                      ({b.vehicleLabel}) • นัดวันที่ {b.appointmentDate} เวลา{" "}
                      {b.appointmentSlot}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-left lg:text-right tabular-nums">
                      <span className="text-xs text-muted">
                        ช่องซ่อมที่รับผิดชอบใน ERP:
                      </span>
                      <p className="font-semibold text-primary">
                        {b.bayAssigned}
                      </p>
                    </div>
                    <Link
                      href={`/track/${b.bookingNo}`}
                      className="rounded-full border border-primary bg-background px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                      เปิดใบรับรอง QR สำหรับยื่นหน้าร้าน
                    </Link>
                  </div>
                </div>

                {/* 4-Step Read-Only Progress Tracker synced from ERP Kanban */}
                <div className="mt-6">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      สถานะงานซ่อม 4 ขั้นตอนจากหน้างาน Workshop (Live ERP Tracker)
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted">
                      <span>จำลองเปลี่ยนสถานะจากฝั่งช่าง ERP:</span>
                      {[1, 2, 3, 4].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() =>
                            setStageOverrides((prev) => ({
                              ...prev,
                              [b.bookingNo]: st,
                            }))
                          }
                          className={`rounded px-2 py-0.5 font-semibold transition ${
                            currentStage === st
                              ? "bg-primary text-white"
                              : "border border-border bg-background text-muted hover:text-foreground"
                          }`}
                        >
                          ขั้นที่ {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {REPAIR_STAGES.map((stage) => {
                      const done = currentStage >= stage.step;
                      const current = currentStage === stage.step;
                      return (
                        <div
                          key={stage.step}
                          className={`rounded-xl border p-4 transition ${
                            current
                              ? "border-primary bg-background"
                              : done
                              ? "border-border bg-background/70"
                              : "border-border bg-background/30 opacity-50"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs tabular-nums">
                            <span
                              className={`font-bold ${
                                current ? "text-primary" : "text-muted"
                              }`}
                            >
                              STEP 0{stage.step}
                            </span>
                            {done && (
                              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                {current ? "กำลังดำเนินการ" : "เสร็จสิ้น"}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 font-heading text-sm font-semibold text-foreground">
                            {stage.th}
                          </p>
                          <p className="text-[11px] text-muted">{stage.en}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Deposit Financial Breakdown */}
                <div className="mt-6 grid gap-6 border-t border-border pt-5 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <h4 className="text-xs font-semibold text-muted">
                      รายการอะไหล่และบริการที่ผูกกับใบจอง:
                    </h4>
                    <ul className="mt-2 space-y-2 text-xs">
                      {b.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5 tabular-nums"
                        >
                          <div>
                            <span className="font-medium text-foreground">
                              {item.name}
                            </span>
                            <span className="ml-2 text-muted">({item.sku})</span>
                          </div>
                          <span className="font-semibold text-foreground">
                            {formatTHB(item.partPrice + item.laborPrice)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4 text-xs tabular-nums lg:col-span-5">
                    <div className="flex justify-between py-1">
                      <span className="text-muted">ยอดรวมประเมิน:</span>
                      <span className="font-semibold text-foreground">
                        {formatTHB(b.grandTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 text-primary">
                      <span>หักเงินมัดจำรับล่วงหน้าแล้ว:</span>
                      <span className="font-bold">
                        -{formatTHB(b.depositPaid)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                      <span>ยอดคงเหลือชำระวันรับรถ:</span>
                      <span>{formatTHB(b.remainingBalance)}</span>
                    </div>
                    <p className="mt-2 text-[11px] text-muted">
                      Payment Ref: {b.paymentGatewayRef}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Tab 2: Registered Customer Vehicles */}
      {activeTab === "VEHICLES" && (
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              เลือกรถของคุณเพื่อกรองของแต่งตรงรุ่นและดึงข้อมูลทะเบียนตอนจองคิวอัตโนมัติ
            </p>
            <button
              type="button"
              onClick={() => setShowAddCar(!showAddCar)}
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              {showAddCar ? "ยกเลิก" : "+ เพิ่มรถยนต์คันใหม่"}
            </button>
          </div>

          {showAddCar && (
            <form
              onSubmit={handleAddCar}
              className="mb-6 grid gap-4 rounded-2xl border border-primary/50 bg-surface p-5 sm:grid-cols-4"
            >
              <div>
                <label className="block text-xs font-medium text-muted">
                  เลขทะเบียนรถ
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น 1กข 9999 กทม."
                  value={newCarPlate}
                  onChange={(e) => setNewCarPlate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">
                  รุ่นรถยนต์
                </label>
                <select
                  value={newCarVehicleId}
                  onChange={(e) => setNewCarVehicleId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
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
                  เลขตัวถัง (VIN - ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="ระบุ VIN 17 หลัก"
                  value={newCarVin}
                  onChange={(e) => setNewCarVin(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground tabular-nums"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  บันทึกรถเข้าโรงรถ
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {myVehicles.map((car) => (
              <div
                key={car.plate}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-primary/50 bg-background px-3 py-1 font-heading text-base font-bold text-primary tabular-nums">
                    {car.plate}
                  </span>
                  <span className="text-xs text-muted tabular-nums">
                    เลขไมล์ล่าสุด: {car.lastKm}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
                  {car.model}
                </h3>
                <p className="mt-1 text-xs text-muted tabular-nums">
                  เลขตัวถัง (VIN): {car.vin} • เข้ารับบริการล่าสุด:{" "}
                  {car.lastService}
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    href="/shop"
                    onClick={() => setSelectedVehicleId(car.vehicleId)}
                    className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
                  >
                    เลือกดูของแต่งตรงรุ่นคันนี้
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Digital Warranty Certificates synced from ERP Warranty Hub */}
      {activeTab === "WARRANTIES" && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {INITIAL_WARRANTIES.map((w) => (
            <article
              key={w.certNo}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-semibold text-primary tabular-nums">
                    ใบรับประกัน #{w.certNo}
                  </span>
                  <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                    {w.productName}
                  </h3>
                </div>
                <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground">
                  คุ้มครองปกติ (Active)
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs tabular-nums">
                <div>
                  <dt className="text-muted">ทะเบียนรถที่ติดตั้ง:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {w.licensePlate}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Serial / DOT Lot:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {w.serialOrDot}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">วันที่ติดตั้ง:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {w.installedDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">วันหมดอายุรับประกัน:</dt>
                  <dd className="mt-0.5 font-semibold text-primary">
                    {w.expiryDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">เลขไมล์วันติดตั้ง:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {w.installedKm.toLocaleString("th-TH")} กม.
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">คุ้มครองถึงเลขไมล์:</dt>
                  <dd className="mt-0.5 font-semibold text-foreground">
                    {w.maxWarrantyKm.toLocaleString("th-TH")} กม.
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
