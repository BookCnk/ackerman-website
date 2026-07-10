import Image from "next/image";
import Link from "next/link";

const MARQUEE_IMAGES = Array.from({ length: 16 }, (_, i) => `/images/marquee-${i + 1}.webp`);

export default function Hero() {
  return (
    <section id="home">
      <div className="relative flex min-h-dvh items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="relative z-10 max-w-3xl px-4 text-center">
          <h1 className="font-heading text-5xl font-bold sm:text-6xl lg:text-8xl">
            ดีเทลลิ่ง
            <span className="text-primary">ระดับพรีเมียม</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-secondary">
            Ackermann Garage ดูแลรถของคุณอย่างพิถีพิถันทุกรายละเอียด
            คืนความเงางามและปกป้องสีรถให้เหมือนวันแรกที่ออกจากโชว์รูม
          </p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex rounded-full bg-primary px-10 py-4 font-medium text-white transition hover:bg-primary-hover"
          >
            จองคิวเลย
          </Link>
        </div>
      </div>

      <div className="overflow-hidden border-y border-border bg-surface py-6">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="ผลงานดีเทลลิ่งของ Ackerman"
              width={280}
              height={200}
              className="h-32 w-auto rounded-lg object-cover sm:h-40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
