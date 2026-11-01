export type StockStatus = "IN_STOCK" | "PRE_ORDER" | "SERVICE_ONLY";

export type VehicleModel = {
  id: string;
  year: string;
  make: string;
  model: string;
  submodel: string;
  label: string;
  chassisCode: string;
};

export type CatalogItem = {
  id: string;
  sku: string;
  name: string;
  category:
    | "Performance"
    | "Exterior"
    | "Exhaust"
    | "Interior"
    | "Suspension"
    | "Wheels"
    | "Brakes"
    | "Lifestyle";
  brand: string;
  image: string;
  partPrice: number;
  laborPrice: number;
  installHours: number;
  stockStatus: StockStatus;
  stockQty: number;
  leadTimeDays: number;
  compatibleVehicles: string[];
  specs: string[];
  warrantyMonths: number;
  warrantyKm: number;
};

export type ShowcaseBuild = {
  id: string;
  title: string;
  vehicleId: string;
  vehicleLabel: string;
  categoryTag: string;
  heroImage: string;
  galleryImages: string[];
  ownerHandle: string;
  completedDate: string;
  summary: string;
  stanceSpecs: {
    suspension: string;
    wheels: string;
    brakes: string;
    exhaustOrAero: string;
  };
  partIds: string[];
};

export type IndCategory = {
  id: string;
  title: string;
  enTitle: string;
  desc: string;
  image: string;
  startPrice: number;
};

export type IndBrand = {
  id: string;
  name: string;
  country: string;
  specialty: string;
  image: string;
};

export type UrbanBanner = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  linkText: string;
  vehicleId: string;
};

export type UrbanOneOfOne = {
  id: string;
  name: string;
  specs: string;
  image: string;
  owner: string;
};

export type UrbanDiscover = {
  id: string;
  title: string;
  desc: string;
  image: string;
};

export type ErpBookingRecord = {
  bookingNo: string;
  createdAt: string;
  appointmentDate: string;
  appointmentSlot: string;
  customerName: string;
  customerPhone: string;
  licensePlate: string;
  vehicleLabel: string;
  bayAssigned: string;
  partsReadiness:
    | "อะไหล่พร้อมแล้ว (Parts Ready)"
    | "รอพัสดุส่งถึงร้าน (Inbound Pending)"
    | "บริการทั่วไป (General Service)";
  repairStage: 1 | 2 | 3 | 4;
  items: {
    sku: string;
    name: string;
    partPrice: number;
    laborPrice: number;
    stockStatus: StockStatus;
  }[];
  partsTotal: number;
  laborTotal: number;
  grandTotal: number;
  depositPaid: number;
  remainingBalance: number;
  paymentGatewayRef: string;
  paymentMethod: "PROMPTPAY_QR" | "CREDIT_CARD";
};

export type WarrantyRecord = {
  certNo: string;
  productName: string;
  sku: string;
  serialOrDot: string;
  licensePlate: string;
  vehicleLabel: string;
  installedDate: string;
  expiryDate: string;
  installedKm: number;
  maxWarrantyKm: number;
  status: "ACTIVE" | "EXPIRED";
};

/* =========================================================================
   IND DISTRIBUTION: 8 SHOP BY CATEGORY TILES (Real Assets from ind-distribution.com)
   ========================================================================= */
export const IND_CATEGORIES: IndCategory[] = [
  {
    id: "performance",
    title: "Performance & Engine",
    enTitle: "PERFORMANCE",
    desc: "Eventuri Carbon Intake, Charge Pipes, ECU Tuning",
    image: "/sites/ind/cat-performance.jpg",
    startPrice: 65000,
  },
  {
    id: "exterior",
    title: "Exterior & Aero Carbon",
    enTitle: "EXTERIOR",
    desc: "Alpha-N Carbon Vented Fenders, 3D Design Splitters",
    image: "/sites/ind/cat-exterior.jpg",
    startPrice: 85000,
  },
  {
    id: "exhaust",
    title: "Exhaust Systems",
    enTitle: "EXHAUST",
    desc: "Eisenmann Performance Exhaust, Akrapovič Titanium",
    image: "/sites/ind/cat-exhaust.jpg",
    startPrice: 168000,
  },
  {
    id: "interior",
    title: "Interior & Steering",
    enTitle: "INTERIOR",
    desc: "Karbonius Carbon Wheels, JQ MadTrace Magnetic Paddles",
    image: "/sites/ind/cat-interior.jpg",
    startPrice: 28000,
  },
  {
    id: "suspension",
    title: "Suspension & Coilovers",
    enTitle: "SUSPENSION",
    desc: "KW Clubsport / V3 Inox-Line, Fall-Line Monoballs",
    image: "/sites/ind/cat-suspension.jpg",
    startPrice: 98000,
  },
  {
    id: "wheels",
    title: "Forged Wheels & Fitment",
    enTitle: "WHEELS",
    desc: "BBS FI-R Evo, BBS TS-C Forged, Michelin Pilot Sport",
    image: "/sites/ind/cat-wheels.jpg",
    startPrice: 245000,
  },
  {
    id: "brakes",
    title: "Brake Upgrades & Ceramic",
    enTitle: "BRAKES",
    desc: "MMX Carbon Ceramic, Brembo GT 6-Pot, 2-Piece Rotors",
    image: "/sites/ind/cat-brakes.jpg",
    startPrice: 135000,
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Apparel",
    enTitle: "LIFESTYLE",
    desc: "Garage Welt Skate Decks, IND Heritage Accessories",
    image: "/sites/ind/cat-lifestyle.jpg",
    startPrice: 2900,
  },
];

