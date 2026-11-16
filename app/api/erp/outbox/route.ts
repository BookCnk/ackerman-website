import { NextResponse } from "next/server";
import { getPendingOutboxBookings, getAllOutboxBookings, getOutboxBooking, updateBookingSyncStatus } from "@/lib/outbox-store";
import { dispatchBookingToErp } from "@/lib/erp-client";
import { verifyErpSignature } from "@/lib/erp-crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  // Optional HMAC validation
  const timestamp = request.headers.get("X-Ackermann-Timestamp");
  const signature = request.headers.get("X-Ackermann-Signature");
  if (timestamp && signature) {
    const auth = verifyErpSignature("", timestamp, signature);
    if (!auth.valid) {
      return NextResponse.json({ ok: false, error: auth.reason }, { status: 403 });
    }
  }

  const bookings = statusFilter === "all" ? getAllOutboxBookings() : getPendingOutboxBookings();
  return NextResponse.json({
    ok: true,
    count: bookings.length,
    bookings,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetBookingNo = body.bookingNo;

    const toSync = targetBookingNo
      ? [getOutboxBooking(targetBookingNo)].filter(Boolean)
      : getPendingOutboxBookings();

    const results = [];

    for (const b of toSync) {
      if (!b) continue;
      const res = await dispatchBookingToErp(b, b.holdToken);
      if (res.deliveredToLiveErp) {
        updateBookingSyncStatus(b.bookingNo, "DEPOSIT_PAID_ERP_SYNCED");
        results.push({ bookingNo: b.bookingNo, synced: true });
      } else {
        updateBookingSyncStatus(b.bookingNo, "PENDING_ERP_SYNC", res.error);
        results.push({ bookingNo: b.bookingNo, synced: false, error: res.error });
      }
    }

    return NextResponse.json({
      ok: true,
      processed: results.length,
      results,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Sync retry failed";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
