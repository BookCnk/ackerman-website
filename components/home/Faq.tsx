import SectionHeading from "./SectionHeading";

const FAQS = [
  {
    question: "ดีเทลลิ่งรถยนต์คืออะไร?",
    answer:
      "คือการทำความสะอาดและฟื้นฟูสภาพรถอย่างละเอียดทุกจุด ทั้งภายนอกและภายใน ตั้งแต่ล้าง ขัด เคลือบ ไปจนถึงดูแลห้องเครื่อง เพื่อให้รถกลับมาใกล้เคียงสภาพใหม่ที่สุด",
  },
  {
    question: "ควรทำดีเทลลิ่งบ่อยแค่ไหน?",
    answer:
      "แนะนำทุก 4-6 เดือนสำหรับการใช้งานทั่วไป หากรถจอดกลางแจ้งโดนแดดฝนบ่อยหรือใช้งานหนัก อาจถี่ขึ้นเป็นทุก 3 เดือน",
  },
  {
    question: "บริการ Full Detail มีอะไรบ้าง?",
    answer:
      "ครอบคลุมล้างรถด้วยมือ เคลือบแว็กซ์ ทำความสะอาดภายในแบบล้ำลึก ขัดลบรอยสี ดีเทลห้องเครื่อง และฟื้นฟูไฟหน้า ครบจบในที่เดียว",
  },
  {
    question: "ดีเทลลิ่งช่วยลบรอยขีดข่วนและคราบได้ไหม?",
    answer:
      "รอยขนแมวและรอยตื้นลบได้ด้วยการขัดสี ส่วนคราบภายในส่วนใหญ่ขจัดได้ด้วยการซักและอบไอน้ำ แต่รอยลึกถึงชั้นสีรองพื้นอาจต้องทำสีเพิ่มเติม",
  },
  {
    question: "ใช้เวลานานแค่ไหนต่อครั้ง?",
    answer:
      "ล้าง + เคลือบแว็กซ์ประมาณ 2-3 ชั่วโมง ส่วน Full Detail หรือเคลือบเซรามิกอาจใช้เวลา 1-2 วัน ขึ้นอยู่กับขนาดและสภาพรถ",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading subtitle="ทุกเรื่องที่ควรรู้" title="คำถามที่พบบ่อย" />
        <div className="mt-14 flex flex-col gap-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-background px-6 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="text-xl text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