/* =========================================================================
   IND DISTRIBUTION: 12 DISTRIBUTED BRANDS (Real Assets from ind-distribution.com)
   ========================================================================= */
export const IND_BRANDS: IndBrand[] = [
  {
    id: "3ddesign",
    name: "3D Design",
    country: "Japan",
    specialty: "Aero & Carbon Tuning",
    image: "/sites/ind/brand-3ddesign.jpg",
  },
  {
    id: "acexxon",
    name: "Acexxon",
    country: "USA",
    specialty: "Rear Reflector Inserts & Styling",
    image: "/sites/ind/brand-acexxon.jpg",
  },
  {
    id: "alphan",
    name: "Alpha-N",
    country: "Germany",
    specialty: "Lightweight Carbon Bodywork",
    image: "/sites/ind/brand-alphan.jpg",
  },
  {
    id: "canchecked",
    name: "CANchecked",
    country: "Germany",
    specialty: "OLED Integrated Displays & Telemetry",
    image: "/sites/ind/brand-canchecked.jpg",
  },
  {
    id: "eisenmann",
    name: "Eisenmann",
    country: "Germany",
    specialty: "Handcrafted Performance Exhausts",
    image: "/sites/ind/brand-eisenmann.jpg",
  },
  {
    id: "eventuri",
    name: "Eventuri",
    country: "UK",
    specialty: "Patent Carbon Fiber Intake Systems",
    image: "/sites/ind/brand-eventuri.jpg",
  },
  {
    id: "fallline",
    name: "Fall-Line Motorsports",
    country: "USA",
    specialty: "Billet Suspension & Monoball Bushings",
    image: "/sites/ind/brand-fallline.jpg",
  },
  {
    id: "ind",
    name: "IND Distribution",
    country: "USA",
    specialty: "Custom Paint-Matched OEM & Bespoke Parts",
    image: "/sites/ind/brand-ind.jpg",
  },
  {
    id: "karbonius",
    name: "Karbonius",
    country: "Spain",
    specialty: "Pre-Preg Autoclave Carbon Fiber",
    image: "/sites/ind/brand-karbonius.jpg",
  },
  {
    id: "mmx",
    name: "MMX Performance",
    country: "UK",
    specialty: "Billet Drivetrain & Carbon Ceramic Brakes",
    image: "/sites/ind/brand-mmx.jpg",
  },
  {
    id: "supersprint",
    name: "Supersprint",
    country: "Italy",
    specialty: "T304 Stainless Headers & Downpipes",
    image: "/sites/ind/brand-supersprint.jpg",
  },
  {
    id: "trevora",
    name: "Trevora",
    country: "USA",
    specialty: "Titanium Fasteners & Hardware",
    image: "/sites/ind/brand-trevora.jpg",
  },
];

/* =========================================================================
   URBAN AUTOMOTIVE: BESPOKE FULLSCREEN BANNERS (Real Assets from urban-automotive.com)
   ========================================================================= */
