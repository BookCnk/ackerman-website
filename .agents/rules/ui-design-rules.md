# ACKERMANN GARAGE — MASTER UI/UX & ERP DEVELOPMENT RULEBOOK

**Version:** 1.0  
**System:** Ackermann Automotive Management System  
**Purpose:** กฎบังคับสำหรับการพัฒนา ปรับปรุง และบำรุงรักษาระบบ Automotive Garage ERP

---

# PART 1 — MANDATORY DESIGN RULES

## 1. ห้ามใช้ Unicode Emoji (STRICTLY NO CARTOON EMOJIS)

- ❌ **ห้ามใช้ Unicode Emoji หรือ Cartoon Emoji ในระบบโดยเด็ดขาด** เช่น รถ กล่อง เงิน ปฏิทิน เครื่องมือ (🚚, 📦, ⚠️, 📅, 💰, 🕒, 💡, 🚗, 🎉, ✨ ฯลฯ)
- ✅ **ต้องใช้ Vector Outline Icons สไตล์มืออาชีพเท่านั้น** เช่น `lucide-react`
- ตัวอย่าง Icon ที่อนุญาต ได้แก่ `Wrench`, `Package`, `Calendar`, `Clock`, `Truck`, `Wallet`, `Users`, `Bell`, `Settings`, `CheckCircle`, `AlertTriangle` และ `CircleHelp`
- Icon ต้องมีขนาดและ Stroke Weight สม่ำเสมอกัน โดยทั่วไปใช้ 16–20px สำหรับเมนู และ 20–24px สำหรับองค์ประกอบสำคัญ
- ห้ามใช้อักขระ Emoji แทน Icon ใน Sidebar, Dashboard, Table, Badge, Notification, Empty State หรือปุ่ม
- อนุญาตให้ใช้ Logo หรือภาพประกอบแบรนด์ที่ออกแบบขึ้นโดยเฉพาะได้ โดยไม่ถือเป็น Emoji
- ห้ามติดตั้ง Icon Library ซ้ำ หากโปรเจกต์มี Library ที่เหมาะสมอยู่แล้ว

## 2. ห้ามใช้ Persistent Red Banner และ Toast ที่รบกวนการทำงาน (NO PERSISTENT RED BANNERS & NO SPAM TOASTS)

- ❌ **ห้ามสร้าง Banner สีแดงขนาดใหญ่พาดขวางหน้าจอ** เพื่อแจ้งเตือนรายการผิดปกติทั่วไป
- ❌ **ห้ามใช้ Toast สีแดงหรือสีเหลืองแจ้งเตือนพร่ำเพรื่อ** โดยเฉพาะการแจ้งเตือนที่ผู้ใช้ต้องกลับมาจัดการภายหลัง
- ✅ **Notification ที่ต้องติดตามต้องอยู่ใน Notification Bell มุมขวาบน พร้อม Red Badge Counter แสดงจำนวนรายการตามสถานะจริง**
- ❌ **ห้ามใช้เพียงจุดสีแดงโดยไม่มีตัวเลข** เมื่อมีรายการที่ต้องนับจำนวนและระบบทราบจำนวนดังกล่าว ต้องแสดงเลขจำนวนเสมอ
- ✅ **Notification ต้องแยกตาม APP (App-Scoped Notifications)** ไม่รวมทุกแอปเป็นยอดเดียวกัน
- ❌ **การกด Notification ต้องไม่เปลี่ยนไปอีกแอปโดยอัตโนมัติ** (การกระทำทั้งหมดต้องอยู่ภายในแอปปัจจุบัน)
- หากจำเป็นต้องเปิดข้อมูลจากแอปอื่น ต้องตรวจสอบสิทธิ์ก่อนและแจ้งผู้ใช้อย่างเหมาะสม
- สามารถใช้ Inline Validation, Inline Error และ Feedback ขนาดเล็กได้ หากอยู่ใกล้ส่วนที่เกี่ยวข้องและไม่รบกวนการทำงาน
- Toast สำหรับความสำเร็จทั่วไปอนุญาตได้เมื่อมีประโยชน์ แต่ต้องไม่แสดงซ้ำโดยไม่จำเป็น
- Error สำคัญต้องคงอยู่จนกว่าผู้ใช้จะรับทราบหรือแก้ไขตามความเหมาะสม

