"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBooking } from "@/components/booking/BookingContext";
import { useAuth } from "@/components/auth/AuthContext";
import {
  CATALOG_ITEMS,
  IND_CATEGORIES,
  VEHICLES,
  calculateDeposit,
  formatTHB,
} from "@/lib/mock-erp-data";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    selectedItems,
    selectedVehicleId,
    setSelectedVehicleId,
    setIsCartDrawerOpen,
    setInspectedBuildId,
    replayIntro,
  } = useBooking();

  const { isLoggedIn, user, openAuthModal, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<
    "VEHICLE" | "CATEGORY" | "SEARCH" | null
  >(null);
  const [quickSearch, setQuickSearch] = useState("");

  const currentVehicle = VEHICLES.find((v) => v.id === selectedVehicleId);
  const { depositAmount } = calculateDeposit(selectedItems);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid =
    scrolled || mobileOpen || activeMega !== null || pathname !== "/";

  const handleSelectVehicleFromMega = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setActiveMega(null);
    router.push(`/shop?vehicle=${encodeURIComponent(vehicleId)}`);
  };

  const handleSelectCategoryFromMega = (categoryName: string) => {
    setActiveMega(null);
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveMega(null);
    router.push(`/shop?q=${encodeURIComponent(quickSearch.trim())}`);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      onMouseLeave={() => setActiveMega(null)}
    >
      {/* Top Bar: ERP Live Sync + Replay Intro Slide + Selected Vehicle */}
      <div
        className={`hidden border-b transition-colors duration-300 md:block ${
          solid
            ? "border-border bg-surface"
            : "border-transparent bg-background/75 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-muted sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              IND × Urban Bespoke UX
            </span>
            <span>
              เช็คราคาอะไหล่ สต็อกจริง และโอนมัดจำล็อกคิวช่องซ่อมเข้า Ackermann ERP อัตโนมัติ
            </span>
          </div>

          <div className="flex items-center gap-5 tabular-nums">
            <button
              type="button"
              onClick={replayIntro}
              className="text-primary transition hover:underline"
            >
              เล่นสไลด์เปิดเว็บอีกครั้ง (Replay Intro)
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveMega(activeMega === "VEHICLE" ? null : "VEHICLE")
              }
              className="text-foreground transition hover:text-primary"
            >
              {currentVehicle ? (
                <>
                  รถของคุณ:{" "}
                  <span className="font-semibold text-primary">
                    {currentVehicle.make} {currentVehicle.model}
                  </span>
                </>
              ) : (
                "เลือกรุ่นรถของคุณ (Select Vehicle)"
              )}
            </button>
            <a
              href="tel:021234567"
              className="transition hover:text-foreground"
            >
              โทร: 02-123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`border-b transition-colors duration-300 ${
          solid
            ? "border-border bg-background/95 backdrop-blur"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Ackermann Garage"
              width={1774}
              height={887}
              priority
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          {/* Desktop IND × Urban Minimal Luxury English Nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className={`text-sm font-semibold tracking-wide uppercase transition whitespace-nowrap ${
                pathname === "/"
                  ? "text-primary"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Home
            </Link>

            <button
              type="button"
              onMouseEnter={() => setActiveMega("VEHICLE")}
              onClick={() =>
                setActiveMega(activeMega === "VEHICLE" ? null : "VEHICLE")
              }
              className={`inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase transition whitespace-nowrap ${
                activeMega === "VEHICLE"
                  ? "text-primary"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              <span>Vehicles</span>
              <svg
                className="h-3 w-3 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onMouseEnter={() => setActiveMega("CATEGORY")}
              onClick={() =>
                setActiveMega(activeMega === "CATEGORY" ? null : "CATEGORY")
              }
              className={`inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase transition whitespace-nowrap ${
                activeMega === "CATEGORY"
                  ? "text-primary"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              <span>Parts</span>
              <svg
                className="h-3 w-3 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <Link
              href="/showcase"
              onMouseEnter={() => setActiveMega(null)}
              className={`text-sm font-semibold tracking-wide uppercase transition whitespace-nowrap ${
                pathname.startsWith("/showcase")
                  ? "text-primary"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Builds
            </Link>

            <Link
              href="/booking"
              onMouseEnter={() => setActiveMega(null)}
              className={`text-sm font-semibold tracking-wide uppercase transition whitespace-nowrap ${
                pathname.startsWith("/booking")
                  ? "text-primary"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Booking
            </Link>

            <Link
              href="/garage"
              onMouseEnter={() => setActiveMega(null)}
              className={`text-sm font-semibold tracking-wide uppercase transition whitespace-nowrap ${
                pathname.startsWith("/garage")
                  ? "text-primary"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Garage
            </Link>
          </nav>

          {/* Right Actions: Search + Slide-Over Booking Drawer Trigger */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setActiveMega(activeMega === "SEARCH" ? null : "SEARCH")
              }
              aria-label="ค้นหาอะไหล่ด่วน"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-primary hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* User Account / Sign In Modal Trigger */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex h-10 items-center gap-2 rounded-full border border-primary/40 bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-primary"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-border bg-surface p-2 shadow-2xl backdrop-blur">
                    <p className="px-3 py-1.5 text-[11px] font-semibold text-muted truncate">
                      {user.phone}
                    </p>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      href="/garage"
                      onClick={() => setUserDropdown(false)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-foreground transition hover:bg-background hover:text-primary"
                    >
                      My Garage (ข้อมูลรถ)
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-background hover:text-primary"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                aria-label="Account Login"
                className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 transition hover:border-primary hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setInspectedBuildId(null);
                setIsCartDrawerOpen(true);
              }}
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary-hover sm:inline-flex"
            >
              <span>Cart</span>
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs font-bold tabular-nums">
                {selectedItems.length}
                {depositAmount > 0 ? ` • ${formatTHB(depositAmount)}` : ""}
              </span>
            </button>

            <button
              type="button"
              aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-border lg:hidden"
            >
              <span
                className={`h-0.5 w-5 bg-foreground transition ${
                  mobileOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-foreground transition ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-foreground transition ${
                  mobileOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* IND Distribution Mega-Menu: SHOP BY VEHICLE */}
        {activeMega === "VEHICLE" && (
          <div className="hidden border-t border-border bg-surface/95 py-8 shadow-2xl backdrop-blur lg:block">
            <div className="mx-auto max-w-7xl px-8">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    IND STYLE CHASSIS SELECTOR
                  </p>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    เลือกรุ่นรถและรหัสตัวถังเพื่อกรองของแต่งที่ใส่ได้ตรงรุ่น 100%
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectVehicleFromMega("ALL")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ดูสินค้าทุกรุ่นรถ (Show All Vehicles) →
                </button>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {VEHICLES.map((v) => {
                  const count = CATALOG_ITEMS.filter(
                    (i) =>
                      i.compatibleVehicles.includes("ALL") ||
                      i.compatibleVehicles.includes(v.id)
                  ).length;
                  const active = selectedVehicleId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVehicleFromMega(v.id)}
                      className={`group rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-primary bg-background"
                          : "border-border bg-background/60 hover:border-primary"
                      }`}
                    >
                      <span className="text-xs font-semibold text-primary tabular-nums">
                        {v.year} • {v.make}
                      </span>
                      <p className="mt-1 font-heading text-base font-bold text-foreground group-hover:text-primary">
                        {v.model}
                      </p>
                      <p className="text-xs text-muted">{v.submodel}</p>
                      <p className="mt-3 text-[11px] font-semibold text-secondary tabular-nums">
                        มีของแต่งรองรับ {count} รายการ →
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* IND Distribution Mega-Menu: SHOP BY CATEGORY */}
        {activeMega === "CATEGORY" && (
          <div className="hidden border-t border-border bg-surface/95 py-8 shadow-2xl backdrop-blur lg:block">
            <div className="mx-auto max-w-7xl px-8">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    SHOP BY CATEGORY
                  </p>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    เลือกหมวดของแต่งและแพ็กเกจบริการพร้อมประเมินราคาติดตั้งทันที
                  </h3>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setActiveMega(null)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  เปิดหน้าแคตตาล็อกทั้งหมด →
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {IND_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategoryFromMega(cat.enTitle)}
                    className="group flex items-center gap-3.5 rounded-xl border border-border bg-background p-3 text-left transition hover:border-primary"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      width={80}
                      height={80}
                      className="h-14 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {cat.enTitle}
                      </p>
                      <p className="font-heading text-sm font-bold text-foreground group-hover:text-primary">
                        {cat.title}
                      </p>
                      <p className="line-clamp-1 mt-0.5 text-[11px] text-muted">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick SKU & Part Search Bar */}
        {activeMega === "SEARCH" && (
          <div className="border-t border-border bg-surface px-4 py-4 shadow-xl">
            <form
              onSubmit={handleQuickSearchSubmit}
              className="mx-auto flex max-w-4xl items-center gap-3"
            >
              <input
                type="text"
                autoFocus
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="ค้นหาชื่ออะไหล่, แบรนด์ (Öhlins, KW, Brembo, BBS, Akrapovič, STEK) หรือรหัส SKU..."
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                ค้นหาในคลัง ERP
              </button>
            </form>
          </div>
        )}

        {/* Mobile Drawer Menu */}
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  Parts & Vehicles
                </Link>
              </li>
              <li>
                <Link
                  href="/showcase"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  Builds & Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  Booking & Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/garage"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  My Garage
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 font-medium text-primary hover:bg-surface"
                >
                  Sign In / Register
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setIsCartDrawerOpen(true);
                  }}
                  className="mt-2 block w-full rounded-full bg-primary px-6 py-2.5 text-center font-semibold text-white tabular-nums"
                >
                  เปิดรายการจองคิว ({selectedItems.length} รายการ)
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