export const URBAN_BANNERS: UrbanBanner[] = [
  {
    id: "urban-avontur",
    title: "Urban Widetrack Avontur",
    subtitle: "Commanding road presence with extended stance and precision carbon styling.",
    badge: "NEW PROGRAMME",
    image: "/sites/urban/banner-avontur.webp",
    linkText: "Explore Avontur Build",
    vehicleId: "urban-defender-110",
  },
  {
    id: "urban-defender",
    title: "Land Rover Defender",
    subtitle: "The definitive bespoke modification programme for Defender 90 & 110.",
    badge: "FLAGSHIP",
    image: "/sites/urban/banner-defender-grey.webp",
    linkText: "Configure Defender",
    vehicleId: "urban-defender-110",
  },
  {
    id: "urban-range-rover",
    title: "Range Rover L460",
    subtitle: "Architectural carbon fiber aero elements and forged luxury wheels.",
    badge: "LUXURY ARCHITECTURE",
    image: "/sites/urban/banner-range-rover-l460.webp",
    linkText: "Discover L460",
    vehicleId: "urban-rr-l460",
  },
  {
    id: "urban-urus-se",
    title: "Lamborghini Urus SE",
    subtitle: "Hybrid hyper-SUV aggressive carbon widening and motorsport aero kit.",
    badge: "HYPER SUV",
    image: "/sites/urban/banner-urus-se.webp",
    linkText: "View Urus SE",
    vehicleId: "urban-urus-se",
  },
  {
    id: "urban-gwagon",
    title: "Mercedes G-Wagon Widetrack",
    subtitle: "Iconic box-flare carbon widening, roof LED pod, and 24-inch custom forged wheels.",
    badge: "WIDETRACK BESPOKE",
    image: "/sites/urban/banner-g-wagon.webp",
    linkText: "Explore G-Wagon",
    vehicleId: "urban-g63-amg",
  },
];

/* =========================================================================
   URBAN AUTOMOTIVE: "ONE OF ONE" BESPOKE CAROUSEL (Real Assets from urban-automotive.com)
   ========================================================================= */
export const URBAN_ONE_OF_ONE: UrbanOneOfOne[] = [
  {
    id: "one-visionnaire",
    name: "Urban Visionnaire",
    specs: "Full Carbon Aerodynamics • Satin Midnight Wrap • 24\" Forged Wheels",
    image: "/sites/urban/one-visionnaire.webp",
    owner: "Bespoke Commission 01",
  },
  {
    id: "one-the-boss",
    name: "The Boss Cullinan",
    specs: "Black Badge Rolls-Royce Cullinan • Urban Widebody • Starlight Stance",
    image: "/sites/urban/one-the-boss-cullinan.webp",
    owner: "Bespoke Commission 02",
  },
  {
    id: "one-kim",
    name: "Kim's Range Rover L460",
    specs: "Ghost Grey Exterior • Bespoke Quilted Cognac Leather • Urban Billet Accents",
    image: "/sites/urban/one-kim-range-rover.webp",
    owner: "Bespoke Commission 03",
  },
  {
    id: "one-jesy",
    name: "Jesy G-Wagon Widetrack",
    specs: "Obsidian Black • Full Exposed Visual Carbon • Side-Exit Titanium Exhaust",
    image: "/sites/urban/one-jesy-gwagon.webp",
    owner: "Bespoke Commission 04",
  },
  {
    id: "one-scott",
    name: "Scott Cullinan Overfinch",
    specs: "Two-Tone Satin Aluminum • Bespoke Urban 24\" Vossen Forged",
    image: "/sites/urban/one-scott-cullinan.webp",
    owner: "Bespoke Commission 05",
  },
  {
    id: "one-grigio",
    name: "Grigio Telesto Range Rover Sport",
    specs: "Porsche Grigio Telesto Paint • Full Gloss Carbon Aero • Brembo GT 6-Pot",
    image: "/sites/urban/one-grigio-rrs.webp",
    owner: "Bespoke Commission 06",
  },
  {
    id: "one-verde",
    name: "Verde Gea Defender Widetrack",
    specs: "Matte Verde Gea • Urban Roof Pod • Milltek Performance Exhaust",
    image: "/sites/urban/one-verde-defender.webp",
    owner: "Bespoke Commission 07",
  },
];

/* =========================================================================
   URBAN AUTOMOTIVE: "DISCOVER URBAN" CAROUSEL (Real Assets from urban-automotive.com)
   ========================================================================= */
