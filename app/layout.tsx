import type { Metadata } from "next";
import { Kanit, Prompt } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Ackermann Garage — คาร์แคร์และดีเทลลิ่งครบวงจร",
  description:
    "Ackermann Garage บริการดีเทลลิ่งรถยนต์ครบวงจร ล้างมือ เคลือบแว็กซ์ ขัดสี เคลือบเซรามิก ทำความสะอาดภายใน คืนความเงางามให้รถคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${kanit.variable} ${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
