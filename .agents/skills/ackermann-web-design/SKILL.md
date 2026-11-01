---
name: ackermann-web-design
description: Master UI/UX and web design intelligence for the Ackermann Automotive Management System. Synthesizes the design intelligence, accessibility, and typography reasoning of UI/UX Pro Max with the strict Ackermann Garage ERP rulebook (AGENTS.md). Use whenever designing, creating, refactoring, or reviewing web interfaces, pages, components, dashboards, data tables, modals, or forms in this project.
---

# Ackermann Web Design — Enterprise UI/UX Design System

A specialized design intelligence skill for **Ackermann Automotive Management System (Ackermann Garage ERP)**. This skill builds upon the foundational heuristics, accessibility standards, and visual density rules of **UI/UX Pro Max**, strictly adapted to enforce the project's brand identity, single-garage business architecture, and mandatory UI constraints.

---

## 1. Core Principles & Priority Hierarchy

When creating or refactoring any interface in this project, evaluate decisions in this order:

| Priority | Dimension | Ackermann Garage Standard | Anti-Patterns to Avoid |
|:---:|---|---|---|
| **1** | **Iconography & Visual Elements** | **Vector Outline Icons Only** (`lucide-react`, 16–20px menu, 20–24px key elements). Uniform stroke weight. | ❌ **Strictly NO Unicode / Cartoon Emojis** (📦, ⚠️, 📅, 💰, 🚗, ✨, etc.) anywhere in UI, tables, buttons, or badges. |
| **2** | **Language & Labels** | **Strict Bilingual Format**: `ภาษาไทย (English)` for content headers, buttons, cards, and table headers.<br>**Thai Only for Navigation**: Sidebar, breadcrumbs, and main app launchers must be Thai only without parentheses. | ❌ English before Thai: `Next Action (ขั้นตอนหลัก)`<br>❌ Thai in parentheses: `ของดีเลย์ (เลยกำหนด)`<br>❌ English parentheses on sidebar: `คลังสินค้า (Inventory)` |
| **3** | **Color & Button Tokens** | **Clean Enterprise Palette & Signature Gradient Buttons**:<br>• **Primary Buttons**: Signature Ackermann Red Gradient `linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)` with soft glow `0 2px 8px rgba(220, 38, 38, 0.25)`, white bold text, rounded-lg (8px). Use `<Btn variant="primary">`.<br>• **Secondary / Refresh Buttons**: Crisp white `#FFFFFF`, border `1px solid #CBD5E1`, text `#334155`, font-bold 700.<br>• Sidebar: Charcoal/Slate (`#1E293B`)<br>• Main Background: `#F8FAFC`<br>• Card Background: `#FFFFFF`<br>• Primary Text: `#0F172A`<br>• Secondary Text: `#64748B`<br>• Border: `#E2E8F0`<br>• Semantic: Success (`#16A34A`), Warning (`#D97706`), Error (`#DC2626`) | ❌ Random neon colors, heavy drop shadows, or painting all numbers red.<br>❌ Persistent full-width red banners across screens.<br>❌ Red spam toasts for deferred tasks. |
| **3.1** | **F11 Fullscreen Refresh Button** | **Mandatory Top-Right Refresh (`รีเฟรช (Refresh)`)**: Every page/app must provide a Refresh button at the top-right header (in `SubAppLayout` and page headers) because the app operates in F11 Fullscreen where browser reload and address bars are hidden. | ❌ Omitting refresh buttons, requiring users to press F5 or leave fullscreen. |
| **4** | **Typography & Numbers** | • Heading/Title: 20–26px bold.<br>• Section Title: 14–16px bold.<br>• Body / Cell: 12.5–14px regular.<br>• Supporting / Meta: 11–12px regular.<br>• **Tabular Numbers**: Always use `fontVariantNumeric: 'tabular-nums'` for all numeric, date, and currency fields. | ❌ Variable-width digits causing jumping columns.<br>❌ Inconsistent font sizes across cards. |
| **5** | **Date & Time Standards** | `DD/MM/YYYY` or `DD/MM/YYYY (HH.mm)`. 24-hour time. Thai time zone (`Asia/Bangkok`). | ❌ Seconds in UI (e.g. `19:12:35`).<br>❌ Raw ISO timestamps (`2026-10-19T00:00:00Z`).<br>❌ US date format (`MM/DD/YYYY`). |
| **6** | **Data Tables & Alignment** | • Text & Item descriptions: Left-aligned.<br>• Dates, Codes, Status badges: Centered.<br>• Quantities & Currencies: Right-aligned (`฿#,##0.00`).<br>• Row hover effect + clean subtle border (`#E2E8F0` or `#F1F5F9`). | ❌ Centering numeric/financial figures.<br>❌ Truncating table content without responsive scroll. |
| **7** | **Single-Garage ERP Scope** | Single garage operations with physical areas: หน้าร้าน, คลังพัสดุหลัก, ลานซ่อม Workshop, โซนคัดแยก. | ❌ Multi-branch selectors, HQ/branch drop-downs, or corporate franchise terminology. |
| **8** | **Role-Based Visibility** | Mask sensitive financial costs with `<Lock size={15} /> ซ่อนตามสิทธิ์ (Masked)` if the user lacks `can_view_cost` permission. | ❌ Leaking wholesale lot costs to technicians or unauthorized roles. |
| **9** | **Minimal Slim Scrollbar** | Clean 6px scrollbars (`#CBD5E1` thumb, transparent track, rounded 999px). Sidebar hides scrollbar (`scrollbar-width: none`). | ❌ Clunky default OS scrollbars.<br>❌ `overflow: hidden` that clips critical modal actions. |

