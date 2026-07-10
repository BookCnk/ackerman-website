import Image from "next/image";
import SectionHeading from "./SectionHeading";

const SERVICES = [
  {
    image: "/images/service-1.webp",
    title: "ล้างรถด้วยมือ & เคลือบแว็กซ์",
    description:
      "ล้างรถด้วยมืออย่างอ่อนโยนด้วยแชมพูสูตร pH สมดุล ตามด้วยแว็กซ์เกรดพรีเมียม ปกป้องสีรถและเพิ่มความเงางามยาวนาน",
  },
  {
    image: "/images/service-2.webp",
    title: "ทำความสะอาดภายในแบบล้ำลึก",
    description:
      "ซักเบาะ พรม และเพดาน ขจัดคราบและกลิ่นทุกซอกมุมด้วยไอน้ำและแชมพูเฉพาะทาง ให้ห้องโดยสารสะอาดสดชื่นเหมือนรถใหม่",
  },
  {
    image: "/images/service-3.webp",
    title: "ขัดลบรอยสี (Paint Correction)",
    description:
      "ขัดลบรอยขนแมวและความหมองคล้ำด้วยเครื่องมือเฉพาะทาง คืนความเงาลึกให้สีรถเหมือนวันออกจากโชว์รูม",
  },
  {
    image: "/images/service-4.webp",
    title: "เคลือบเซรามิก",
    description:
      "เคลือบเซรามิกคุณสมบัติไม่ชอบน้ำ ปกป้องจากรังสี UV ฝุ่น และรอยขีดข่วน ทำความสะอาดง่าย เงางามยาวนานหลายปี",
  },
  {
    image: "/images/service-5.webp",
    title: "ดีเทลห้องเครื่อง",
    description:
      "ล้างคราบน้ำมันและเคลือบเงาห้องเครื่องอย่างมืออาชีพ ช่วยให้ตรวจเช็คง่ายขึ้นและเพิ่มมูลค่าตอนขายต่อ",
  },
  {
    image: "/images/service-6.webp",
    title: "ฟื้นฟูไฟหน้า",
    description:
      "ขัดและเคลือบไฟหน้าที่ขุ่นมัวให้กลับมาใสเหมือนใหม่ เพิ่มทัศนวิสัยและความปลอดภัยในการขับขี่ยามค่ำคืน",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="ยินดีต้อนรับสู่ Ackermann Garage"
          title="บริการดีเทลลิ่งระดับพรีเมียม"
          description="ตั้งแต่ทำความสะอาดภายในแบบล้ำลึก จนถึงเคลือบเซรามิกที่ปกป้องยาวนาน เราฟื้นฟูและปกป้องรถของคุณด้วยความแม่นยำ ใส่ใจ และมุ่งมั่นสู่ความสมบูรณ์แบบ"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-xl border border-border bg-background"
            >
              <div className="overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={640}
                  height={420}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