export const URBAN_DISCOVER: UrbanDiscover[] = [
  {
    id: "disc-showroom",
    title: "Showroom",
    desc: "Step inside our flagship styling and performance gallery.",
    image: "/sites/urban/discover-showroom.webp",
  },
  {
    id: "disc-wheels",
    title: "Bespoke Wheels",
    desc: "Forged alloy wheels tailored down to the millimetre.",
    image: "/sites/urban/discover-wheels.webp",
  },
  {
    id: "disc-parts",
    title: "Individual Parts",
    desc: "Engineered exhausts, intakes, and billet hardware.",
    image: "/sites/urban/discover-parts.webp",
  },
  {
    id: "disc-topaz",
    title: "Topaz PPF Wraps",
    desc: "Hospital-grade paint protection film and colour transitions.",
    image: "/sites/urban/discover-topaz.webp",
  },
  {
    id: "disc-carbon",
    title: "Carbon Fibre",
    desc: "In-house visual autoclave carbon fiber components.",
    image: "/sites/urban/discover-carbon-fibre.webp",
  },
  {
    id: "disc-paint",
    title: "Custom Paint Lab",
    desc: "OEM-grade paint booths with colour-matched perfection.",
    image: "/sites/urban/discover-paint.webp",
  },
  {
    id: "disc-interiors",
    title: "Upholstery & Interiors",
    desc: "Hand-stitched Connolly & Nappa leather re-trims.",
    image: "/sites/urban/discover-interiors.webp",
  },
];

/* =========================================================================
   VEHICLES LIST (Combining IND Performance Chassis + Urban Luxury Widetrack)
   ========================================================================= */
export const VEHICLES: VehicleModel[] = [
  {
    id: "bmw-g87-m2",
    year: "2024",
    make: "BMW",
    model: "M2 Coupe (G87)",
    submodel: "3.0L S58 Twin-Turbo",
    label: "2024 BMW M2 Coupe (G87) S58",
    chassisCode: "G87",
  },
  {
    id: "bmw-g80-m3",
    year: "2024",
    make: "BMW",
    model: "M3 Competition (G80)",
    submodel: "xDrive S58 Twin-Turbo",
    label: "2024 BMW M3 Competition (G80) xDrive",
    chassisCode: "G80",
  },
  {
    id: "bmw-g99-m5",
    year: "2025",
    make: "BMW",
    model: "M5 Touring (G99)",
    submodel: "V8 Hybrid M xDrive",
    label: "2025 BMW M5 Touring (G99) Hybrid",
    chassisCode: "G99",
  },
  {
    id: "bmw-g65-x5",
    year: "2027",
    make: "BMW",
    model: "X5 / X5M (G65 / F95)",
    submodel: "Competition SAV",
    label: "BMW X5 / X5M (G65 / F95) SAV",
    chassisCode: "G65",
  },
  {
    id: "urban-defender-110",
    year: "2024",
    make: "Land Rover",
    model: "Defender 110 Widetrack",
    submodel: "Urban Bespoke Edition",
    label: "2024 Land Rover Defender 110 Widetrack",
    chassisCode: "L663",
  },
  {
    id: "urban-rr-l460",
    year: "2024",
    make: "Land Rover",
    model: "Range Rover (L460)",
    submodel: "Urban Luxury Edition",
    label: "2024 Range Rover (L460) Urban Edition",
    chassisCode: "L460",
  },
  {
    id: "urban-urus-se",
    year: "2025",
    make: "Lamborghini",
    model: "Urus SE",
    submodel: "V8 PHEV Urban Aero",
    label: "2025 Lamborghini Urus SE Urban Aero",
    chassisCode: "URUS-SE",
  },
  {
    id: "urban-g63-amg",
    year: "2024",
    make: "Mercedes-AMG",
    model: "G 63 Widetrack (W463A)",
    submodel: "V8 BiTurbo Urban Edition",
    label: "2024 Mercedes-AMG G 63 Widetrack (W463A)",
    chassisCode: "W463A",
  },
];

/* =========================================================================
   CATALOG ITEMS (Real IND Distribution & Urban Automotive parts + ERP sync)
   ========================================================================= */