---

## 2. Component Design Specifications

### A. Operations Dashboard Architecture
Dashboards must be structured as actionable **Operations Centers**, not static decorative counters:
1. **Header & Quick Actions**: Clear page title, subtitle, refresh button, and direct action buttons (e.g. Create PO, Transfer Stock, New Job).
2. **KPI Overview Cards (3–5 cards)**: Primary metric in bold tabular-nums, clear unit label, contextual sub-metric badge, and role masking where appropriate.
3. **Pipeline & Distribution Bar**: Compact breakdown visual showing the physical state of items (e.g. On-Hand vs. Reserved vs. Available vs. Inbound/Quarantine).
4. **Risk & Urgent Action Center**: Cards highlighting immediate operational blockers (e.g. Out of stock, Unapproved requisitions, Overdue jobs) with direct action buttons.
5. **Operational Tabbed Tables**: Contextual tabs dividing workflows cleanly (e.g. Reorder Needed, Technician Requisitions, Quarantine Inspection, Physical Storage Locations).

### B. Workshop & Job Operations Architecture (All-in-One Job Modal)
To streamline workshop workflow without jumping across separate tabs or opening the POS screen, `JobDetailModal` is organized into **4 Sequential Operational Stages**:
1. **ตรวจรับรถและสภาพ (Intake & DVI)**: Vehicle info, current mileage, customer reported issues, interactive vehicle defect diagram, and initial intake photos.
2. **ใบเสนอราคาและตัดจ่ายอะไหล่ (Quotation & Parts)**: Multi-Select Catalog Drawer for warehouse stock, standard labor services, and outside outsource parts. Real-time margin and tax calculation with FIFO stock allocation.
3. **แผนการซ่อมและตั้งศูนย์ (Job & Alignment)**: Technician assignment (Lead & Assistant), bay allocation, checklist, and wheel alignment data (Caster, Camber, Toe) for tire & suspension jobs.
4. **ตรวจรับรอง ส่งมอบ และคิดเงิน (QC, Delivery & Payment)**: Final QC checklist, car wash sign-off, direct payment processing (Cash, PromptPay QR, Credit Card), full tax invoice issuance, and job closure in a single view.

### C. Multi-Select Catalog Drawer Specification
- Slide-out drawer on the right side of the screen when adding parts or labor to a quotation.
- Categorized tabs (คลังอะไหล่, ค่าแรงบริการ, พาร์ทสั่งด่วนนอกร้าน).
- Multi-select capability allowing technicians to tick 5–10 items and click "เพิ่มลงใบเสนอราคา (Add Items)" in one batch.

