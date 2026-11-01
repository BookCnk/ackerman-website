"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "./AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithPhone, loginWithEmail, register } =
    useAuth();

  const [mode, setMode] = useState<"PHONE_LOGIN" | "EMAIL_LOGIN" | "REGISTER">(
    "PHONE_LOGIN"
  );
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPlate, setRegPlate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp("882194"); // Auto fill demo OTP
    }, 600);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithPhone(phone, otp);
    setLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithEmail(email, password);
    setLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register({
      name: regName,
      phone: regPhone,
      email: regEmail,
      licensePlate: regPlate,
    });
    setLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await loginWithPhone("089-456-7890", "882194");
    setLoading(false);
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#121212] p-7 text-foreground shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-primary hover:text-white"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/sites/urban/urban-shield-logo.svg"
            alt="Ackermann Garage"
            width={32}
            height={32}
            className="h-8 w-8 invert brightness-200"
          />
          <h2 className="mt-3 font-heading text-xl font-bold uppercase tracking-wider text-white">
            Ackermann Garage Portal
          </h2>
          <p className="mt-1 text-xs text-muted">
            เข้าสู่ระบบเพื่อเช็คประวัติการแต่งรถ สต็อกอะไหล่ และใบรับประกัน ERP
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("PHONE_LOGIN");
              setOtpSent(false);
            }}
            className={`rounded-lg py-2 transition uppercase tracking-wider ${
              mode === "PHONE_LOGIN" || mode === "EMAIL_LOGIN"
                ? "bg-primary text-white"
                : "text-muted hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("REGISTER")}
            className={`rounded-lg py-2 transition uppercase tracking-wider ${
              mode === "REGISTER"
                ? "bg-primary text-white"
                : "text-muted hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* 1. Phone OTP Login Form */}
        {mode === "PHONE_LOGIN" && (
          <form onSubmit={otpSent ? handlePhoneSubmit : handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-300">
                เบอร์โทรศัพท์ (เชื่อมประวัติ ERP อัตโนมัติ)
              </label>
              <input
                type="tel"
                required
                placeholder="เช่น 089-456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>

            {otpSent && (
              <div className="rounded-xl border border-primary/40 bg-surface p-3.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-primary">รหัสยืนยัน SMS OTP</span>
                  <span className="text-[11px] text-muted">รหัสทดสอบ: 882194</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="กรอกรหัส 6 หลัก"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-center font-mono text-base tracking-widest text-white focus:border-primary focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-primary-hover disabled:opacity-50"
            >
              {loading
                ? "กำลังดำเนินการ..."
                : otpSent
                ? "ยืนยันรหัส & เข้าสู่ระบบ"
                : "ส่งรหัส SMS OTP (เข้าสู่ระบบทันที)"}
            </button>

            <div className="flex justify-between pt-1 text-xs text-muted">
              <button
                type="button"
                onClick={() => setMode("EMAIL_LOGIN")}
                className="hover:text-primary"
              >
                เข้าสู่ระบบด้วย Email แทน →
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhone("089-456-7890");
                  setOtpSent(true);
                  setOtp("882194");
                }}
                className="text-primary hover:underline"
              >
                กรอกเบอร์ตัวอย่าง
              </button>
            </div>
          </form>
        )}

        {/* 2. Email + Password Login Form */}
        {mode === "EMAIL_LOGIN" && (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-300">
                อีเมล (Email Address)
              </label>
              <input
                type="email"
                required
                placeholder="your-email@ackermanngarage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300">
                รหัสผ่าน (Password)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ (Sign In)"}
            </button>

            <div className="text-center pt-1 text-xs text-muted">
              <button
                type="button"
                onClick={() => setMode("PHONE_LOGIN")}
                className="text-primary hover:underline"
              >
                ← เปลี่ยนไปใช้ล็อกอินด้วยเบอร์โทรศัพท์ (SMS OTP)
              </button>
            </div>
          </form>
        )}

        {/* 3. Register New Member Form */}
        {mode === "REGISTER" && (
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-3.5">
            <div>
              <label className="text-xs font-medium text-neutral-300">ชื่อ-นามสกุล</label>
              <input
                type="text"
                required
                placeholder="เช่น คุณกิตติพงศ์ วงศ์สวัสดิ์"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                required
                placeholder="08X-XXX-XXXX"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300">
                เลขทะเบียนรถ (เชื่อมประวัติ ERP ทันที)
              </label>
              <input
                type="text"
                placeholder="เช่น 3ขฬ 9911 กรุงเทพมหานคร"
                value={regPlate}
                onChange={(e) => setRegPlate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "กำลังสร้างบัญชี..." : "ลงทะเบียนและเชื่อม ERP"}
            </button>
          </form>
        )}

        {/* Quick Demo Customer Login Button */}
        <div className="mt-6 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full rounded-xl border border-border bg-surface py-2.5 text-xs font-medium text-neutral-300 transition hover:border-primary hover:text-white"
          >
            ⚡ ทดลองเข้าสู่ระบบด้วยบัญชีลูกค้าตัวอย่าง (คุณธนภัทร - BMW G87)
          </button>
        </div>
      </div>
    </div>
  );
}