export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "eventuri-g87-intake",
    sku: "IND-EVN-G87-INT",
    name: "Eventuri Black Carbon Fiber Intake System (BMW G87 M2 / G80 M3)",
    category: "Performance",
    brand: "Eventuri",
    image: "/sites/ind/cat-performance.jpg",
    partPrice: 78000,
    laborPrice: 3500,
    installHours: 2,
    stockStatus: "IN_STOCK",
    stockQty: 3,
    leadTimeDays: 0,
    compatibleVehicles: ["bmw-g87-m2", "bmw-g80-m3"],
    specs: ["Patent Venturi Housing Design", "เพิ่มแอร์โฟลว์สูงสุด +18 HP", "คาร์บอนไฟเบอร์แท้เงางามพิเศษพร้อมห้องดักลมเย็น"],
    warrantyMonths: 36,
    warrantyKm: 60000,
  },
  {
    id: "alphan-g87-fenders",
    sku: "IND-ALN-G87-FEN",
    name: "Alpha-N V4 Carbon Front Vented Fenders (BMW G87 M2)",
    category: "Exterior",
    brand: "Alpha-N",
    image: "/sites/ind/cat-exterior.jpg",
    partPrice: 154000,
    laborPrice: 8500,
    installHours: 5,
    stockStatus: "PRE_ORDER",
    stockQty: 0,
    leadTimeDays: 14,
    compatibleVehicles: ["bmw-g87-m2"],
    specs: ["Pre-Preg Carbon Fiber น้ำหนักเบา", "ช่องระบายลมแก้มหน้าสไตล์ GT3", "ลดน้ำหนักตัวถังส่วนหน้า 8.4 กก."],
    warrantyMonths: 24,
    warrantyKm: 50000,
  },
  {
    id: "eisenmann-g87-exhaust",
    sku: "IND-ESM-G87-EXH",
    name: "Eisenmann Performance Valvetronic Exhaust System (G87 M2 / G80 M3)",
    category: "Exhaust",
    brand: "Eisenmann",
    image: "/sites/ind/cat-exhaust.jpg",
    partPrice: 185000,
    laborPrice: 4500,
    installHours: 3,
    stockStatus: "IN_STOCK",
    stockQty: 2,
    leadTimeDays: 0,
    compatibleVehicles: ["bmw-g87-m2", "bmw-g80-m3"],
    specs: ["สแตนเลส T304 Handcrafted in Germany", "ปลายท่อคาร์บอน 110mm 4 ท่อ", "ควบคุมวาล์วเปิด-ปิดเสียงผ่านปุ่มเดิมของรถ"],
    warrantyMonths: 24,
    warrantyKm: 40000,
  },
  {
    id: "karbonius-steering-paddles",
    sku: "IND-KRB-M4-STR",
    name: "Karbonius Carbon Steering Wheel + JQ MadTrace Magnetic Paddles",
    category: "Interior",
    brand: "Karbonius / JQ",
    image: "/sites/ind/cat-interior.jpg",
    partPrice: 48000,
    laborPrice: 2500,
    installHours: 2,
    stockStatus: "IN_STOCK",
    stockQty: 4,
    leadTimeDays: 0,
    compatibleVehicles: ["bmw-g87-m2", "bmw-g80-m3"],
    specs: ["คาร์บอนไฟเบอร์ Autoclave 2x2 Weave", "กริปจับหนัง Alcantara เดินด้าย Tri-Color M", "แป้นแพดเดิ้ลระบบแม่เหล็ก MadTrace แม่นยำระดับมอเตอร์สปอร์ต"],
    warrantyMonths: 24,
    warrantyKm: 40000,
  },
  {
    id: "kw-clubsport-coilovers",
    sku: "IND-KW-CS-001",
    name: "KW Clubsport 3-Way Inox-Line Coilover Kit (BMW G87 / G80)",
    category: "Suspension",
    brand: "KW Suspension",
    image: "/sites/ind/cat-suspension.jpg",
    partPrice: 198000,
    laborPrice: 6500,
    installHours: 4,
    stockStatus: "IN_STOCK",
    stockQty: 2,
    leadTimeDays: 0,
    compatibleVehicles: ["bmw-g87-m2", "bmw-g80-m3"],
    specs: ["แยกปรับ Rebound 16 ระดับ / Low-Speed Bump 6 / High-Speed Bump 14", "Top Mount อลูมิเนียม Uniball ปรับ Camber ได้", "สแตนเลส Inox-Line ทนทานสูง"],
    warrantyMonths: 24,
    warrantyKm: 50000,
  },
  {
    id: "bbs-fir-evo-g87",
    sku: "IND-BBS-FIR-EVO",
    name: "BBS FI-R Evo 19\"/20\" Staggered Forged Wheels + Michelin PS4S",
    category: "Wheels",
    brand: "BBS Motorsport",
    image: "/sites/ind/cat-wheels.jpg",
    partPrice: 310000,
    laborPrice: 3500,
    installHours: 2,
    stockStatus: "PRE_ORDER",
    stockQty: 0,
    leadTimeDays: 10,
    compatibleVehicles: ["bmw-g87-m2", "bmw-g80-m3", "bmw-g99-m5"],
    specs: ["ล้อฟอร์จระดับเบาที่สุดในโลกพร้อมช่องฉลุก้านล้อ", "หน้า 19x9.5 ET15 / หลัง 20x10.5 ET15", "รัดยาง Michelin Pilot Sport 4S แท้"],
    warrantyMonths: 36,
    warrantyKm: 60000,
  },
  {
    id: "mmx-carbon-ceramic-brakes",
    sku: "IND-MMX-CCB-G87",
    name: "MMX Carbon Ceramic Brake Rotor & 6-Pot Caliper System",
    category: "Brakes",
    brand: "MMX Performance",
    image: "/sites/ind/cat-brakes.jpg",
    partPrice: 385000,
    laborPrice: 7500,
    installHours: 4,
    stockStatus: "PRE_ORDER",
    stockQty: 0,
    leadTimeDays: 14,
    compatibleVehicles: ["bmw-g87-m2", "bmw-g80-m3", "bmw-g99-m5"],
    specs: ["จานคาร์บอนเซรามิก 400mm หน้า / 380mm หลัง", "ลดน้ำหนักใต้สปริง 22 กิโลกรัม", "ทนความร้อนสูงกว่า 1,000°C เบรกไม่เฟดในสนาม"],
    warrantyMonths: 36,
    warrantyKm: 80000,
  },
  {
    id: "urban-defender-widetrack-kit",
    sku: "URB-DEF-WID-110",
    name: "Urban Automotive Defender 110 Widetrack Full Aerodynamic Package",
    category: "Exterior",
    brand: "Urban Automotive",
    image: "/sites/urban/banner-defender-grey.webp",
    partPrice: 420000,
    laborPrice: 18000,
    installHours: 12,
    stockStatus: "PRE_ORDER",
    stockQty: 0,
    leadTimeDays: 21,
    compatibleVehicles: ["urban-defender-110"],
    specs: ["โป่งซุ้มล้อคาร์บอนไฟเบอร์ Widetrack ต่อเนื่องรอบคัน", "กันชนหน้าพร้อมช่องดักลม Urban DRL Bar", "สปอยเลอร์หลังคา + ไฟ Roof Light Pod คาร์บอนคู่"],
    warrantyMonths: 36,
    warrantyKm: 60000,
  },
  {
    id: "urban-topaz-full-ppf",
    sku: "URB-TPZ-PPF-001",
    name: "Urban x Topaz Hospital-Grade Self-Healing Full Body PPF",
    category: "Lifestyle",
    brand: "Topaz Detailing",
    image: "/sites/urban/banner-topaz-ppf.webp",
    partPrice: 95000,
    laborPrice: 12000,
    installHours: 16,
    stockStatus: "IN_STOCK",
    stockQty: 5,
    leadTimeDays: 0,
    compatibleVehicles: [
      "bmw-g87-m2",
      "bmw-g80-m3",
      "bmw-g99-m5",
      "bmw-g65-x5",
      "urban-defender-110",
      "urban-rr-l460",
      "urban-urus-se",
      "urban-g63-amg",
    ],
    specs: ["ฟิล์ม TPU หนา 8.5 mil ไร้ส้ม พร้อมสาร Hydrophobic", "ติดตั้งในห้องปลอดฝุ่นมาตรฐาน Cleanroom", "รับประกันฟิล์มเหลืองและลอกร่อน 10 ปี"],
    warrantyMonths: 120,
    warrantyKm: 200000,
  },
];

