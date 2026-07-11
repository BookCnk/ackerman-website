import SectionHeading from "./SectionHeading";

const FAQS = [
  {
    question: "โช๊คอัพต้องเปลี่ยนเมื่อไหร่?",
    answer:
      "สังเกตได้จากรถโคลงมากขึ้น ช่วงล่างนุ่มผิดปกติ หรือมีเสียงดังเวลาขับผ่านหลุมบ่อ โดยทั่วไปแนะนำตรวจเช็กทุก 50,000 กม. หรือทุก 2-3 ปี ขึ้นอยู่กับสภาพการใช้งาน",
  },
  {
    question: "ฟิล์มใส (PPF) กับฟิล์มกระจกต่างกันอย่างไร?",
    answer:
      "ฟิล์มใส PPF ติดที่ตัวถังรถเพื่อป้องกันรอยขีดข่วน รอยนิ้ว และสีร่อนจากเศษหิน ส่วนฟิล์มกระจกติดที่กระจกเพื่อกรอง UV และลดความร้อนภายในห้องโดยสาร ใช้คนละจุดและต่างวัตถุประสงค์กัน",
  },
  {
    question: "แลปสีถอดออกได้ไหม ทำลายสีเดิมไหม?",
    answer:
      "Vinyl Wrap สามารถถอดออกได้โดยไม่ทำลายสีเดิม เหมาะสำหรับผู้ที่ต้องการเปลี่ยนสีชั่วคราวหรือทดลองลุค แต่ต้องให้ช่างที่มีประสบการณ์ถอดให้ เพื่อป้องกันความเสียหาย",
  },
  {
    question: "Wheel Alignment ต้องทำบ่อยแค่ไหน?",
    answer:
      "แนะนำทุก 10,000–20,000 กม. หรือหลังเปลี่ยนยาง เปลี่ยนช่วงล่าง หรือรถชนกระแทกแรง การ Align ที่ถูกต้องช่วยให้ยางสึกสม่ำเสมอ ขับตรง และประหยัดน้ำมันมากขึ้น",
  },
  {
    question: "แต่ละงานใช้เวลานานแค่ไหน?",
    answer:
      "งานเร็ว เช่น เปลี่ยนยาง กรองอากาศ หรือโช๊คอัพ ใช้เวลา 1–3 ชั่วโมง งานกลาง เช่น ติดฟิล์มหรือ Alignment ใช้ครึ่งวัน งานใหญ่ เช่น แลปสีหรือ Body Kit อาจใช้ 1–3 วัน ขึ้นอยู่กับขอบเขตงาน",
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