## 3. มาตรฐานสีและ Visual Identity (PREMIUM CLEAN ENTERPRISE UI)

ใช้แนวทาง Premium Clean Enterprise UI โดยอ้างอิงภาพตัวอย่าง Ackermann Garage ที่ผู้ใช้ให้ไว้

- Primary Brand: Ackermann Red
- Sidebar: Slate หรือ Charcoal
- Main Background: สีขาวอมเทาอ่อน
- Card Background: สีขาว
- Primary Text: สี Slate เข้ม
- Secondary Text: สี Slate เทากลาง
- Border: สีเทาอ่อน
- Success: สีเขียวที่อ่านง่าย
- Warning: สี Amber ที่ไม่ฉูดฉาด
- Error: สีแดงที่สื่อถึงปัญหาจริง

ค่าเริ่มต้นที่แนะนำ:

- Background: `#F8FAFC`
- Sidebar: `#1E293B`
- Primary Text: `#0F172A`
- Secondary Text: `#64748B`
- Border: `#E2E8F0`
- Primary Red: `#DC2626`
- Success: `#16A34A`
- Warning: `#D97706`

ข้อบังคับ:

- ต้องใช้ Design Tokens กลางสำหรับสีทั้งหมด
- ห้ามกำหนดสีแบบสุ่มในแต่ละหน้า
- ใช้สีแดงกับ Action สำคัญ สถานะที่จำเป็น และเมนูที่กำลังเลือกเท่านั้น
- ห้ามใช้สีแดงกับตัวเลขหรือทุกองค์ประกอบเพียงเพื่อให้เข้ากับแบรนด์
- หลีกเลี่ยง Gradient, Neon, Glow, Shadow หนัก และ Animation ที่ไม่มีประโยชน์
- Badge ต้องเป็น Minimal Badge ที่มีพื้นหลังอ่อนและเส้นขอบชัดเจน
- สถานะสำคัญต้องมีข้อความหรือ Icon ประกอบ ไม่ใช้สีเพียงอย่างเดียว
- ห้ามเปลี่ยน Visual Identity โดยพลการ

## 4. มาตรฐานข้อความภาษาไทยและภาษาอังกฤษ (STRICT BILINGUAL PARENTHESES RULE)

เมื่อแสดงภาษาไทยควบคู่กับภาษาอังกฤษในวงเล็บ ต้องใช้รูปแบบ:

`ภาษาไทย (ภาษาอังกฤษ)`

ตัวอย่างที่ถูกต้อง:

- ✅ ขั้นตอนหลัก (Next Action)
- ✅ ติดต่อลูกค้า (Customer Communication)
- ✅ ของดีเลย์ (Delayed)
- ✅ กระดานสถานะ (Kanban)
- ✅ ปฏิทิน (Calendar)
- ✅ รายการสินค้า (Product List)
- ✅ สิทธิ์การเข้าถึง (Access Permission)

ตัวอย่างที่ไม่ถูกต้อง:

- ❌ Next Action (ขั้นตอนหลัก) — *ห้ามเอาภาษาอังกฤษขึ้นก่อน*
- ❌ Kanban (กระดานสถานะ) — *ห้ามเอาภาษาอังกฤษขึ้นก่อน*
- ❌ ของดีเลย์ (เลยกำหนด) — *ห้ามใช้วงเล็บแบบ ไทย(ไทย) เด็ดขาด ข้อความในวงเล็บต้องเป็นภาษาอังกฤษเท่านั้น*
- ❌ ของถึงร้านแล้ว (รอโทรนัด) — *ผิดกฎเด็ดขาด*
- ❌ นัดวันลูกค้าเข้าทำรถ (ส่งเข้าปฏิทิน Workshop) — *ผิดกฎเด็ดขาด*
- ❌ {ภาษาอังกฤษ} หรือ [ภาษาอังกฤษ] — *ห้ามใช้ปีกกาหรือก้ามปูเด็ดขาด ให้ใช้เฉพาะวงเล็บกลม `(...)` เท่านั้น*

ข้อบังคับเพิ่มเติม:

