"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";
import { formatTHB } from "@/lib/mock-erp-data";

type StanceHotspot = {
  id: "suspension" | "brakes" | "wheels" | "exhaust";
  titleTh: string;
  titleEn: string;
  xPercent: number; // Position on car image
  yPercent: number;
  productName: string;
  brand: string;
  partNo: string;
  price: number;
  specs: string[];
  image: string;
};

type ChassisConfig = {
  id: string;
  name: string;
  subtitle: string;
  categoryTag: string;
  image: string;
  fitmentSummary: {
    frontWheel: string;
    rearWheel: string;
    tires: string;
    drop: string;
  };
  hotspots: StanceHotspot[];
};

const CHASSIS_BUILDS: ChassisConfig[] = [
  {
    id: "bmw-m2",
    name: "2024 BMW M2 Coupe (G87)",
    subtitle: "Track Spec & Street Precision — M TwinPower Turbo S58",
    categoryTag: "Track Stance (สนามแข่ง & ถนนหลวง)",
    image: "/sites/ind/hero-g87-m2.jpg",
    fitmentSummary: {
      frontWheel: "18x9.5 ET22 5H112 (หน้าเต็มซุ้ม)",
      rearWheel: "19x10.5 ET25 5H112 (เว้าลึกพิเศษ)",
      tires: "Michelin Pilot Sport 5 (275/35 R19 & 285/30 R20)",
      drop: "-30mm (KW V3 Compression & Rebound Balanced)",
    },
    hotspots: [
      {
        id: "suspension",
        titleTh: "ระบบช่วงล่าง & โช้คอัพ",
        titleEn: "KW Variant 3 Inox-Line Coilovers",
        xPercent: 28,
        yPercent: 62,
        productName: "KW Variant 3 Inox-Line 16-Way Damping Adjustable",
        brand: "KW Suspensions",
        partNo: "KW-352200AL",
        price: 115000,
        specs: ["ปรับความหนืด Bump & Rebound แยกอิสระ", "กระบอกสแตนเลส Inox ไร้สนิมตลอดชีพ", "ลดอาการโคลงเข้าโค้งแม่นยำ 100%"],
        image: "/images/products/susp-kw-v3.png",
      },
      {
        id: "brakes",
        titleTh: "ระบบเบรกไฮเพอร์ฟอร์แมนซ์",
        titleEn: "Brembo GT6 Monobloc Calipers",
        xPercent: 34,
        yPercent: 72,
        productName: "Brembo GT6 Monobloc 6-Pot Kit จาน 380mm 2-Piece",
        brand: "Brembo",
        partNo: "BRE-1N2.9004A",
        price: 158000,
        specs: ["คาลิเปอร์ 6-Pot อะลูมิเนียมหล่อชิ้นเดียว", "จานเบรก Type III Slotted คาร์บอนสูง", "ระยะเบรกสั้นลง 18% ทนความร้อน 800°C"],
        image: "/images/products/brake-brembo-gt6.jpg",
      },
      {
        id: "wheels",
        titleTh: "ล้อฟอร์จน้ำหนักเบา",
        titleEn: "Enkei RPF1 Lightweight Racing",
        xPercent: 25,
        yPercent: 75,
        productName: "Enkei RPF1 Classic Lightweight 18x9.5 ET30 5H114.3",
        brand: "Enkei",
        partNo: "ENK-3798956530SP",
        price: 68000,
        specs: ["เทคโนโลยี MAT Forged เบาเพียง 8.4 กก./วง", "ก้านคู่ Twin-Spoke ระบายความร้อนเบรกยอดเยี่ยม", "สเปกตรงรุ่นซุ้ม M2 ไม่ติดคาลิเปอร์"],
        image: "/images/products/wheel-enkei-rpf1.jpg",
      },
      {
        id: "exhaust",
        titleTh: "ชุดท่อไอเสียสปอร์ต",
        titleEn: "Eisenmann Valvetronic Sport Exhaust",
        xPercent: 88,
        yPercent: 70,
        productName: "Eisenmann Performance Quad Exhaust with Carbon Tips",
        brand: "Eisenmann",
        partNo: "EIS-B5432.0004",
        price: 138000,
        specs: ["ท่อสูตรเยอรมันสแตนเลส T304 พรีเมียม", "ระบบวาล์วเปิด-ปิดเสียงอัตโนมัติตามรอบเครื่อง", "ปลายท่อคาร์บอนไฟเบอร์แท้ขนาด 102mm"],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
  {
    id: "defender-110",
    name: "2024 Land Rover Defender 110 V8",
    subtitle: "Luxury Overland & Bespoke Stance — 5.0L Supercharged V8",
    categoryTag: "Luxury Overland (ความหรูหราพร้อมลุย)",
    image: "/sites/urban/banner-defender-grey.webp",
    fitmentSummary: {
      frontWheel: "22x10.0 ET25 5H120 (Monoblock Forged)",
      rearWheel: "22x10.0 ET25 5H120 (Monoblock Forged)",
      tires: "Michelin Pilot Sport SUV 285/45 R22 All-Season",
      drop: "-25mm Dynamic Air Stance Calibration",
    },
    hotspots: [
      {
        id: "suspension",
        titleTh: "ระบบถุงลมปรับระดับอัตโนมัติ",
        titleEn: "Ackermann Air-Ride Lowering Calibration",
        xPercent: 30,
        yPercent: 58,
        productName: "Ackermann Dynamic Electronic Air Suspension Link Module",
        brand: "Ackermann Engineering",
        partNo: "ACK-DEF-AIR01",
        price: 58000,
        specs: ["ปรับลดความสูงขณะจอด 40mm เพื่อ Stance ที่สง่างาม", "รองรับโหมด Off-road ยกสูงอัตโนมัติเมื่อตรวจจับภูมิประเทศ", "ควบคุมผ่านสวิตช์ในรถและระบบ ERP ไร้สาย"],
        image: "/images/products/susp-bilstein-b16.jpg",
      },
      {
        id: "brakes",
        titleTh: "ชุดเบรกสำหรับรถ SUV กำลังสูง",
        titleEn: "Brembo Heavy Duty 6-Pot Kit",
        xPercent: 36,
        yPercent: 68,
        productName: "Brembo GT Junior 6-Pot High-Load Kit จาน 405mm",
        brand: "Brembo",
        partNo: "BRE-1M2.9022A",
        price: 185000,
        specs: ["คาลิเปอร์ขนาดใหญ่รองรับน้ำหนักตัวรถ 2.5 ตัน", "จานเบรกขนาด 405mm พร้อมระบบระบายอากาศครีบโค้ง", "หยุดมั่นใจในทุกสภาวะถนนเปียกและแห้ง"],
        image: "/images/products/brake-brembo-gt6.jpg",
      },
      {
        id: "wheels",
        titleTh: "ล้อฟอร์จสั่งตัดพิเศษ",
        titleEn: "Bespoke Urban 22\" Monoblock Forged",
        xPercent: 27,
        yPercent: 72,
        productName: "Bespoke UV-1 Monoblock Forged 22x10 ET25",
        brand: "Bespoke Forged",
        partNo: "UV1-2210-DEF",
        price: 195000,
        specs: ["ขึ้นรูปจากแท่งอะลูมิเนียม 6061-T6 เกรดอากาศยาน", "น้ำหนักเบากว่าล้อเดิมโรงงาน 32%", "รองรับน้ำหนักบรรทุก 1,100 กก. ต่อล้อ"],
        image: "/sites/urban/discover-wheels.webp",
      },
      {
        id: "exhaust",
        titleTh: "ท่อไอเสียสปอร์ตพลังเสียง V8",
        titleEn: "Supersprint Quad Active Exhaust",
        xPercent: 86,
        yPercent: 66,
        productName: "Supersprint Inox Valvetronic System V8 Sound",
        brand: "Supersprint",
        partNo: "SUP-409812",
        price: 145000,
        specs: ["เสียงคำรามทุ้มลึกสไตล์ V8 บ่งบอกเอกลักษณ์ความแรง", "ท่อทางเดินไอเสียออกแบบลดแรงดันย้อนกลับ 40%", "ปลายท่อสแตนเลสปัดเงา 4 ช่องรับกับดิฟฟิวเซอร์"],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
  {
    id: "porsche-911",
    name: "2024 Porsche 911 GT3 (992)",
    subtitle: "Naturally Aspirated 9,000 RPM — Pure Motorsport Engineering",
    categoryTag: "Pure Motorsport (มอเตอร์สปอร์ตพันธุ์แท้)",
    image: "/sites/ind/hero-bronco-bbs.jpg",
    fitmentSummary: {
      frontWheel: "20x9.0 ET35 Centerlock / 5H112",
      rearWheel: "21x12.0 ET40 Centerlock / 5H112",
      tires: "Michelin Pilot Sport Cup 2 (255/35 R20 & 315/30 R21)",
      drop: "-15mm Race Camber Setup (-2.5° Front / -2.0° Rear)",
    },
    hotspots: [
      {
        id: "suspension",
        titleTh: "ระบบช่วงล่างแข่งขันปรับไฟฟ้า",
        titleEn: "Bilstein B16 DampTronic Porsche Spec",
        xPercent: 32,
        yPercent: 55,
        productName: "Bilstein B16 PSS10 DampTronic Coilover System",
        brand: "Bilstein",
        partNo: "BIL-49-216127",
        price: 168000,
        specs: ["เชื่อมต่อระบบ PASM เดิมของ Porsche แบบ 100% Plug & Play", "ปรับเซ็ตติ้งได้ทั้งโหมด Normal, Sport และ Track ในห้องโดยสาร", "สปริงหล่อพิเศษจากโรงงาน Bilstein เยอรมนี"],
        image: "/images/products/susp-bilstein-b16.jpg",
      },
      {
        id: "brakes",
        titleTh: "ชุดจานคาร์บอนเซรามิก",
        titleEn: "AP Racing Radi-CAL Track Brakes",
        xPercent: 37,
        yPercent: 67,
        productName: "AP Racing World Radi-CAL II CP9540 4-Pot / 6-Pot",
        brand: "AP Racing",
        partNo: "APR-CP9540-2S0",
        price: 198000,
        specs: ["เทคโนโลยี Radi-CAL แขนโครงสร้างไม่สมมาตร ลดน้ำหนักสูงสุด", "ทนทานต่อการลงแทร็กระดับ Endurance ไร้การเฟด", "ผ้าเบรกเกรดแข่งขันพร้อมเซนเซอร์จับความหนา"],
        image: "/images/products/brake-brembo-detail.jpg",
      },
      {
        id: "wheels",
        titleTh: "ล้อโมโนบล็อกฟอร์จเจาะก้าน",
        titleEn: "BBS FI-R Monobloc Forged",
        xPercent: 27,
        yPercent: 71,
        productName: "BBS FI-R Monobloc Forged 20x9.0 ET35 5H112",
        brand: "BBS",
        partNo: "BBS-FIR137",
        price: 245000,
        specs: ["สุดยอดนวัตกรรมเจาะรูกลวงกลางก้านล้อ เบาที่สุดในประวัติศาสตร์", "ความแข็งแกร่งระดับรถแข่ง GT3 Cup", "สี Platinum Silver เคลือบพิเศษ"],
        image: "/images/products/wheel-bbs-fir.jpg",
      },
      {
        id: "exhaust",
        titleTh: "ท่อไอเสียไทเทเนียมแท้ทั้งเส้น",
        titleEn: "Akrapovič Titanium Evolution Line",
        xPercent: 86,
        yPercent: 64,
        productName: "Akrapovič Full Titanium Sport Exhaust System",
        brand: "Akrapovič",
        partNo: "AKR-S-PO992-T",
        price: 285000,
        specs: ["ผลิตจากไทเทเนียมน้ำหนักเบาพิเศษ เบากว่าของเดิม 14.2 กก.", "เพิ่มแรงม้า +16.8 HP ที่ 7,200 RPM", "ปลายท่อไทเทเนียมคู่พ่นทรายสลักเลเซอร์ Akrapovič"],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
];

export default function InteractiveStanceStudio() {
  const router = useRouter();
  const { addItem } = useBooking();

  const [selectedChassisIndex, setSelectedChassisIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string>("wheels");
  const [isExplodedView, setIsExplodedView] = useState(false);

  const currentChassis = CHASSIS_BUILDS[selectedChassisIndex];
  const activeHotspot =
    currentChassis.hotspots.find((h) => h.id === activeHotspotId) ||
    currentChassis.hotspots[0];

  const totalPackagePrice = currentChassis.hotspots.reduce(
    (sum, h) => sum + h.price,
    0
  );

  const handleCloneBuild = () => {
    // Add all 4 parts of this signature build into the booking cart
    currentChassis.hotspots.forEach((h) => {
      addItem(
        {
          id: `build-${currentChassis.id}-${h.id}`,
          sku: h.partNo,
          name: h.productName,
          category: h.titleTh,
          brand: h.brand,
          image: h.image,
          partPrice: h.price - 2500,
          laborPrice: 2500,
          installHours: 2,
          stockStatus: "IN_STOCK",
          stockQty: 4,
          leadTimeDays: 0,
          compatibleVehicles: [currentChassis.name],
          specs: h.specs,
          warrantyMonths: 24,
          warrantyKm: 50000,
        },
        false
      );
    });
    router.push("/booking");
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 border-t border-border">
      {/* Background Subtle Tech Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              CINEMATIC BESPOKE STANCE & FITMENT STUDIO
            </div>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              สตูดิโอจัดฟิตเมนต์ & ชิ้นส่วนแต่งรถแท้ตรงรุ่น
            </h2>
            <p className="mt-2 text-sm text-muted max-w-2xl">
              เลือกโมเดลรถเพื่อสำรวจเลเยอร์ชิ้นส่วนสำคัญ 4 ตำแหน่ง (โช้คอัพ, เบรก, ล้อฟอร์จ, ท่อไอเสีย) พร้อมสเปกและราคารวมติดตั้งจริงที่เชื่อมต่อตรงจากระบบคลัง Ackermann ERP
            </p>
          </div>

          {/* Chassis Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-border bg-surface">
            {CHASSIS_BUILDS.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedChassisIndex(idx);
                  setActiveHotspotId("wheels");
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedChassisIndex === idx
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-muted hover:text-foreground hover:bg-background/80"
                }`}
              >
                {c.name.split(" ")[1]} ({c.id.toUpperCase()})
              </button>
            ))}
          </div>
        </div>

        {/* Studio Viewport */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left / Center: Interactive Car Viewport with Hotspots */}
          <div className="lg:col-span-8">
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface via-surface/60 to-background shadow-2xl">
              {/* Vehicle Main Image */}
              <Image
                src={currentChassis.image}
                alt={currentChassis.name}
                fill
                priority
                className={`object-cover transition-all duration-700 ease-out ${
                  isExplodedView ? "scale-95 blur-[1px] opacity-80" : "scale-100 opacity-100"
                }`}
              />

              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <span className="rounded-full bg-black/80 px-3.5 py-1 text-xs font-semibold text-secondary backdrop-blur border border-white/10">
                  {currentChassis.categoryTag}
                </span>

                {/* Exploded View Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsExplodedView(!isExplodedView)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold backdrop-blur border transition ${
                    isExplodedView
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-black/75 text-secondary hover:text-foreground"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                  </svg>
                  {isExplodedView ? "ปิดมุมมองคลี่ชิ้นส่วน" : "ดูแบบคลี่ชิ้นส่วน 4 เลเยอร์ (Exploded View)"}
                </button>
              </div>

              {/* Interactive Glowing Hotspots on Car */}
              {currentChassis.hotspots.map((spot) => {
                const isActive = activeHotspotId === spot.id;
                return (
                  <div
                    key={spot.id}
                    style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHotspotId(spot.id)}
                      className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-white ring-8 ring-primary/30 scale-125"
                          : "bg-black/80 text-foreground border border-white/20 hover:border-primary hover:scale-110"
                      }`}
                      aria-label={spot.titleTh}
                    >
                      <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping opacity-60" />
                      <span className="relative text-[11px] font-bold font-mono">
                        {spot.id === "suspension" && "S"}
                        {spot.id === "brakes" && "B"}
                        {spot.id === "wheels" && "W"}
                        {spot.id === "exhaust" && "E"}
                      </span>

                      {/* Hotspot Floating Tooltip */}
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow opacity-0 transition group-hover:opacity-100 pointer-events-none">
                        {spot.titleTh}
                      </span>
                    </button>
                  </div>
                );
              })}

              {/* Exploded View 4-Layer Floating Graphic Callouts */}
              {isExplodedView && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-around px-4 z-10 transition duration-500">
                  {currentChassis.hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveHotspotId(spot.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                        activeHotspotId === spot.id
                          ? "border-primary bg-surface/95 scale-105 shadow-xl shadow-primary/20"
                          : "border-border/60 bg-surface/70 hover:border-primary/50"
                      }`}
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-background border border-border">
                        <Image src={spot.image} alt={spot.titleTh} fill className="object-cover" unoptimized />
                      </div>
                      <span className="mt-2 text-[11px] font-bold text-foreground text-center">
                        {spot.titleTh}
                      </span>
                      <span className="text-[10px] text-primary font-mono tabular-nums font-bold">
                        {formatTHB(spot.price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Bottom Fitment Specs Bar */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/85 p-3.5 backdrop-blur z-20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums font-mono">
                  <div>
                    <span className="text-[10px] text-muted block">ล้อหน้า (Front):</span>
                    <span className="font-semibold text-foreground text-[11px] truncate block">
                      {currentChassis.fitmentSummary.frontWheel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block">ล้อหลัง (Rear):</span>
                    <span className="font-semibold text-foreground text-[11px] truncate block">
                      {currentChassis.fitmentSummary.rearWheel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block">ขนาดยาง (Tires):</span>
                    <span className="font-semibold text-foreground text-[11px] truncate block">
                      {currentChassis.fitmentSummary.tires}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block">การเซ็ตความสูง (Ride Drop):</span>
                    <span className="font-semibold text-emerald-400 text-[11px] truncate block">
                      {currentChassis.fitmentSummary.drop}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Part Specification & Action HUD */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl">
              {/* Active Hotspot Component Card */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-border">
                <span className="font-bold text-primary uppercase tracking-wider">
                  {activeHotspot.brand}
                </span>
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-muted">
                  Part No: {activeHotspot.partNo}
                </span>
              </div>

              <div className="mt-4 flex gap-4 items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-background">
                  <Image
                    src={activeHotspot.image}
                    alt={activeHotspot.productName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <span className="text-[11px] text-muted block">{activeHotspot.titleTh}</span>
                  <h3 className="font-heading text-base font-bold text-foreground leading-snug line-clamp-2 mt-0.5">
                    {activeHotspot.productName}
                  </h3>
                </div>
              </div>

              {/* Specs Bullet Points */}
              <ul className="mt-4 space-y-2 text-xs text-secondary border-t border-border pt-4">
                {activeHotspot.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="leading-relaxed">{spec}</span>
                  </li>
                ))}
              </ul>

              {/* Single Part Price Tag */}
              <div className="mt-5 rounded-2xl border border-border/80 bg-background/90 p-4 text-center">
                <span className="text-[11px] text-muted block">
                  ราคาชิ้นส่วนนี้ (พร้อมบริการติดตั้งและตั้งศูนย์ 3D)
                </span>
                <div className="text-2xl font-extrabold text-primary tabular-nums font-mono mt-0.5">
                  {formatTHB(activeHotspot.price)}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                  ✓ รวมค่าแรงติดตั้งและตั้งศูนย์ระบบดิจิทัลแล้ว
                </span>
              </div>

              {/* Complete Build Package Action */}
              <div className="mt-6 border-t border-border pt-5">
                <div className="flex items-center justify-between text-xs text-muted mb-3 tabular-nums font-mono">
                  <span>ยอดรวมทั้งแพ็กเกจ (4 รายการ):</span>
                  <span className="text-sm font-extrabold text-foreground">
                    {formatTHB(totalPackagePrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCloneBuild}
                  className="w-full rounded-full bg-primary py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:scale-[0.99]"
                >
                  แต่งตามสูตรสเปกคันนี้ทันที (Clone This Complete Build) →
                </button>

                <p className="mt-2 text-[10px] text-center text-muted">
                  นำชิ้นส่วนแท้ทั้ง 4 ชิ้นเข้าสู่ระบบจองคิว Ackermann ERP ทันที
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
