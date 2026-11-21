import { NextResponse } from "next/server";
import { getOutboxBooking } from "@/lib/outbox-store";

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `${digits.slice(0, 3)}-xxx-${digits.slice(-4)}`;
}

/**
 * Public read-only single-booking tracking endpoint.
 * Replaces unauthenticated access to /api/erp/outbox?status=all so customer lists are never exposed.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ bookingNo: string }> }
) {
  const { bookingNo } = await context.params;
  const cleanBookingNo = (bookingNo || "").trim();

  if (!cleanBookingNo) {
    return NextResponse.json({ ok: false, error: "Missing bookingNo" }, { status: 400 });
  }

  const record = await getOutboxBooking(cleanBookingNo);
  if (!record) {
    return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
  }

  // Return only safe public tracking fields (mask PII & omit internal gateway/sync secrets)
  return NextResponse.json({
    ok: true,
    booking: {
      bookingNo: record.bookingNo,
      createdAt: record.createdAt,
      appointmentDate: record.appointmentDate,
      appointmentSlot: record.appointmentSlot,
      customerName: record.customerName,
      customerPhone: maskPhone(record.customerPhone),
      licensePlate: record.licensePlate,
      vehicleLabel: record.vehicleLabel,
      bayAssigned: record.bayAssigned,
      partsReadiness: record.partsReadiness,
      repairStage: record.repairStage,
      items: record.items,
      partsTotal: record.partsTotal,
      laborTotal: record.laborTotal,
      grandTotal: record.grandTotal,
      depositPaid: record.depositPaid,
      remainingBalance: record.remainingBalance,
      paymentMethod: record.paymentMethod,
      warrantiesIssued: record.warrantiesIssued || 0,
    },
  });
}
