import Image from "next/image";
import Link from "next/link";

const COMPANY_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/#about", label: "เกี่ยวกับเรา" },
  { href: "/#services", label: "บริการ" },
  { href: "/#testimonials", label: "รีวิว" },
  { href: "/#faq", label: "คำถามที่พบบ่อย" },
];

const SERVICE_LINKS = [
  "ล้างรถด้วยมือ & เคลือบแว็กซ์",
  "ทำความสะอาดภายในแบบล้ำลึก",
  "ขัดลบรอยสี",
  "เคลือบเซรามิก",
  "ดีเทลห้องเครื่อง",
  "ฟื้นฟูไฟหน้า",
];

const SOCIALS = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
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
            เรามุ่งมั่นให้บริการดีเทลลิ่งรถยนต์คุณภาพสูงอย่างมืออาชีพ
            ตั้งแต่ล้างรถด้วยมือจนถึงเคลือบเซรามิกขั้นสูง
            เพื่อให้รถของคุณดูดีที่สุดและคงมูลค่ายาวนาน
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
          <h3 className="font-heading text-lg font-semibold">เมนู</h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-muted transition hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold">บริการของเรา</h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {SERVICE_LINKS.map((service) => (
              <li key={service}>
                <Link href="/#services" className="text-muted transition hover:text-foreground">
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
              <span className="block font-medium text-foreground">สำนักงานใหญ่</span>
              123 ถนนสุขุมวิท แขวงคลองเตย
              <br />
              เขตคลองเตย กรุงเทพฯ 10110
            </p>
            <p>
              <span className="block font-medium text-foreground">โทรศัพท์</span>
              <a href="tel:021234567" className="transition hover:text-foreground">
                02-123-4567
              </a>
            </p>
            <p>
              <span className="block font-medium text-foreground">อีเมล</span>
              <a href="mailto:contact@ackerman.co.th" className="transition hover:text-foreground">
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
            <a href="#" className="transition hover:text-foreground">
              ข้อกำหนดการใช้งาน
            </a>
            {" · "}
            <a href="#" className="transition hover:text-foreground">
              นโยบายความเป็นส่วนตัว
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
