import Image from "next/image";
import SectionHeading from "./SectionHeading";

const IMAGES = Array.from({ length: 8 }, (_, i) => `/images/insta-${i + 1}.webp`);

export default function InstagramGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading subtitle="อินสตาแกรมของเรา" title="@ackerman.detailing" />
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {IMAGES.map((src) => (
          <a
            key={src}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt="ผลงานจากอินสตาแกรม Ackerman"
              width={400}
              height={400}
              className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
