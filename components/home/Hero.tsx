"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const MARQUEE_IMAGES = Array.from({ length: 16 }, (_, i) => `/images/marquee-${i + 1}.webp`);

const SCROLL_SPEED = 1; // px per frame

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!isDragging.current) {
        track.scrollLeft += SCROLL_SPEED;
        // Loop seamlessly — content is duplicated so halfway = full loop
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animFrame.current = requestAnimationFrame(step);
    };

    animFrame.current = requestAnimationFrame(step);
    return () => {
      if (animFrame.current !== null) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const delta = e.pageX - startX.current;
    trackRef.current.scrollLeft = scrollStart.current - delta;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

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
            {/* Caption ที่ลูกค้าเลือก */}
            <span className="block">{"เหนือชั้น"}</span>
            <span className="text-primary">{"ทุกการขับขี่"}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-secondary">
            {"ครบจบในที่เดียว ช่วงล่าง โช๊คอัพ เบรก ล้อ ยาง ด้วยสินค้าคุณภาพและช่างผู้เชี่ยวชาญจาก Ackermann Garage"}
          </p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex rounded-full bg-primary px-10 py-4 font-medium text-white transition hover:bg-primary-hover"
          >
            {"จองคิวเลย"}
          </Link>
        </div>
      </div>

      {/* Drag-scrollable brand strip */}
      <div
        ref={trackRef}
        className={[
          "overflow-x-scroll border-y border-border bg-surface py-6 select-none",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
        ].join(" ")}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div className="flex w-max gap-4">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="แบรนด์รถที่ Ackermann Garage ดูแล"
              width={280}
              height={200}
              draggable={false}
              className="h-32 w-auto rounded-lg object-cover sm:h-40 pointer-events-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
