import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const FEATURES = [
  {
    number: "01",
    title: "ช่างผู้เชี่ยวชาญ",
    description: "ทีมช่างเฉพาะทางผ่านการฝึกฝนและมีประสบการณ์ด้านการตกแต่งรถหลายปี ดูแลทุกงานด้วยความรู้จริง",
  },
  {
    number: "02",
    title: "แพ็กเกจตามใจคุณ",
    description: "เลือกบริการได้ตามสภาพรถและงบประมาณของคุณ ปรึกษาฟรีก่อนตัดสินใจทุกครั้ง",
  },
  {
    number: "03",
    title: "ราคาคุ้มค่า",
    description: "ราคาแข่งขันได้ ไม่มีค่าใช้จ่ายแอบแฝง ใช้สินค้าคุณภาพในราคาที่คุ้มทุกบาท",
  },
  {
    number: "04",
    title: "ดูแลหลังบริการ",
    description: "แนะนำการดูแลรักษาหลังใช้บริการ ให้รถขับดี ดูดี และใช้งานได้ยาวนานที่สุด",
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
            {"อยากให้รถขับดีขึ้น ดูดีขึ้น?"}
          </h2>
          <Link
            href="/#contact"
            className="mt-8 inline-flex rounded-full bg-primary px-10 py-4 font-medium text-white transition hover:bg-primary-hover"
          >
            {"จองคิวเลย"}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          subtitle="เชื่อถือได้ ราคาคุ้มค่า"
          title="ทำไมต้องเลือก Ackermann Garage?"
          description="ครอบคลุมทุกงานตกแต่งรถ ตั้งแต่ช่วงล่าง ฟิล์ม แลปสี ไปจนถึงอุปกรณ์ภายใน ด้วยความแม่นยำและมาตรฐานระดับพรีเมียม"
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