### D. Unified Front-Desk POS Architecture
The Sales POS module acts as a **Unified Front-Desk Terminal** with a top dual-mode switcher:
1. **โหมดขายด่วนหน้าร้าน (Retail Cashier Mode)**: Fast barcode/SKU scanning for take-home parts and retail accessories. Real-time stock availability, promotion discounts, and thermal/A4 receipt printing. (No points/loyalty clutter).
2. **โหมดชำระบิลงานซ่อม (Workshop Settlement Mode)**: Live queue of finished workshop jobs pending payment. Cashiers can inspect job summary, verify technician parts/labor breakdown, collect payment, issue official tax invoices, and automatically close out the workshop job.

### E. Customer & Vehicle Profiles (No Loyalty Points Policy)
Per garage business rules, **there is NO points or membership loyalty system**:
- ❌ Do NOT display loyalty points, tier badges (Gold/Platinum), or points redemption fields in any modal, table, or checkout bar.
- ✅ Focus customer profiles exclusively on:
  1. **Customer & Corporate Info**: Name, Phone number, Tax ID, and registered invoicing address.
  2. **Vehicle Garage**: Linked license plates, make, model, sub-model, engine/VIN number, and odometer history.
  3. **Service History Timeline**: Chronological log of past repair visits, parts replaced, and warranty coverage.

### F. Service Package Deals (Fixed-Price Service Bundles)
Garages operate fixed-price package bundles without requiring customer membership:
- **Bundle Items**: Combines parts (e.g. Motor Oil + Filter) with labor services (e.g. Oil Change Labor + Free Multi-Point Inspection).
- **1-Click Insertion**: Service advisors can select pre-configured packages directly in Quotations or POS.
- **Automated Stock Allocation**: Bundled parts are automatically allocated and deducted from inventory without manual SKU searching.

### G. Role-Separated Document Centers Specification
To align with garage accounting workflows, documents are strictly partitioned by operational role:
1. **ศูนย์เอกสารงานขาย (Sales Document Center)**: Managed by service advisors and sales staff. Focuses on customer-facing sales documents:
   - ใบเสนอราคา (Quotations)
   - ใบสั่งงาน/ใบสั่งซ่อม (Service Orders)
   - ใบเสร็จรับเงิน/ใบส่งของหน้าร้าน (Retail Receipts & Delivery Slips)
2. **ศูนย์เอกสารการเงินและบัญชี (Finance Document Center)**: Managed by accountants and finance controllers. Focuses on fiscal compliance and tax reporting:
   - ใบกำกับภาษีเต็มรูป (Full Tax Invoices)
   - ใบลดหนี้/ใบเพิ่มหนี้ (Credit / Debit Notes)
   - รายงานภาษีขาย ภ.พ.30 (Monthly VAT Filings)
   - เอกสารปิดรอบบัญชีและกระทบยอดเงินสด (Period-end Closings & Cash Reconciliation)

### H. Connected Service & Arrival Calendar Specification
To prevent customer appointments being scheduled when required parts have not yet arrived:
- The Workshop Appointments calendar manages physical garage bays and technician capacity.
- Each appointment card displays an automated **Parts Readiness Badge** linked to Inbound PO tracking:
  - `อะไหล่พร้อมแล้ว (Parts Ready)` (`bg-[#DCFCE7] text-[#15803D]`): All requisitioned parts are verified physically in warehouse lots.
  - `รอพัสดุส่งถึงร้าน (Inbound Pending)` (`bg-[#FEF3C7] text-[#92400E]`): Linked PO is active and in transit, displaying estimated supplier delivery date.
  - `พัสดุล่าช้า (Delayed)` (`bg-[#FEE2E2] text-[#B91C1C]`): Supplier delivery is past expected ETA, prompting service advisor to follow up or reschedule.
  - `บริการทั่วไป (General Service)` (`bg-[#F1F5F9] text-[#475569]`): Inspection, labor-only, or high-stock maintenance (e.g. standard motor oil).

