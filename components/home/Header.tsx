"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/#about", label: "เกี่ยวกับเรา" },
  { href: "/#services", label: "บริการ" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/#testimonials", label: "รีวิว" },
  { href: "/#faq", label: "คำถามที่พบบ่อย" },
  { href: "/#contact", label: "ติดต่อเรา" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`hidden border-b transition-colors duration-300 md:block ${
          solid ? "border-border bg-surface" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm text-muted sm:px-6 lg:px-8">
          <p>
            <span className="font-semibold text-primary">โปรโมชั่น:</span>{" "}
            สมาชิกใหม่รับส่วนลด 50% ทุกบริการ
          </p>
          <div className="flex items-center gap-6">
            <a href="tel:021234567" className="transition hover:text-foreground">
              โทร: 02-123-4567
            </a>
            <a
              href="mailto:contact@ackerman.co.th"
              className="transition hover:text-foreground"
            >
              contact@ackerman.co.th
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-colors duration-300 ${
          solid
            ? "border-border bg-background/95 backdrop-blur"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Ackermann Garage"
              width={1774}
              height={887}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/#contact"
              className="hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover sm:inline-flex"
            >
              จองคิวเลย
            </Link>
            <button
              type="button"
              aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-border lg:hidden"
            >
              <span
                className={`h-0.5 w-5 bg-foreground transition ${open ? "translate-y-1 rotate-45" : ""}`}
              />
              <span className={`h-0.5 w-5 bg-foreground transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-0.5 w-5 bg-foreground transition ${open ? "-translate-y-3 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-muted transition hover:bg-surface hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-full bg-primary px-6 py-2.5 text-center font-medium text-white transition hover:bg-primary-hover"
                >
                  จองคิวเลย
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