/* =========================================================================
   SHOWCASE BUILDS (Real Builds from IND & Urban)
   ========================================================================= */
export const SHOWCASE_BUILDS: ShowcaseBuild[] = [
  {
    id: "build-ind-g87-m2",
    title: "IND Portfolio — BMW G87 M2 Sunrise Carbon & KW Clubsport",
    vehicleId: "bmw-g87-m2",
    vehicleLabel: "2024 BMW M2 Coupe (G87) S58",
    categoryTag: "IND Flagship Build",
    heroImage: "/sites/ind/hero-g87-m2.jpg",
    galleryImages: [
      "/sites/ind/hero-g87-m2.jpg",
      "/sites/ind/cat-performance.jpg",
      "/sites/ind/cat-exterior.jpg",
    ],
    ownerHandle: "IND Distribution USA / Ackermann Garage",
    completedDate: "26/10/2026",
    summary:
      "ผลงานแต่งเต็มสูตร IND Heritage บนตัวถัง BMW G87 M2 ติดตั้งชุดโป่งหน้า Alpha-N V4 Carbon Fenders, โช๊ค KW Clubsport 3-Way, กรองเปลือยคาร์บอน Eventuri และท่อไอเสีย Eisenmann Valvetronic พร้อมเบรกคาร์บอนเซรามิก MMX",
    stanceSpecs: {
      suspension: "KW Clubsport 3-Way Inox-Line (-25mm Stance)",
      wheels: "BBS FI-R Evo 19\"/20\" Michelin Pilot Sport 4S",
      brakes: "MMX 400mm Carbon Ceramic Brake System",
      exhaustOrAero: "Alpha-N Carbon Aero + Eisenmann Valvetronic",
    },
    partIds: [
      "eventuri-g87-intake",
      "alphan-g87-fenders",
      "eisenmann-g87-exhaust",
      "kw-clubsport-coilovers",
      "bbs-fir-evo-g87",
      "mmx-carbon-ceramic-brakes",
    ],
  },
  {
    id: "build-urban-defender-110",
    title: "Urban Automotive — Defender 110 Widetrack Bespoke Commission",
    vehicleId: "urban-defender-110",
    vehicleLabel: "2024 Land Rover Defender 110 Widetrack",
    categoryTag: "Urban Widetrack",
    heroImage: "/sites/urban/banner-defender-grey.webp",
    galleryImages: [
      "/sites/urban/banner-defender-grey.webp",
      "/sites/urban/banner-avontur.webp",
      "/sites/urban/one-verde-defender.webp",
    ],
    ownerHandle: "Urban Automotive UK / Ackermann Studio",
    completedDate: "20/10/2026",
    summary:
      "แพ็กเกจปรับแต่งรถอเนกประสงค์หรูอันดับหนึ่งของโลก Urban Widetrack ขยายโป่งซุ้มล้อคาร์บอนไฟเบอร์ สปอยเลอร์หลังคา ไฟ Roof Light Pod พร้อมเคลือบฟิล์มกันรอยรอบคัน Urban x Topaz",
    stanceSpecs: {
      suspension: "Urban Air Ride Calibration Module (-30mm Access Mode)",
      wheels: "22\" Urban Vossen Forged UV-1 Satin Black",
      brakes: "Brembo 6-Pot Big Brake Kit with Custom Urban Calipers",
      exhaustOrAero: "Urban Widetrack Carbon Kit + Topaz Full PPF",
    },
    partIds: ["urban-defender-widetrack-kit", "urban-topaz-full-ppf"],
  },
  {
    id: "build-urban-avontur",
    title: "Urban Widetrack Avontur — The Ultimate Road Presence",
    vehicleId: "urban-defender-110",
    vehicleLabel: "2024 Land Rover Defender 110 Widetrack",
    categoryTag: "Urban Bespoke",
    heroImage: "/sites/urban/banner-avontur.webp",
    galleryImages: [
      "/sites/urban/banner-avontur.webp",
      "/sites/urban/one-jesy-gwagon.webp",
      "/sites/urban/one-visionnaire.webp",
    ],
    ownerHandle: "Ackermann Private Client",
    completedDate: "14/10/2026",
    summary:
      "สไตล์การตกแต่งที่ดุดันที่สุดของ Urban Automotive UK ฝากระโปรงคาร์บอนเจาะช่อง สเกิร์ตหน้า-หลังดีไซน์พิเศษ และการตกแต่งภายในตัดเย็บหนังแท้สองชั้น",
    stanceSpecs: {
      suspension: "Electronic Air Ride Height Module",
      wheels: "23\" Urban Bespoke Forged Monoblock",
      brakes: "High Performance Slotted Rotors",
      exhaustOrAero: "Urban Avontur Widebody + Topaz PPF",
    },
    partIds: ["urban-defender-widetrack-kit", "urban-topaz-full-ppf"],
  },
];

