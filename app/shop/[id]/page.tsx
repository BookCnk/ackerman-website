import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { getProductById } from "@/lib/erp-client";
import { CATALOG_ITEMS } from "@/lib/mock-erp-data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).trim();
  const item = await getProductById(decodedId);

  if (!item) {
    return {
      title: "ร้านค้าอะไหล่และชุดแต่ง — Ackermann Garage",
    };
  }

  return {
    title: `${item.name} (${item.brand}) — Ackermann Garage Shop`,
    description: `สั่งซื้อและจองคิวติดตั้ง ${item.name} แบรนด์ ${item.brand} ราคารวมบริการติดตั้งเรียบร้อยแล้ว รับประกันงานโดยระบบ Ackermann ERP`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).trim();

  // If a category slug was typed (e.g. /shop/wheels, /shop/tires, /shop/brakes)
  const lower = decodedId.toLowerCase();
  if (lower === "wheels" || lower === "wheel" || lower === "ล้อ" || lower === "ล้อแม็กซ์") {
    redirect("/shop?category=Wheels");
  }
  if (lower === "tires" || lower === "tire" || lower === "ยาง" || lower === "ยางรถยนต์") {
    redirect("/shop?category=Tires");
  }
  if (lower === "brakes" || lower === "brake" || lower === "เบรก") {
    redirect("/shop?category=Brakes+Calipers");
  }
  if (lower === "exhaust" || lower === "ท่อ") {
    redirect("/shop?category=Exhaust");
  }
  if (lower === "suspension" || lower === "shock" || lower === "ช่วงล่าง") {
    redirect("/shop?category=Shock+Absorbers");
  }

  const item = await getProductById(decodedId);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16">
        <ProductDetailClient item={item} />
      </main>
      <Footer />
    </>
  );
}
