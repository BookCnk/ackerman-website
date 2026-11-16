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
  xPercent: number;
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
    subtitle: "Track Spec & Street Precision — M TwinPower Turbo S58 (British Racing Green)",
    categoryTag: "Track Stance (ตรงรูปรถ M2 คันสีเขียว 100%)",
    image: "/sites/ind/hero-g87-m2.jpg",
    fitmentSummary: {
      frontWheel: "20x9.5 ET20 5H112 (BBS FI-R Citrine Gold)",
      rearWheel: "20x10.5 ET22 5H112 (BBS FI-R Citrine Gold)",
      tires: "Michelin Pilot Sport 4S (275/35 R19 & 285/30 R20)",
      drop: "-30mm (KW V3 Compression & Rebound Balanced)",
    },
    hotspots: [
      {
        id: "wheels",
        titleTh: "ล้อฟอร์จเจาะก้านสีทอง (ตรงรูปรถ 100%)",
        titleEn: "BBS FI-R Monobloc Forged Citrine Gold",
        xPercent: 25,
        yPercent: 75,
        productName: "BBS FI-R Monobloc Forged 20x9.5 / 20x10.5 ET20 Citrine Gold",
        brand: "BBS Forged",
        partNo: "BBS-FIR-G87",
        price: 245000,
        specs: [
          "✓ ล้อตรงรุ่นคันสีเขียว M2 ในรูป 100% (ลาย Y-Spoke สีทอง Citrine Gold)",
          "นวัตกรรมเจาะรูลดน้ำหนักกลางก้านล้อ เบาเพียง 8.2 กก./วง",
          "แข็งแกร่งระดับรถแข่ง GT3 ทนแรงบิดมหาศาลของเครื่องยนต์ S58",
        ],
        image: "/images/products/wheel-bbs-fir.jpg",
      },
      {
        id: "brakes",
        titleTh: "ชุดเบรกคาลิเปอร์แดง (ตรงรูปรถ 100%)",
        titleEn: "Brembo GT6 Monobloc Red Calipers",
        xPercent: 34,
        yPercent: 72,
        productName: "Brembo GT6 Monobloc 6-Pot Kit จาน 380mm 2-Piece",
        brand: "Brembo",
        partNo: "BRE-1N2.9004A",
        price: 158000,
        specs: [
          "✓ คาลิเปอร์สีแดงสดตัดกับล้อทองและสีตัวรถเขียวตรงรูปเป๊ะ 100%",
          "จานเบรก Type III Slotted คาร์บอนสูง 380mm ระบายความร้อนสูง",
          "ระยะเบรกสั้นลง 18% รองรับการลงแทร็กระดับ Hard Braking",
        ],
        image: "/images/products/brake-brembo-gt6.jpg",
      },
      {
        id: "suspension",
        titleTh: "ระบบช่วงล่างสตรัทปรับเกลียว",
        titleEn: "KW Variant 3 Inox-Line Coilovers",
        xPercent: 28,
        yPercent: 62,
        productName: "KW Variant 3 Inox-Line 16-Way Damping Adjustable",
        brand: "KW Suspensions",
        partNo: "KW-352200AL",
        price: 115000,
        specs: [
          "จัดทรง Stance โหลดเตี้ยแนบซุ้มล้อหน้า-หลังตามภาพจริง",
          "ปรับความหนืด Bump & Rebound แยกอิสระ 16 ระดับ",
          "กระบอกสแตนเลส Inox ไร้สนิมตลอดอายุการใช้งาน",
        ],
        image: "/images/products/susp-kw-v3.png",
      },
      {
        id: "exhaust",
        titleTh: "ชุดท่อไอเสียปลายคาร์บอน 4 ท่อ",
        titleEn: "Eisenmann Valvetronic Sport Exhaust",
        xPercent: 88,
        yPercent: 70,
        productName: "Eisenmann Performance Quad Exhaust with Carbon Tips",
        brand: "Eisenmann",
        partNo: "EIS-B5432.0004",
        price: 138000,
        specs: [
          "ปลายท่อคาร์บอนไฟเบอร์ 4 ท่อตรงรุ่นดิฟฟิวเซอร์ M2 คันในรูป",
          "ระบบวาล์วเปิด-ปิดเสียงอัตโนมัติตามรอบเครื่องยนต์",
          "ท่อสูตรเยอรมันสแตนเลส T304 ลดแรงดันย้อนกลับ 35%",
        ],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
  {
    id: "gtr-r34",
    name: "Nissan Skyline GT-R (BNR34)",
    subtitle: "RB26DETT Twin-Turbo Legend — Japanese Time Attack Spec",
    categoryTag: "JDM Legend (ตรงรูปรถ GT-R ล้อ TE37 ทองไหม้ 100%)",
    image: "/images/products/wheel-rays-te37-car.jpg",
    fitmentSummary: {
      frontWheel: "18x9.5 ET22 5H114.3 (RAYS TE37 SAGA Bronze)",
      rearWheel: "18x9.5 ET22 5H114.3 (RAYS TE37 SAGA Bronze)",
      tires: "Yokohama ADVAN Neova AD09 265/35 R18 Square",
      drop: "-35mm Race Ride Height Alignment",
    },
    hotspots: [
      {
        id: "wheels",
        titleTh: "ล้อฟอร์จสีทองไหม้ 6 ก้านในตำนาน (ตรงรูปรถ 100%)",
        titleEn: "RAYS Volk Racing TE37 SAGA S-plus Bronze",
        xPercent: 32,
        yPercent: 74,
        productName: "RAYS Volk Racing TE37 SAGA S-plus 18x9.5 ET22 Almite Bronze",
        brand: "RAYS Volk Racing",
        partNo: "RAYS-TE37-BR18",
        price: 118000,
        specs: [
          "✓ ล้อก้านตรงสีทองไหม้ (Almite Bronze) ตรงกับรูปรถ GT-R BNR34 100%",
          "โมลด์ฟอร์จความดัน 10,000 ตัน ทนทานและน้ำหนักเบาที่สุดในวงการ",
          "สลักโลโก้ Machining ลิขสิทธิ์แท้จากโรงงาน RAYS ญี่ปุ่น",
        ],
        image: "/images/products/wheel-rays-te37.jpg",
      },
      {
        id: "brakes",
        titleTh: "ชุดเบรกสีทอง Brembo GT-R Spec (ตรงรูปรถ 100%)",
        titleEn: "Brembo Racing Disc Brake Kit",
        xPercent: 36,
        yPercent: 71,
        productName: "Brembo GT Junior 4-Pot Caliper Kit จาน 355mm",
        brand: "Brembo",
        partNo: "BRE-1B1.8002A",
        price: 125000,
        specs: [
          "✓ คาลิเปอร์สีทองและจานเบรกขนาดใหญ่ซ่อนหลังล้อ TE37 ตรงตามรูป",
          "จานเบรก 2 ชิ้นไฮคาร์บอนเจาะรูเซาะร่อง",
          "สายเบรกสแตนเลสถักทนแรงดันสูง เบรกหยุดได้แม่นยำทุกย่านความเร็ว",
        ],
        image: "/images/products/brake-brembo-car.jpg",
      },
      {
        id: "suspension",
        titleTh: "ระบบโช้คอัพสตรัท Bilstein B16",
        titleEn: "Bilstein B16 PSS10 Monotube Coilovers",
        xPercent: 30,
        yPercent: 60,
        productName: "Bilstein B16 PSS10 Track Damper Kit for Skyline GT-R",
        brand: "Bilstein",
        partNo: "BIL-48-112344",
        price: 128000,
        specs: [
          "กระบอกโช้คสีเหลือง-สปริงน้ำเงิน Monotube ทนความร้อนสูง",
          "ปรับความแข็งอ่อนได้ 10 ระดับด้วยสวิตช์หมุนคลิกเดียว",
          "เซ็ตติ้งมุม Camber/Toe สำหรับการเข้าโค้งความเร็วสูง",
        ],
        image: "/images/products/susp-bilstein-b16.jpg",
      },
      {
        id: "exhaust",
        titleTh: "ท่อไอเสียไทเทเนียม Nismo Spec",
        titleEn: "Nismo Full Titanium Racing Exhaust",
        xPercent: 88,
        yPercent: 72,
        productName: "Nismo NE-1 Ver.2 Titanium Exhaust System",
        brand: "Nismo Performance",
        partNo: "NIS-20100-RNR45",
        price: 175000,
        specs: [
          "ผลิตจากเนื้อไทเทเนียมเกรดอากาศยาน เบากว่าของเดิม 12.5 กก.",
          "เสียงหวานกังวานตามสูตรเครื่องยนต์ 6 สูบเรียง RB26DETT",
          "ปลายท่อไทเทเนียมสีรุ้งเผาไฟขนาด 115mm",
        ],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
  {
    id: "honda-s2000",
    name: "Honda S2000 AP2 Track Spec",
    subtitle: "High-Revving VTEC 9,000 RPM — Pure Lightweight Agility",
    categoryTag: "JDM Lightweight (ตรงรูปรถ S2000 ล้อ Enkei RPF1 เงิน 100%)",
    image: "/images/products/wheel-enkei-rpf1-car.jpg",
    fitmentSummary: {
      frontWheel: "17x8.0 ET35 5H114.3 (Enkei RPF1 Silver)",
      rearWheel: "17x9.0 ET45 5H114.3 (Enkei RPF1 Silver)",
      tires: "Michelin Pilot Sport 5 (215/45 R17 & 245/40 R17)",
      drop: "-40mm Track Stance (Tein Flex Z Adjusted)",
    },
    hotspots: [
      {
        id: "wheels",
        titleTh: "ล้อฟอร์จสีเงินก้านคู่ในตำนาน (ตรงรูปรถ 100%)",
        titleEn: "Enkei RPF1 Classic Lightweight Silver",
        xPercent: 38,
        yPercent: 73,
        productName: "Enkei RPF1 Classic Lightweight 17x8.0 / 17x9.0 F1 Silver",
        brand: "Enkei",
        partNo: "ENK-3797806535SP",
        price: 68000,
        specs: [
          "✓ ล้อ Enkei RPF1 สีเงิน F1 Silver ก้านคู่ ตรงกับรูปรถ S2000 ในรูป 100%",
          "เทคโนโลยี MAT Process น้ำหนักเบาพิเศษเพียง 7.1 กก./วง",
          "รูปทรงก้านเว้า Twin-Spoke ระบายความร้อนจานเบรกดีเยี่ยมขณะลงแทร็ก",
        ],
        image: "/images/products/wheel-enkei-rpf1.jpg",
      },
      {
        id: "brakes",
        titleTh: "ชุดจานเบรกและคาลิเปอร์แทร็ก (ตรงรูปรถ 100%)",
        titleEn: "Track Disc & Caliper Kit",
        xPercent: 42,
        yPercent: 70,
        productName: "Brembo GT Junior 4-Pot Caliper Kit จาน 330mm",
        brand: "Brembo",
        partNo: "BRE-1A1.6002A",
        price: 98000,
        specs: [
          "✓ จานเบรกและคาลิเปอร์แน่นเต็มล้อ RPF1 17 นิ้วตรงตามรูป",
          "ทนความร้อนสูง ไร้อาการเบรกเฟดแม้วิ่งต่อเนื่องในสนาม",
          "ผ้าเบรกทนความร้อนสูงถึง 650°C",
        ],
        image: "/images/products/brake-brembo-gt6.jpg",
      },
      {
        id: "suspension",
        titleTh: "ระบบโช้คอัพสปริงเขียว Tein Flex Z",
        titleEn: "Tein Flex Z Street & Track Coilovers",
        xPercent: 35,
        yPercent: 58,
        productName: "Tein Flex Z Full-Tap 16-Step Coilovers Honda S2000",
        brand: "Tein",
        partNo: "TEIN-VSH64-C1SS3",
        price: 52000,
        specs: [
          "กระบอกโช้คปรับเกลียวความยาวทั้งตัว (Full-Tap) สปริงสีเขียวซิกเนเจอร์",
          "ปรับความหนืด 16 ระดับ ควบคุมการทรงตัวของรถน้ำหนักเบาได้แม่นยำ",
          "เคลือบสี ZT ป้องกันสนิมและความชื้นได้ยอดเยี่ยม",
        ],
        image: "/images/products/susp-tein-rx1.jpg",
      },
      {
        id: "exhaust",
        titleTh: "ท่อไอเสียไทเทเนียม Single Exit",
        titleEn: "Tomei Expreme Ti Titanium Exhaust",
        xPercent: 86,
        yPercent: 68,
        productName: "Tomei Expreme Ti Titanium Exhaust System S2000",
        brand: "Tomei Powered",
        partNo: "TOM-440013",
        price: 56000,
        specs: [
          "ท่อออกเดี่ยวไทเทเนียมทั้งเส้น เบากว่าท่อเดิม 14.8 กก.",
          "รีดแรงม้าในช่วงรอบสูง 6,000 - 9,000 RPM ได้เต็มประสิทธิภาพ",
          "ปลายท่อไทเทเนียมเผาปลายสีรุ้งขนาด 105mm",
        ],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
  {
    id: "defender-110",
    name: "2024 Land Rover Defender 110 V8",
    subtitle: "Luxury Overland & Bespoke Stance — 5.0L Supercharged V8",
    categoryTag: "Luxury Overland (ตรงรูปรถ Defender ล้อดำ Forged 22 นิ้ว 100%)",
    image: "/sites/urban/banner-defender-grey.webp",
    fitmentSummary: {
      frontWheel: "22x10.0 ET25 5H120 (Urban UV-1 Satin Black)",
      rearWheel: "22x10.0 ET25 5H120 (Urban UV-1 Satin Black)",
      tires: "Michelin Pilot Sport SUV 285/45 R22 All-Season",
      drop: "-25mm Dynamic Air Stance Calibration",
    },
    hotspots: [
      {
        id: "wheels",
        titleTh: "ล้อโมโนบล็อกฟอร์จสีดำด้าน 22 นิ้ว (ตรงรูปรถ 100%)",
        titleEn: "Bespoke Urban UV-1 22\" Monoblock Forged",
        xPercent: 27,
        yPercent: 72,
        productName: "Bespoke UV-1 Monoblock Forged 22x10 ET25 Satin Black",
        brand: "Bespoke Forged",
        partNo: "UV1-2210-DEF",
        price: 195000,
        specs: [
          "✓ ล้อสั่งตัดสีดำด้าน Satin Black ขนาด 22 นิ้ว ตรงรุ่นรถ Defender คันสีเทาในรูป 100%",
          "ขึ้นรูปจากแท่งอะลูมิเนียม 6061-T6 เกรดอากาศยาน",
          "รับน้ำหนักบรรทุก 1,100 กก./วง แข็งแกร่งพร้อมลุยทุกอุปสรรค",
        ],
        image: "/sites/urban/discover-wheels.webp",
      },
      {
        id: "brakes",
        titleTh: "ชุดเบรกคาลิเปอร์ Brembo Heavy Duty",
        titleEn: "Brembo High-Load 6-Pot Kit",
        xPercent: 36,
        yPercent: 68,
        productName: "Brembo GT Junior 6-Pot High-Load Kit จาน 405mm",
        brand: "Brembo",
        partNo: "BRE-1M2.9022A",
        price: 185000,
        specs: [
          "คาลิเปอร์ขนาดใหญ่รองรับน้ำหนักตัวรถ 2.5 ตัน",
          "จานเบรก 405mm ครีบระบายความร้อนโค้ง รับมือแรงเบรกจากเครื่องยนต์ V8",
          "หยุดนิ่งมั่นใจ ปลอดภัยในทุกเส้นทางออฟโรดและทางหลวง",
        ],
        image: "/images/products/brake-brembo-gt6.jpg",
      },
      {
        id: "suspension",
        titleTh: "ระบบถุงลมปรับระดับความสูงอัตโนมัติ",
        titleEn: "Ackermann Dynamic Air Lowering System",
        xPercent: 30,
        yPercent: 58,
        productName: "Ackermann Dynamic Electronic Air Suspension Link Module",
        brand: "Ackermann Engineering",
        partNo: "ACK-DEF-AIR01",
        price: 58000,
        specs: [
          "จัดทรง Stance รถเตี้ยลง 30mm ขณะขับขี่เพื่อความคล่องตัวและแอโรไดนามิก",
          "ยกสูงอัตโนมัติเมื่อเปลี่ยนเข้าสู่โหมด Off-road",
          "เชื่อมต่อและรายงานสถานะผ่านระบบ Ackermann ERP",
        ],
        image: "/images/products/susp-bilstein-b16.jpg",
      },
      {
        id: "exhaust",
        titleTh: "ท่อไอเสียสปอร์ตพลังเสียง V8 4 ท่อ",
        titleEn: "Urban Milltek Quad Active Exhaust",
        xPercent: 86,
        yPercent: 66,
        productName: "Urban Milltek Inox Valvetronic System V8 Sound",
        brand: "Urban Automotive",
        partNo: "URB-DEF-V8EX",
        price: 145000,
        specs: [
          "ปลายท่อคู่ซ้าย-ขวาสี่ช่องดำด้านกลมกลืนกับท้ายรถตามรูป",
          "เปิดวาล์วเสียงคำรามดุดันของเครื่องยนต์ 5.0L Supercharged V8",
          "ท่อสแตนเลส T304 ทนทานต่อการลุยน้ำและโคลน",
        ],
        image: "/sites/ind/cat-exhaust.jpg",
      },
    ],
  },
];

export default function InteractiveStanceStudio() {
  const router = useRouter();
  const { addItem, setSelectedVehicleId } = useBooking();

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
    setSelectedVehicleId(currentChassis.id);
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
              สตูดิโอจัดฟิตเมนต์ & ชิ้นส่วนแต่งรถแท้ตรงรุ่น 100%
            </h2>
            <p className="mt-2 text-sm text-muted max-w-2xl">
              เลือกโมเดลรถเพื่อสำรวจเลเยอร์ชิ้นส่วนสำคัญ 4 ตำแหน่ง (โช้คอัพ, เบรก, ล้อฟอร์จ, ท่อไอเสีย) โดยทุกชิ้นส่วนตรงกับภาพรถยนต์จริง 100% เชื่อมต่อสต็อกและราคารวมติดตั้งตรงจากระบบคลัง Ackermann ERP
            </p>
          </div>

          {/* 4 Chassis Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-border bg-surface">
            {CHASSIS_BUILDS.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedChassisIndex(idx);
                  setActiveHotspotId("wheels");
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  selectedChassisIndex === idx
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-muted hover:text-foreground hover:bg-background/80"
                }`}
              >
                {c.name.split(" ")[1] ?? c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Viewport */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Car Viewport with Hotspots */}
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
                unoptimized
              />

              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <span className="rounded-full bg-black/85 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur border border-white/10">
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
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-around px-4 z-10 transition duration-500">
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
              <div className="flex items-center justify-between text-xs pb-3 border-b border-border">
                <span className="font-bold text-primary uppercase tracking-wider">
                  {activeHotspot.brand}
                </span>
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-muted font-mono">
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
                  ✓ ราคารวมติดตั้งและตั้งศูนย์เรียบร้อยแล้ว
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