export const INITIAL_ERP_BOOKINGS: ErpBookingRecord[] = [
  {
    bookingNo: "BK-20261028-042",
    createdAt: "28/10/2026 (14.20)",
    appointmentDate: "03/11/2026",
    appointmentSlot: "09.00 - 13.00 น. (ช่องซ่อม ลิฟท์ 2 - ช่วงล่าง/เบรก)",
    customerName: "ธนภัทร อัครเดช",
    customerPhone: "089-456-7890",
    licensePlate: "3ขฬ 9911 กรุงเทพมหานคร",
    vehicleLabel: "2024 BMW M2 Coupe (G87) S58",
    bayAssigned: "ลิฟท์ 2 (Lift 2) & จุดตั้งศูนย์ 3D",
    partsReadiness: "อะไหล่พร้อมแล้ว (Parts Ready)",
    repairStage: 2,
    items: [
      {
        sku: "IND-KW-CS-001",
        name: "KW Clubsport 3-Way Inox-Line Coilover Kit",
        partPrice: 198000,
        laborPrice: 6500,
        stockStatus: "IN_STOCK",
      },
      {
        sku: "IND-EVN-G87-INT",
        name: "Eventuri Black Carbon Fiber Intake System",
        partPrice: 78000,
        laborPrice: 3500,
        stockStatus: "IN_STOCK",
      },
    ],
    partsTotal: 276000,
    laborTotal: 10000,
    grandTotal: 286000,
    depositPaid: 69000,
    remainingBalance: 217000,
    paymentGatewayRef: "chrg_test_6019ackermann882",
    paymentMethod: "PROMPTPAY_QR",
  },
];

