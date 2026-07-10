import Image from "next/image";
import SectionHeading from "./SectionHeading";

const TESTIMONIALS = [
  {
    avatar: "/images/avatar-1.webp",
    name: "คุณสมชาย วงศ์สว่าง",
    date: "22 ธ.ค. 2025",
    rating: 5,
    quote:
      "ทำความสะอาดภายในดีมาก คราบและขนสัตว์เลี้ยงหายเกลี้ยง รถหอมสดชื่นเหมือนใหม่ แนะนำเลยครับ",
  },
  {
    avatar: "/images/avatar-2.webp",
    name: "คุณนภา ศรีสุข",
    date: "18 ธ.ค. 2025",
    rating: 4,
    quote:
      "รถดูใหม่เอี่ยมหลังใช้บริการ full detail ทุกซอกทุกมุมสะอาดหมดจด ทีมงานใส่ใจรายละเอียดและเป็นกันเองมากค่ะ",
  },
  {
    avatar: "/images/avatar-3.webp",
    name: "คุณกิตติ พงษ์ประเสริฐ",
    date: "10 ธ.ค. 2025",
    rating: 5,
    quote:
      "ภายในสะอาด ห้องเครื่องเงาวับ ทีมงานทำงานเร็ว มืออาชีพ เห็นได้ชัดว่ารักในงานที่ทำจริง ๆ",
  },
  {
    avatar: "/images/avatar-4.webp",
    name: "คุณอารยา ธนบดี",
    date: "2 ธ.ค. 2025",
    rating: 5,
    quote:
      "จองคิวง่ายมาก ช่างมาตรงเวลา สุภาพ ส่งมอบรถ SUV กลับมาเงาวับทั้งภายในและภายนอก ประทับใจค่ะ",
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
              “{t.quote}”
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