### I. Comprehensive Warranty & Claims Engine (Auto-Enrollment Workflow)
To ensure warranties are never missed when customers purchase high-value components (tires, batteries, shocks, rims):
- **Auto-Enrollment Trigger**: When a Workshop Job or POS Sale containing warranted products is paid/closed, the system automatically generates a warranty enrollment draft pre-populated with customer name, phone, license plate, current mileage, and invoice number.
- **Quick Serial / DOT Prompt**: The user is presented with a streamlined prompt to record the DOT week/year (for tires) or Serial Number (for batteries/parts).
- **Certificate & Digital Verification**: Instantly generates an official A4 Warranty Certificate with digital signatures and a dynamic QR code for customers to verify warranty validity on mobile.
- **Warranty & Claims Hub (`/workshop/warranty`)**:
  - Instant search by License Plate or Customer Phone.
  - Automated remaining warranty calculator (Months and Mileage).
  - Supplier Claim Pipeline (กำลังตรวจสอบ -> ส่งเคลมโรงงาน -> รับพัสดุเคลมทดแทน).

### J. Finance & Accounting 3-Hub Architecture
To eliminate cluttered menus and provide clear separation of fiscal duties, the Finance module is streamlined into **3 Core Financial Hubs**:
1. **กระแสเงินสดและรอบบัญชีประจำวัน (Cash Flow & Daily Cash Reconciliation)**:
   - Shift opening/closing balance for front-desk cash drawers.
   - Bank transfer (PromptPay QR) & credit card EDC slip reconciliation.
   - Real-time liquidity forecast and Accounts Receivable (ลูกหนี้ค้างชำระ) tracking.
2. **ศูนย์ภาษีและเอกสารการเงิน (Tax & Financial Compliance Hub)**:
   - Monthly ภ.พ.30 VAT calculation (Sales Output VAT vs Purchase Input VAT from received POs).
   - Withholding Tax management (ภ.ง.ด. 3/53 for outside labor and services).
   - Full Tax Invoices, Credit Notes, and Official Receipt registry with A4 PDF export.
3. **การเงินบริหารและกำไรขาดทุน (Executive P&L, Fixed Costs & Assets Hub)**:
   - Net Profit & Gross Margin breakdown: Mechanic Labor Margin vs Stock Parts Margin (calculated via FIFO actual lot costs).
   - Fixed overheads allocation (Workshop rent, electricity, shop supplies).
   - Workshop Machinery & Assets registry with automatic monthly straight-line depreciation (Hoists, Alignment Racks, Tire Mounting machines).

### K. Manager-Focused HR & Payroll Engine
To guarantee payroll accuracy and transparent incentive management, the HR system prioritizes the **Garage Manager & Payroll Administrator**:
- **Automated Mechanic Labor Commission Engine**:
  - Dynamically calculates technician commissions from closed Workshop Jobs based on technician role (e.g. 70% Lead Mechanic, 30% Assistant Mechanic).
  - Excludes wholesale parts cost, ensuring commissions reflect pure labor value added.
- **Unified Payroll Calculation Hub (`/hr/payroll`)**:
  - Base salary/daily wage + Approved Overtime (OT 1.5x / 2.0x / 3.0x from timesheet).
  - Social Security Fund (SSF 5%, max ฿750) and ภ.ง.ด.1 withholding tax calculations.
  - Loan deductions and advances against salary.
- **One-Click Payroll Run & Payslip Generation**:
  - Batch generation of formal A4 Thai payslips with transparent labor incentive itemization.
  - Exportable bank payroll disbursement file formatted for Thai commercial banks.

### L. Tow Truck Standalone Operations & Service Hand-off
To maintain clean financial accounting across operational divisions:
- **Independent Dispatch & Billing Center**:
  - Towing operations issue standalone towing receipts/invoices calculated via base flag-fall fee, distance per kilometer (Google Maps/GPS calculated), and emergency/night surcharges.
  - Payment is settled independently from garage service invoices.
