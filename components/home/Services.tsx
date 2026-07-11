import Image from "next/image";
import SectionHeading from "./SectionHeading";

const SERVICES = [
  {
    image: "/images/service-1.webp",
    title: "ช่วงล่าง & โช๊คอัพ",
    description:
      "อัพเกรดและซ่อมบำรุงช่วงล่างครบวงจร โช๊คอัพ สปริง บูช ลูกหมาก พร้อม Wheel Alignment และ Wheel Balancing โดยช่างเฉพาะทาง",
  },
  {
    image: "/images/service-2.webp",
    title: "ฟิล์มกระจก & ฟิล์มใส (PPF)",
    description:
      "ฟิล์มกรองแสง UV ลดความร้อนภายในห้องโดยสาร และฟิล์มใส PPF ติดตัวถังป้องกันรอยขีดข่วนและสีร่อนจากเศษหินระหว่างการขับขี่",
  },
  {
    image: "/images/service-3.webp",
    title: "แลปสี & เปลี่ยนสีรถ",
    description:
      "Vinyl Wrap คุณภาพสูง เปลี่ยนสีรถหรือเพิ่มลายได้โดยไม่ต้องพ่นสี ถอดออกได้เมื่อต้องการโดยไม่ทำลายสีเดิม มีสีและ Finish ให้เลือกหลายร้อยแบบ",
  },
  {
    image: "/images/service-4.webp",
    title: "Body Kit & ชิ้นส่วนภายนอก",
    description:
      "ชุดแต่ง Body Kit สเกิร์ตหน้า-หลัง ข้าง สปอยเลอร์ และชิ้นส่วนตกแต่งภายนอก สไตล์ Sport หรือ Luxury ตามต้องการ",
  },
  {
    image: "/images/service-5.webp",
    title: "ระบบเครื่องยนต์ & ท่อ",
    description:
      "เปลี่ยนกรองอากาศ Cold Air Intake ท่อไอเสีย และอุปกรณ์เสริมสมรรถนะ เพิ่มความสนุกในการขับขี่และเสียงไอเสียที่ดุดันขึ้น",
  },
  {
    image: "/images/service-6.webp",
    title: "ตกแต่งภายใน",
    description:
      "อัพเกรดห้องโดยสารด้วยพวงมาลัยสปอร์ต เบาะปรับได้ พรม แผงประตู และอุปกรณ์ตกแต่งภายในสไตล์ Racing หรือ Luxury",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="ยินดีต้อนรับสู่ Ackermann Garage"
          title="บริการตกแต่งรถครบวงจร"
          description="ครอบคลุมทุกงานตกแต่งรถ ตั้งแต่ช่วงล่าง ฟิล์ม แลปสี Body Kit ไปจนถึงอุปกรณ์ภายใน ด้วยสินค้าคุณภาพและช่างผู้เชี่ยวชาญเฉพาะทาง"
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
