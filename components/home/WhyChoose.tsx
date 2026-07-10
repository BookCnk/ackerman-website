import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const FEATURES = [
  {
    number: "01",
    title: "ช่างผู้เชี่ยวชาญ",
    description: "ทีมดีเทลเลอร์มืออาชีพ ผ่านการฝึกฝนและมีประสบการณ์ดูแลรถหลายปี",
  },
  {
    number: "02",
    title: "แพ็กเกจตามใจคุณ",
    description: "เลือกบริการได้ตามสภาพรถและความต้องการของคุณโดยเฉพาะ",
  },
  {
    number: "03",
    title: "ราคาคุ้มค่า",
    description: "ราคาแข่งขันได้ ไม่มีค่าใช้จ่ายแอบแฝง คุณภาพเต็มทุกบาททุกสตางค์",
  },
  {
    number: "04",
    title: "ดูแลหลังบริการ",
    description: "แนะนำวิธีดูแลรักษารถหลังใช้บริการ ให้รถสวยเงางามได้นานที่สุด",
  },
];

export default function WhyChoose() {
  return (
    <section>
      <div className="relative overflow-hidden py-20 lg:py-28">
        <Image
          src="/images/cta-bg.webp"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            อยากให้รถกลับมาเงาเหมือนใหม่?
          </h2>
          <Link
            href="/#contact"
            className="mt-8 inline-flex rounded-full bg-primary px-10 py-4 font-medium text-white transition hover:bg-primary-hover"
          >
            จองคิวเลย
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          subtitle="เชื่อถือได้ ราคาคุ้มค่า"
          title="ทำไมต้องเลือก Ackermann Garage?"
          description="ตั้งแต่ทำความสะอาดภายในจนถึงเคลือบเซรามิก เราดูแลรถของคุณด้วยความแม่นยำ ใส่ใจ และมุ่งมั่นสู่ความสมบูรณ์แบบ"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.number} className="rounded-xl border border-border bg-surface p-6">
              <span className="font-heading text-4xl font-bold text-primary">
                {feature.number}
              </span>
              <h3 className="mt-4 font-heading text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
