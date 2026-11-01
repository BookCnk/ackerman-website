import type { Metadata } from "next";
import { Kanit, Prompt } from "next/font/google";
import { BookingProvider } from "@/components/booking/BookingContext";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import UrbanIntroCurtain from "@/components/home/UrbanIntroCurtain";
import SlideOverDrawer from "@/components/booking/SlideOverDrawer";
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
  title: "Ackermann Garage — ศูนย์บริการแต่งรถ ช่วงล่าง เบรก ล้อ ยาง ครบวงจร",
  description:
    "Ackermann Garage ศูนย์รวมของแต่งรถระดับพรีเมียม ช่วงล่าง โช๊คอัพ เบรก ล้อฟอร์จ ท่อไอเสีย และฟิล์มใส PPF พร้อมระบบเช็คราคาและจองคิวติดตั้งออนไลน์เชื่อมตรงสู่ระบบ ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${kanit.variable} ${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <BookingProvider>
            <UrbanIntroCurtain />
            {children}
            <SlideOverDrawer />
            <AuthModal />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
