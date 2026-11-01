"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function LoginView() {
  const router = useRouter();
  const { isLoggedIn, user, loginWithPhone, loginWithEmail, register, logout } =
    useAuth();

  const [mode, setMode] = useState<"PHONE" | "EMAIL" | "REGISTER">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn && user) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
          LOGGED IN AS
        </span>
        <h2 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {user.name}
        </h2>
        <p className="mt-1 text-sm text-muted tabular-nums">
          เบอร์โทร: {user.phone} • รหัส ERP: {user.erpCustomerId}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/garage"
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            เปิดหน้าข้อมูลรถของฉัน (My Garage) →
          </Link>
          <Link
            href="/booking"
            className="w-full rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition hover:border-primary"
          >
            ไปหน้าจองคิว & โอนมัดจำ (Booking)
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-xs text-muted transition hover:text-primary pt-2"
          >
            ออกจากระบบ (Sign Out)
          </button>
        </div>
      </div>
    );
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
        setOtp("882194");
      }, 500);
      return;
    }
    setLoading(true);
    await loginWithPhone(phone, otp);
    setLoading(false);
    router.push("/garage");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithEmail(email, password);
    setLoading(false);
    router.push("/garage");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register({ name, phone, email, licensePlate: plate });
    setLoading(false);
    router.push("/garage");
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-white/15 bg-surface p-8 shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/sites/urban/urban-shield-logo.svg"
          alt="Ackermann Garage"
          width={40}
          height={40}
          className="h-10 w-10 invert brightness-200"
        />
        <h1 className="mt-4 font-heading text-2xl font-bold uppercase tracking-wider text-foreground">
          Customer Portal Sign In
        </h1>
        <p className="mt-1 text-xs text-muted">
          เข้าสู่ระบบเพื่อเช็คประวัติการแต่งรถ สต็อกอะไหล่ และใบรับประกัน ERP
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode("PHONE");
            setOtpSent(false);
          }}
          className={`rounded-lg py-2 transition uppercase tracking-wider ${
            mode === "PHONE" || mode === "EMAIL"
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground"
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
              : "text-muted hover:text-foreground"
          }`}
        >
          Register
        </button>
      </div>

      {/* Phone OTP Login */}
      {mode === "PHONE" && (
        <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-300">
              เบอร์โทรศัพท์ (ค้นหาประวัติรถใน ERP ทันที)
            </label>
            <input
              type="tel"
              required
              placeholder="089-456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {otpSent && (
            <div className="rounded-xl border border-primary/40 bg-background p-3.5">
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
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-center font-mono text-base tracking-widest text-foreground focus:border-primary focus:outline-none"
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
              : "ส่งรหัส SMS OTP"}
          </button>

          <div className="flex justify-between pt-1 text-xs text-muted">
            <button
              type="button"
              onClick={() => setMode("EMAIL")}
              className="hover:text-primary"
            >
              เข้าสู่ระบบด้วย Email →
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

      {/* Email Login */}
      {mode === "EMAIL" && (
        <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-300">อีเมล</label>
            <input
              type="email"
              required
              placeholder="thanapat@ackermanngarage.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">รหัสผ่าน</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Sign In with Email"}
          </button>

          <div className="text-center pt-1 text-xs text-muted">
            <button
              type="button"
              onClick={() => setMode("PHONE")}
              className="text-primary hover:underline"
            >
              ← กลับไปใช้เบอร์โทรศัพท์ (SMS OTP)
            </button>
          </div>
        </form>
      )}

      {/* Register */}
      {mode === "REGISTER" && (
        <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-3.5">
          <div>
            <label className="text-xs font-medium text-neutral-300">ชื่อ-นามสกุล</label>
            <input
              type="text"
              required
              placeholder="คุณสมชาย สุขุมวิท"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              required
              placeholder="08X-XXX-XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">เลขทะเบียนรถ (ถ้ามี)</label>
            <input
              type="text"
              placeholder="เช่น 3ขฬ 9911 กรุงเทพมหานคร"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน & เชื่อมโยงประวัติ ERP"}
          </button>
        </form>
      )}

      {/* Quick Demo */}
      <div className="mt-6 border-t border-border pt-4">
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            await loginWithPhone("089-456-7890", "882194");
            setLoading(false);
            router.push("/garage");
          }}
          className="w-full rounded-xl border border-border bg-background py-2.5 text-xs font-medium text-neutral-300 transition hover:border-primary hover:text-white"
        >
          ⚡ ทดลองเข้าสู่ระบบด้วยบัญชีลูกค้าตัวอย่าง (คุณธนภัทร)
        </button>
      </div>
    </div>
  );
}