- **Incident Reference Hand-off**:
  - When towing an accident or breakdown vehicle to Ackermann Garage, the tow dispatcher marks the destination as "Ackermann Garage".
  - A digital copy of the pre-hooking vehicle inspection photos and incident report is automatically made accessible to the Workshop Intake queue as reference context, preventing duplicate inspection disputes.

### M. Dedicated CCTV Command Center Specification
To preserve network bandwidth and keep operational repair screens lightweight:
- **Segregated Surveillance Hub (`/cctv`)**: CCTV streams remain dedicated exclusively to the security monitoring room for owners, managers, and security personnel.
- **Zero In-Bay Stream Bloat**: Repair bays and job cards do not load live video feeds, keeping the Workshop UI fast and responsive.
- **Multi-Layout & Zone Labeling**: Flexible Grid layouts (Single focus, 2x2 Quad, Full 6-cam grid), Fullscreen surveillance mode, live formatted timestamp `DD/MM/YYYY (HH.mm)`, and zone labels (หน้าร้าน, ช่องซ่อม, คลังสินค้า, ลานจอด).

### N. Role-Based Profiles with Granular Feature Overrides
To balance quick user onboarding with enterprise security compliance:
- **Baseline Preset Roles**:
  - `owner`: Unrestricted administrative and financial authority.
  - `manager`: Full operational management, inventory approvals, and team oversight.
  - `service_advisor`: Customer intake, vehicle diagnostics, quotations, and cashiering.
  - `mechanic`: Job checklists, inspection photos, and parts requisition.
  - `cashier`: Point of Sale, payments, full tax invoices, and cash drawer closings.
  - `accountant`: Financial reports, VAT ภ.พ.30, withholding tax, and general ledger.
  - `tow_driver`: Tow dispatches, GPS tracking, vehicle intake inspection, and towing billing.
- **Granular Security Overrides (User-Level Toggles)**:
  - `can_view_cost`: Controls wholesale purchase prices and margin visibility (triggers `<Lock />` when false).
  - `can_approve_requisitions`: Ability to authorize parts release from warehouse.
  - `can_apply_special_discount`: Permission to provide custom bill discounts exceeding preset promotions.
  - `can_reopen_closed_jobs`: Permission to modify closed/settled job invoices.
  - `can_export_financial_reports`: Ability to export Excel/CSV financial and tax filing data.

### O. Safe Read-Only Customer Tracking Specification
To protect garage business confidentiality while providing transparent progress to vehicle owners:
- **Lightweight Mobile-First Status Portal (`/track/:token`)**:
  - Accessible via SMS, LINE, or printed QR code on repair intake slips.
  - Displays basic vehicle identification: License Plate, Vehicle Make/Model, Service Advisor name, and Garage contact hotline.
- **Strict Read-Only 4-Step Progress Tracker**:
  1. `รับรถเข้าอู่ (Vehicle Received)`
  2. `อยู่ระหว่างซ่อมบำรุง (Work in Progress)`
  3. `ตรวจเช็คคุณภาพและล้างรถ (Quality Control & Wash)`
  4. `รถพร้อมส่งมอบ (Ready for Pickup)`
- **Data Security Safeguards**:
  - Strictly read-only: No public interactive buttons that alter quotations or job state.
  - No internal technician notes, sensitive wholesale part numbers, or confidential costs exposed to public view.

### P. Workshop Workflow Kanban Specification
To maintain optimal focus without cluttered dual layouts:
- **Streamlined Workflow Columns**:
  1. `ตรวจรับรถ (Intake & Inspection)`: New arrivals, diagnosis checklists, initial quotations.
  2. `รออะไหล่ (Awaiting Parts)`: Jobs blocked on PO arrivals or warehouse disbursals.
  3. `กำลังซ่อมบำรุง (In Progress)`: Active repairs, fitment, and alignment on lifts.
  4. `ตรวจสอบคุณภาพ (QC Inspection)`: Senior mechanic testing, checklist sign-off.
  5. `ล้างรถและพร้อมส่งมอบ (Wash & Delivery Ready)`: Final wash, customer notified.
  6. `ปิดบิลและส่งมอบแล้ว (Settled & Closed)`: Payment collected and archived.
