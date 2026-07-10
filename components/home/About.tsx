import Image from "next/image";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/images/about-1.webp"
            alt="ทีมงาน Ackerman กำลังดีเทลรถ"
            width={759}
            height={1024}
            className="rounded-xl object-cover"
          />
          <Image
            src="/images/about-2.webp"
            alt="การเคลือบสีรถอย่างพิถีพิถัน"
            width={759}
            height={1024}
            className="mt-10 rounded-xl object-cover"
          />
        </div>

        <div>
          <SectionHeading
            align="left"
            subtitle="เกี่ยวกับเรา"
            title="คืนความเงางาม ทั้งภายนอกและภายใน"
            description="ที่ Ackermann Garage เราหลงใหลในการทำให้รถทุกคันดูดีที่สุด ตั้งแต่การขัดสีให้เงางามระดับโชว์รูม ไปจนถึงการทำความสะอาดภายในแบบล้ำลึก ทีมช่างมืออาชีพของเราส่งมอบงานที่ไร้ที่ติด้วยความใส่ใจและแม่นยำทุกขั้นตอน"
          />
          <div className="mt-8 inline-flex items-baseline gap-3 rounded-xl border border-border bg-surface px-8 py-6">
            <span className="font-heading text-4xl font-bold text-primary sm:text-5xl">
              65,250+
            </span>
            <span className="text-muted">ชั่วโมงประสบการณ์</span>
          </div>
        </div>
      </div>
    </section>
  );
}