- ใช้ภาษาไทยเป็นภาษาหลักของ UI สำหรับผู้ใช้งานในประเทศไทย
- ใช้ภาษาอังกฤษกับศัพท์เทคนิคที่จำเป็นและมีความหมายชัดเจน
- ชื่อเมนู ปุ่ม สถานะ และข้อความแจ้งเตือนต้องใช้คำศัพท์เดียวกันทั้งระบบ
- ห้ามใช้คำหลายรูปแบบสำหรับสถานะเดียวกันโดยไม่มีเหตุผล
- ข้อความต้องสั้น กระชับ และสื่อการกระทำได้ทันที
- ห้ามแสดงข้อความ Debug, Stack Trace หรือรายละเอียดทางเทคนิคแก่ผู้ใช้ทั่วไป

### กฎข้อความ Sidebar และ Navigation (SIDEBAR LABELS MUST BE THAI ONLY)

- ข้อความบน Sidebar, เมนูหลัก, เมนูย่อย และ Navigation ทุกแอปต้องแสดงภาษาไทยเท่านั้น
- ลบข้อความภาษาอังกฤษในวงเล็บทั้งหมด เช่น:
  - `งานบริการและช่าง (Workshop)` → `งานบริการและช่าง`
  - `สินค้าและคลังพัสดุ (Inventory & Warehouse)` → `สินค้าและคลังพัสดุ`
  - `การเงินและบัญชี (Finance & Accounting)` → `การเงินและบัญชี`
- ใช้กฎนี้กับ Portal, AppLauncher, Sidebar, Navigation, Breadcrumb และเมนูทุกระดับที่เกี่ยวข้อง
- **ข้อยกเว้น:** เนื้อหาภายในหน้า เช่น ชื่อตาราง ชื่อฟิลด์ ปุ่ม รายละเอียดสินค้า และคำศัพท์ทางเทคนิค ไม่จำเป็นต้องเปลี่ยนเป็นภาษาไทยอย่างเดียว ให้คงรูปแบบทวิภาษา `ภาษาไทย (English)` ตามกฎหลัก
- ห้ามเปลี่ยน internal app IDs, route paths, API names, permission keys หรือ identifiers ที่ระบบใช้ทำงาน

### กฎการลบข้อความไม่จำเป็นบนรูปภาพ (REMOVE UNNECESSARY TEXT FROM IMAGES ACROSS ALL APPS)

- ลบข้อความตกแต่งหรือข้อความที่ซ้ำซ้อนบนภาพ เมื่อไม่ได้ช่วยให้ผู้ใช้เข้าใจข้อมูลหรือใช้งานระบบ
- ลบข้อความ placeholder, label หรือ caption ที่ซ้ำกับชื่อหัวข้อหรือข้อมูลที่แสดงอยู่แล้ว
- ห้ามลบข้อมูลธุรกิจที่จำเป็น เช่น หมายเลขสินค้า ราคา สถานะ หรือข้อความที่จำเป็นต่อการเข้าถึงและการใช้งาน
- ห้ามลบข้อความจากรูปภาพต้นฉบับหรือไฟล์ที่ผู้ใช้อัปโหลดโดยอัตโนมัติ หากข้อความนั้นเป็นส่วนหนึ่งของข้อมูลจริง
- ห้ามสร้างภาพใหม่หรือแก้ไขไฟล์ภาพต้นฉบับโดยไม่มีความจำเป็น
- หากเป็นข้อความ HTML ที่วางซ้อนบนภาพ ให้แก้ที่ component ต้นทางแทนการแก้ภาพ
- ตรวจสอบทั้งภาพที่เป็น static assets และ UI components ที่สร้างภาพหรือข้อความซ้อนแบบ dynamic


## 5. มาตรฐาน Scrollbar (STRICT CLEAN MINIMAL SCROLLBARS)

ทุกพื้นที่ที่สามารถ Scroll ต้องใช้ Clean Modern Slim Scrollbar

- ความกว้างหรือความสูงประมาณ 6px
- Track เป็น Transparent
- Thumb ใช้สี `#CBD5E1`
- Hover ใช้สี `#94A3B8`
- Border Radius: `999px`
- Sidebar ต้องซ่อน Scrollbar แต่ยังสามารถ Scroll ได้ตามปกติ (`scrollbar-width: none !important;`)
- ต้องรองรับ Mouse Wheel, Touchpad, Touch และ Keyboard ตามความเหมาะสม
- ต้องใช้ Global CSS หรือ Shared Utility Class เช่น `.clean-modal-scrollbar`
- ใช้ `scrollbar-width: none` สำหรับ Sidebar ที่ต้องซ่อน Scrollbar
- ห้ามใช้ Overflow Hidden เพื่อปกปิดปัญหา Layout
- หลีกเลี่ยงการสร้าง Scroll ซ้อนกันหลายชั้นโดยไม่มีเหตุผล
- Dropdown, Modal และ Drawer ต้องไม่ถูกตัดขอบหรือถูก Container อื่นบัง

