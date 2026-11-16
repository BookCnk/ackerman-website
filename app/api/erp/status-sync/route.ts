import { NextResponse } from "next/server";
import { verifyErpSignature } from "@/lib/erp-crypto";
import { updateBookingWorkshopStatus, getAllOutboxBookings } from "@/lib/outbox-store";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get("X-Ackermann-Timestamp");
    const signature = request.headers.get("X-Ackermann-Signature");

    // Verify HMAC signature
    const auth = verifyErpSignature(rawBody, timestamp, signature);
    if (!auth.valid) {
      return NextResponse.json(
        { ok: false, error: auth.reason || "Unauthorized signature" },
        { status: 403 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data || {};

    let matchedBookingNo = data.bookingNo;

    // If bookingNo was not provided directly, match by licensePlate
    if (!matchedBookingNo && data.licensePlate) {
      const all = getAllOutboxBookings();
      const normPlate = data.licensePlate.replace(/\s+/g, "");
      const found = all.find((b) => b.licensePlate.replace(/\s+/g, "") === normPlate);
      if (found) {
        matchedBookingNo = found.bookingNo;
      }
    }

    if (matchedBookingNo) {
      if (event === "parts.received") {
        updateBookingWorkshopStatus(matchedBookingNo, {
          partsReadiness: "อะไหล่พร้อมแล้ว (Parts Ready)",
        });
      } else if (event === "job.status_changed") {
        const stage = Number(data.repairStage);
        if (stage >= 1 && stage <= 4) {
          updateBookingWorkshopStatus(matchedBookingNo, {
            repairStage: stage as 1 | 2 | 3 | 4,
          });
        }
      } else if (event === "warranty.issued") {
        updateBookingWorkshopStatus(matchedBookingNo, {
          warrantyCount: Number(data.warrantyCount) || 1,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      event,
      matchedBookingNo: matchedBookingNo || null,
      message: "Status sync processed successfully",
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Sync processing failed";
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }
}
