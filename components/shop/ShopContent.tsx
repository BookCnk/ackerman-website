"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Product = {
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  rating?: number;
  category: string;
  brand: string;
};

const PRODUCTS: Product[] = [
  {
    name: "3D Pink Car Soap – pH Balanced Formula",
    image: "/images/products/soap-2a.webp",
    price: 29.92,
    rating: 5,
    category: "แชมพูล้างรถ",
    brand: "Wax 3D",
  },
  {
    name: "Black Magic All Wheel Foaming Cleaner",
    image: "/images/products/tire-1a.webp",
    price: 6.49,
    category: "น้ำยาล้างยาง & ล้อ",
    brand: "Turtle",
  },
  {
    name: "Formula 1 Bug & Tar Remover – 16oz",
    image: "/images/products/wax-2a.webp",
    price: 6.99,
    category: "แว็กซ์ & ซีลแลนท์",
    brand: "Formula 1",
  },
  {
    name: "Formula 1 Detail Express Multi-Purpose Interior Cleaner",
    image: "/images/products/interior-1a.webp",
    price: 24.99,
    category: "น้ำยาทำความสะอาดภายใน",
    brand: "Detail Express",
  },
  {
    name: "Kenolon Ceramic Shield V1 Box – SiO₂ Coating Kit",
    image: "/images/products/coating-1a.webp",
    price: 59.65,
    category: "ชุดเคลือบเซรามิก",
    brand: "Kenolon",
  },
  {
    name: "Meguiar's DA Microfiber Correction & Finishing Kit",
    image: "/images/products/coating-1b.webp",
    price: 129.0,
    category: "ผ้าไมโครไฟเบอร์",
    brand: "Meguiar's",
  },
  {
    name: "Meguiar's Gold Class Car Wash Shampoo",
    image: "/images/products/soap-1a.webp",
    price: 11.99,
    rating: 5,
    category: "แชมพูล้างรถ",
    brand: "Meguiar's",
  },
  {
    name: "Nanoskin NANO SUDS Wash & Shine Shampoo",
    image: "/images/products/soap-3a.webp",
    price: 32.99,
    salePrice: 28.99,
    category: "แชมพูล้างรถ",
    brand: "SONAX",
  },
];

const CATEGORIES = [
  "แชมพูล้างรถ",
  "ชุดเคลือบเซรามิก",
  "แปรงดีเทลลิ่ง",
  "น้ำยาทำความสะอาดภายใน",
  "ผ้าไมโครไฟเบอร์",
  "น้ำยาล้างยาง & ล้อ",
  "แว็กซ์ & ซีลแลนท์",
];

const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();

const SORT_OPTIONS = [
  { value: "default", label: "เรียงลำดับเริ่มต้น" },
  { value: "rating", label: "เรียงตามคะแนนรีวิว" },
  { value: "price-asc", label: "เรียงตามราคา: ต่ำไปสูง" },
  { value: "price-desc", label: "เรียงตามราคา: สูงไปต่ำ" },
];

const price = (n: number) => `$${n.toFixed(2)}`;

function Stars({ rating }: { rating: number }) {
  return (
    <div aria-label={`${rating} จาก 5 ดาว`} className="text-sm text-primary">
      {"★".repeat(rating)}
      <span className="text-muted">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

export default function ShopContent() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const items = PRODUCTS.filter((p) => {
      const current = p.salePrice ?? p.price;
      return (
        current >= min &&
        current <= max &&
        (!category || p.category === category) &&
        (!brand || p.brand === brand)
      );
    });
    const current = (p: Product) => p.salePrice ?? p.price;
    if (sort === "price-asc") items.sort((a, b) => current(a) - current(b));
    if (sort === "price-desc") items.sort((a, b) => current(b) - current(a));
    if (sort === "rating") items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return items;
  }, [minPrice, maxPrice, category, brand, sort]);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
      <aside className="flex flex-col gap-8 lg:col-span-1">
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold">ราคา ($)</h2>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min={0}
              placeholder="ต่ำสุด"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <span className="text-muted">—</span>
            <input
              type="number"
              min={0}
              placeholder="สูงสุด"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold">หมวดหมู่</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => setCategory(category === c ? null : c)}
                  className={`transition hover:text-foreground ${
                    category === c ? "font-medium text-primary" : "text-muted"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold">แบรนด์</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {BRANDS.map((b) => (
              <li key={b}>
                <button
                  type="button"
                  onClick={() => setBrand(brand === b ? null : b)}
                  className={`transition hover:text-foreground ${
                    brand === b ? "font-medium text-primary" : "text-muted"
                  }`}
                >
                  {b}{" "}
                  <span className="text-muted">
                    ({PRODUCTS.filter((p) => p.brand === b).length})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <div className="lg:col-span-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            แสดง {filtered.length} จาก {PRODUCTS.length} รายการ
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted">
            ไม่พบสินค้าตามเงื่อนไขที่เลือก ลองปรับตัวกรองใหม่
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <article
                key={p.name}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="overflow-hidden bg-white p-6">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={300}
                    height={300}
                    className="aspect-square w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-medium leading-snug">{p.name}</h3>
                  {p.rating && (
                    <div className="mt-2">
                      <Stars rating={p.rating} />
                    </div>
                  )}
                  <p className="mt-2 font-heading text-lg font-semibold text-primary">
                    {p.salePrice ? (
                      <>
                        <span className="mr-2 text-sm font-normal text-muted line-through">
                          {price(p.price)}
                        </span>
                        {price(p.salePrice)}
                      </>
                    ) : (
                      price(p.price)
                    )}
                  </p>
                  <button
                    type="button"
                    className="mt-4 rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
                  >
                    หยิบใส่ตะกร้า
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <nav aria-label="เปลี่ยนหน้า" className="mt-12 flex justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
            1
          </span>
        </nav>
      </div>
    </div>
  );
}