## 6. มาตรฐานวันที่และเวลา (STRICT DATE & TIME FORMAT)

วันที่ทั้งหมดที่แสดงให้ผู้ใช้เห็นต้องเป็นรูปแบบวัน/เดือน/ปีเท่านั้น (`DD/MM/YYYY` หรือ `DD/MM/yy`)

รูปแบบที่อนุญาต:

- `11/10/2026`
- `11/10/26`
- `11/10/2026 (19.12)`
- `11/10/2026 (21.50)`

กฎเวลา:

- ใช้รูปแบบ 24 ชั่วโมง
- หากมีเวลาต่อท้ายวันที่ ต้องใช้วงเล็บและจุดคั่นระหว่างชั่วโมงกับนาที เช่น `(19.12)`
- ❌ **ห้ามแสดงวินาทีใน UI เด็ดขาด** (เช่น ❌ `19:12:35`)
- ❌ **ห้ามแสดงวันที่รูปแบบปี/เดือน/วันใน UI** เช่น `2026-10-11` หรือ `2026/10/11`
- Date Picker ต้องแสดงวันที่ตามมาตรฐานเดียวกัน
- Table, Dashboard, Modal, Notification, Report และเอกสารที่แสดงภายในระบบต้องใช้รูปแบบสอดคล้องกัน
- ข้อมูลวันที่ที่ส่งให้ Backend หรือ Database สามารถใช้ ISO 8601 หรือรูปแบบมาตรฐานที่เหมาะสมได้ โดยต้องแปลงก่อนแสดงผล
- ต้องจัดการ Time Zone ให้ถูกต้อง โดยใช้เขตเวลาที่ระบบกำหนด เช่น `Asia/Bangkok`
- ห้ามแปลงวันที่จนเกิดความคลาดเคลื่อนข้ามวัน
- การเรียงลำดับวันที่ต้องใช้ค่าจริงของวันที่ ไม่ใช่เรียงตามข้อความที่แสดง

---

# PART 2 — LAYOUT AND COMPONENT STANDARDS

## 7. มาตรฐาน Layout ของทุก APP
## 8. มาตรฐาน Spacing และขนาด Component
## 9. มาตรฐาน Typography
## 10. มาตรฐาน Dashboard และ KPI
## 11. มาตรฐาน Data Table
## 12. มาตรฐาน Modal, Drawer และ Form
## 13. มาตรฐาน Notification และ Feedback
## 14. มาตรฐาน Sidebar และ Navigation
## 15. มาตรฐาน Responsive และ Accessibility

---

# PART 3 — ACKERMANN HUB MULTI-APP ARCHITECTURE

## 16. โครงสร้างระบบหลายแอป (MULTI-APP ARCHITECTURE)
## 17. มาตรฐาน Role-Based Access Control (RBAC)
## 18. มาตรฐาน Login และ Session
## 19. มาตรฐานหน้า Ackermann Hub
## 20. มาตรฐาน Notification แบบ App-Scoped

---

# PART 4 — AUTOMOTIVE GARAGE BUSINESS RULES

## 21. มาตรฐานข้อมูลและ Workflow ของอู่รถยนต์
## 22. มาตรฐานการเชื่อมโยงข้อมูลระหว่างแอป
## 23. มาตรฐานความถูกต้องของข้อมูล

---

# PART 5 — CODE QUALITY & CHANGE MANAGEMENT

## 24. มาตรฐาน Shared Components และ Design Tokens
## 25. ห้ามเปลี่ยนโครงสร้างระบบโดยไม่จำเป็น
## 26. มาตรฐานการแก้ไขงานของ AI Coding Agent
## 27. มาตรฐาน Regression Testing

---

# PART 6 — FINAL QUALITY GATE

## 28. UI/UX Checklist
## 29. Security Checklist
## 30. ERP Integrity Checklist
## 31. กฎสูงสุดของ Ackermann Garage ERP

(ดูรายละเอียดฉบับเต็มได้ที่ `AGENTS.md`)