- **Card Anatomy & Visual Hierarchy**:
  - Top row: License Plate in bold (`fontVariantNumeric: 'tabular-nums'`), Vehicle Make/Model, Service Priority flag.
  - Middle row: Customer name, primary complaint/service summary, and **Bay / Lift Badge** (e.g. `ลิฟท์ 2 (Lift 2)` or `จุดตั้งศูนย์`).
  - Bottom row: Assigned Mechanic pill badge, Parts Readiness pill, and elapsed job duration timer.
  - Interaction: Single-click to open the All-in-One Job Modal; quick action arrow to advance stage.

### Q. Smart Multi-Format Document Output Modal Specification
To eliminate printing errors and satisfy diverse customer preferences (corporates vs walk-ins):
- **Live Document Preview Modal**:
  - Automatically loads formatted document with shop branding, official Tax ID, and bilingual header structure adhering to Thai Revenue Department (RD) standards.
- **Top 1-Click Multi-Format Action Toolbar**:
  1. `พิมพ์เอกสาร A4 (Print A4)`: Full-form official document (Tax Invoice, Quotation, Job Order) with formal signatures and company seal block.
  2. `พิมพ์สลิปย่อ 80mm (Print Thermal)`: Compact POS receipt formatted for 80mm thermal printers with tabular monospace itemization.
  3. `ดาวน์โหลด PDF (Download PDF)`: Direct vector PDF export for archival or email attachment.
  4. `คัดลอกลิงก์ E-Receipt (Share E-Receipt)`: Generates a secure, temporary web link for instant sharing via LINE or WhatsApp without paper waste.

### R. Status Badges & Pills
Always use soft-tinted backgrounds with high-contrast text and subtle borders:
- **Success / Completed / Active**: `bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]`
- **Warning / Pending / In Review**: `bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]`
- **Info / Approved / Processing**: `bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]`
- **Critical / Rejected / Out of Stock**: `bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]`
- **Neutral / Draft / Archived**: `bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]`

### C. Forms & Modals
- Modal headers must include clear title, subtitle, and close button (`X` icon).
- Input height: 36–40px with border `#CBD5E1`, focus ring `#DC2626` or `#3B82F6` with subtle outline.
- Form action buttons placed in footer, aligned right: Cancel (secondary/ghost) and Submit (primary solid).
- Loading state: Button shows spinner and disables clicks (`disabled={submitting}`).

---

## 3. UI/UX Pro Max Intelligence Integration

When you need to explore or query design heuristics, font pairings, or component patterns, use the installed local `ui-ux-pro-max` search script:

```bash
# Query UX guidelines for tables or forms
python .agents/skills/ui-ux-pro-max/scripts/search.py "data table" --domain ux

# Query color palette psychology
python .agents/skills/ui-ux-pro-max/scripts/search.py "automotive" --domain color

# Query stack-specific React guidelines
python .agents/skills/ui-ux-pro-max/scripts/search.py "state" --domain react --stack react
```

---

## 4. Pre-Flight Verification Checklist

Before finalizing any frontend UI change, verify against this 7-point checklist:
1. [ ] **Zero Emojis**: Are all icons imported from `lucide-react`? No Unicode emoji characters present?
2. [ ] **Bilingual Rule**: Are headers formatted as `ภาษาไทย (English)` and sidebar labels Thai-only?
3. [ ] **Tabular Nums**: Do all numeric cells, dates, prices, and quantities have `fontVariantNumeric: 'tabular-nums'`?
4. [ ] **Currency Alignment**: Are currency and number columns right-aligned with `฿` symbol and 2 decimals?
5. [ ] **Date Format**: Are dates formatted as `DD/MM/YYYY` or `DD/MM/YYYY (HH.mm)` without seconds?
6. [ ] **Scrollbars**: Is `.clean-modal-scrollbar` or standard 6px slim scrollbar applied?
7. [ ] **Build Check**: Does `npm run build` in `frontend/` compile with zero errors?