export const INITIAL_WARRANTIES: WarrantyRecord[] = [
  {
    certNo: "WRT-2026-00891",
    productName: "KW Clubsport 3-Way Inox-Line Coilover Kit",
    sku: "IND-KW-CS-001",
    serialOrDot: "SN: KW-CS-992814-TH",
    licensePlate: "3ขฬ 9911 กรุงเทพมหานคร",
    vehicleLabel: "2024 BMW M2 Coupe (G87) S58",
    installedDate: "15/08/2026",
    expiryDate: "15/08/2028",
    installedKm: 12400,
    maxWarrantyKm: 52400,
    status: "ACTIVE",
  },
  {
    certNo: "WRT-2026-00614",
    productName: "Urban x Topaz Hospital-Grade Self-Healing Full Body PPF",
    sku: "URB-TPZ-PPF-001",
    serialOrDot: "LOT: TPZ-DYN-2026-0441",
    licensePlate: "9กษ 911 กรุงเทพมหานคร",
    vehicleLabel: "2024 Land Rover Defender 110 Widetrack",
    installedDate: "10/05/2026",
    expiryDate: "10/05/2036",
    installedKm: 8200,
    maxWarrantyKm: 208200,
    status: "ACTIVE",
  },
];

export function formatTHB(amount: number): string {
  return `฿${amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateDeposit(items: CatalogItem[]): {
  partsTotal: number;
  laborTotal: number;
  grandTotal: number;
  depositAmount: number;
  remainingBalance: number;
  depositRuleText: string;
  maxLeadTimeDays: number;
  overallReadiness:
    | "อะไหล่พร้อมแล้ว (Parts Ready)"
    | "รอพัสดุส่งถึงร้าน (Inbound Pending)"
    | "บริการทั่วไป (General Service)";
} {
  const partsTotal = items.reduce((sum, item) => sum + item.partPrice, 0);
  const laborTotal = items.reduce((sum, item) => sum + item.laborPrice, 0);
  const grandTotal = partsTotal + laborTotal;
  const maxLeadTimeDays = items.reduce(
    (max, item) => Math.max(max, item.leadTimeDays),
    0
  );

  const hasPreOrder = items.some((i) => i.stockStatus === "PRE_ORDER");
  const hasPhysicalParts = items.some((i) => i.partPrice > 0);

  let overallReadiness:
    | "อะไหล่พร้อมแล้ว (Parts Ready)"
    | "รอพัสดุส่งถึงร้าน (Inbound Pending)"
    | "บริการทั่วไป (General Service)" = "บริการทั่วไป (General Service)";

  if (hasPreOrder) {
    overallReadiness = "รอพัสดุส่งถึงร้าน (Inbound Pending)";
  } else if (hasPhysicalParts) {
    overallReadiness = "อะไหล่พร้อมแล้ว (Parts Ready)";
  }

  let depositAmount = 0;
  let depositRuleText = "";

  if (items.length === 0) {
    depositAmount = 0;
    depositRuleText = "ยังไม่ได้เลือกรายการจอง";
  } else if (partsTotal > 0) {
    depositAmount = Math.round(partsTotal * 0.25);
    depositRuleText = "มัดจำสั่งจอง/ล็อกสต็อกอะไหล่ 25% ของค่าสินค้า (หักลดยอดวันรับรถ)";
  } else {
    depositAmount = 1000;
    depositRuleText = "มัดจำจองคิวช่องซ่อมบริการทั่วไปคงที่ ฿1,000.00 (หักลดยอดวันรับรถ)";
  }

  const remainingBalance = Math.max(0, grandTotal - depositAmount);

  return {
    partsTotal,
    laborTotal,
    grandTotal,
    depositAmount,
    remainingBalance,
    depositRuleText,
    maxLeadTimeDays,
    overallReadiness,
  };
}





