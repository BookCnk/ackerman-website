# Clone-Website Research & UX Blueprint: Ackermann Performance & Tuning Portal

## 1. Reference Benchmarks Studied
1. **Fitment Industries (Wheel & Build Gallery UX)**:
   - **Cascading Vehicle Fitment Bar**: Year -> Make -> Model -> Submodel persistent filter locked across catalog and showcase.
   - **Build Cards with BOM (Bill of Materials)**: High-impact photography paired with quick-spec pill badges (Suspension, Wheel/Tire spec, Brake kit, Exhaust) and a direct **"Book This Build / ใช้สเปกนี้"** conversion button that loads all parts into the booking cart.
2. **Vivid Racing / Top Performance Shop Configurators**:
   - **Hardware + Installation Bundle**: Each part displays both hardware price (`ราคาอะไหล่`) and estimated installation labor (`ค่าแรงติดตั้งประเมิน`) + installation duration (`เวลาติดตั้งประมาณการ`).
   - **ERP Stock & Inbound PO Awareness**: Real-time distinction between `มีสต็อกพร้อมติดตั้ง (In Stock - Parts Ready)` and `สั่งจองล่วงหน้า (Pre-Order / Inbound PO)` which dynamically restricts the earliest available appointment date on the booking calendar.

## 2. Source-to-Local Route Map
| Route | Role | Key Features |
|---|---|---|
| `/` | Landing & Brand Showcase | Hero video, Sticky Vehicle Fitment Quick-Finder, Services, Featured Builds, Reviews, FAQ |
| `/shop` | Parts & Package Catalog (`เลือกสินค้า & เช็คราคา`) | Vehicle Fitment Bar, Category/Brand/Stock filters, Parts + Labor pricing, Add to Booking Cart |
| `/showcase` | Build Gallery (`โชว์ผลงานร้าน`) | Filter by Car Model & Mod Category, Full Spec Breakdown (BOM), 1-Click **"จองชุดแต่งตามคันนี้"** |
| `/booking` | Booking & Deposit Checkout (`จองคิว & โอนมัดจำ`) | Vehicle Plate/Info, Smart Date/Bay Picker (respects Pre-Order ETA), Hybrid Deposit Calculator, Stripe/Omise Payment Gateway Simulator -> ERP Webhook Trigger |
| `/garage` | Customer Portal (`รถของฉัน / My Garage`) | Vehicle Garage (No loyalty points), Active Appointment & 4-Step ERP Repair Tracker, Digital Warranty Certificates |
| `/api/erp/webhook` | ERP Integration Endpoint | Receives Payment Gateway webhook, reserves stock & creates Workshop Appointment in Ackermann ERP |

