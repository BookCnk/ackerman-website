import Image from "next/image";
import SectionHeading from "./SectionHeading";

const TESTIMONIALS = [
  {
    avatar: "/images/avatar-1.webp",
    name: "คุณสมชาย วงศ์สว่าง",
    date: "22 ธ.ค. 2025",
    rating: 5,
    quote:
      "เปลี่ยนโช๊คอัพแล้วรู้สึกต่างทันที รถนุ่มขึ้น แน่นขึ้น ขับสนุกกว่าเดิมมาก ช่างแนะนำดีมาก ไม่ขายของเกินจำเป็นครับ",
  },
  {
    avatar: "/images/avatar-2.webp",
    name: "คุณนภา ศรีสุข",
    date: "18 ธ.ค. 2025",
    rating: 5,
    quote:
      "ติดฟิล์มกระจกแล้วร้อนน้อยลงชัดเจนเลยค่ะ แปะได้เรียบสวย ไม่มีฟอง ช่างละเอียด ทำงานสะอาดมาก",
  },
  {
    avatar: "/images/avatar-3.webp",
    name: "คุณกิตติ พงษ์ประเสริฐ",
    date: "10 ธ.ค. 2025",
    rating: 5,
    quote:
      "แลปสีเปลี่ยนหน้าตารถไปเลยครับ งานเรียบ สีสม่ำเสมอ ไม่มีรอยแผ่น เหมือนรถใหม่เลย ประทับใจมาก",
  },
  {
    avatar: "/images/avatar-4.webp",
    name: "คุณอารยา ธนบดี",
    date: "2 ธ.ค. 2025",
    rating: 4,
    quote:
      "ทำ Body Kit กับเปลี่ยนล้อแม็กพร้อมกัน ออกมาสวยเกินคาดค่ะ ช่างให้คำแนะนำดีมาก ช่วยคุมงบให้ได้ด้วย",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div aria-label={`${rating} จาก 5 ดาว`} className="text-primary">
      {"★".repeat(rating)}
      <span className="text-muted">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading subtitle="รีวิวจากลูกค้า" title="ลูกค้าพูดถึงเรา" />
      <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="w-[85%] shrink-0 snap-start rounded-xl border border-border bg-surface p-6 sm:w-[46%] lg:w-[31%]"
          >
            <div className="flex items-center gap-4">
              <Image
                src={t.avatar}
                alt={t.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <figcaption>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-muted">{t.date}</p>
              </figcaption>
            </div>
            <div className="mt-4">
              <Stars rating={t.rating} />
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-muted">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
