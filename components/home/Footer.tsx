import Image from "next/image";
import Link from "next/link";

const COMPANY_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/shop", label: "เลือกสินค้า & เช็คราคา" },
  { href: "/showcase", label: "ผลงานร้าน (Build Gallery)" },
  { href: "/booking", label: "จองคิว & โอนมัดจำ" },
  { href: "/garage", label: "รถของฉัน (My Garage)" },
];

const SERVICE_LINKS = [
  "ช่วงล่าง & โช๊คอัพ (Öhlins / KW)",
  "ระบบเบรก Performance (Brembo)",
  "ล้อแม็กฟอร์จ & ยาง (BBS / Michelin)",
  "ท่อไอเสียไทเทเนียม (Akrapovič)",
  "ฟิล์มใสกันรอย (STEK Full PPF)",
  "ตั้งศูนย์ 3D & Corner Weight",
];

const SOCIALS = [
  { href: "https://www.facebook.com/profile.php?id=61579339495604", label: "Facebook" },
  { href: "https://www.instagram.com/ackermannthailand/", label: "Instagram" },
  { href: "https://line.me", label: "LINE" },
  { href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Image
            src="/logo.png"
            alt="Ackermann Garage"
            width={1774}
            height={887}
            className="h-14 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            ศูนย์บริการแต่งรถยนต์และอัปเกรดสมรรถนะครบวงจร ช่วงล่าง เบรก ล้อฟอร์จ ท่อไอเสีย
            และฟิล์มใส PPF เชื่อมต่อระบบเช็คสต็อกและจองคิวช่องซ่อมเข้าสู่ Ackermann ERP อัตโนมัติ
          </p>
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition hover:text-primary"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">ระบบออนไลน์</h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">บริการของเรา</h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {SERVICE_LINKS.map((service) => (
              <li key={service}>
                <Link
                  href="/shop"
                  className="text-muted transition hover:text-foreground"
                >
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">ติดต่อเรา</h3>
          <address className="mt-4 flex flex-col gap-3 text-sm not-italic text-muted">
            <p>
              <span className="block font-medium text-foreground">
                Ackermann Garage (สำนักงานใหญ่)
              </span>
              123 ถนนสุขุมวิท แขวงคลองเตย
              <br />
              เขตคลองเตย กรุงเทพฯ 10110
            </p>
            <p className="tabular-nums">
              <span className="block font-medium text-foreground">โทรศัพท์</span>
              <a
                href="tel:021234567"
                className="transition hover:text-foreground"
              >
                02-123-4567
              </a>
            </p>
            <p>
              <span className="block font-medium text-foreground">อีเมล</span>
              <a
                href="mailto:contact@ackerman.co.th"
                className="transition hover:text-foreground"
              >
                contact@ackerman.co.th
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Ackermann Garage สงวนลิขสิทธิ์</p>
          <p>
            <Link href="/garage" className="transition hover:text-foreground">
              ตรวจสอบสถานะงานซ่อม & ใบรับประกัน
            </Link>
            {" · "}
            <Link href="/booking" className="transition hover:text-foreground">
              เงื่อนไขการมัดจำจองคิว
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
