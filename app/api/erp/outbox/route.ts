import { NextResponse } from "next/server";
import {
  getPendingOutboxBookings,
  getAllOutboxBookings,
  getOutboxBooking,
  updateBookingSyncStatus,
} from "@/lib/outbox-store";
import { dispatchBookingToErp } from "@/lib/erp-client";
import { verifyCronOrErpAuth } from "@/lib/erp-crypto";

export async function GET(request: Request) {
  const auth = verifyCronOrErpAuth(request, "");
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.reason || "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const bookings =
    statusFilter === "all" ? await getAllOutboxBookings() : await getPendingOutboxBookings();

  return NextResponse.json({
    ok: true,
    count: bookings.length,
    bookings,
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const auth = verifyCronOrErpAuth(request, rawBody);
    if (!auth.valid) {
      return NextResponse.json({ ok: false, error: auth.reason || "Unauthorized" }, { status: 403 });
    }

    const body = rawBody ? (JSON.parse(rawBody) as { bookingNo?: string }) : {};
    const targetBookingNo = body.bookingNo;

    const toSync = targetBookingNo
      ? [await getOutboxBooking(targetBookingNo)].filter(Boolean)
      : await getPendingOutboxBookings();

    const results = [];

    for (const b of toSync) {
      if (!b) continue;
      const res = await dispatchBookingToErp(b, b.holdToken);
      if (res.deliveredToLiveErp) {
        await updateBookingSyncStatus(b.bookingNo, "DEPOSIT_PAID_ERP_SYNCED", undefined, {
          endpointUrl: res.erpEndpoint,
          event: "outbox.retry.succeeded",
          payloadJson: JSON.stringify({ bookingNo: b.bookingNo, appointmentId: res.appointmentId }),
          httpStatus: res.httpStatus,
        });
        results.push({ bookingNo: b.bookingNo, synced: true });
      } else {
        await updateBookingSyncStatus(b.bookingNo, "PENDING_ERP_SYNC", res.error, {
          endpointUrl: res.erpEndpoint,
          event: "outbox.retry.failed",
          payloadJson: JSON.stringify({ bookingNo: b.bookingNo, error: res.error }),
          httpStatus: res.httpStatus,
        });
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
