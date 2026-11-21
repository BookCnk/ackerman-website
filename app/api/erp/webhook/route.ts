import { NextResponse } from "next/server";
import { dispatchBookingToErp } from "@/lib/erp-client";
import { isProduction, verifyPaymentGatewaySignature } from "@/lib/erp-crypto";
import { StockStatus } from "@/lib/mock-erp-data";
import { saveOutboxBooking, updateBookingSyncStatus } from "@/lib/outbox-store";

type WebhookRequestBody = {
  bookingNo?: string;
  holdToken?: string;
  bookingMode?: "PAID_GATEWAY" | "PAY_AT_SHOP";
  customerName: string;
  customerPhone: string;
  licensePlate: string;
  vehicleLabel: string;
  appointmentDate: string;
  appointmentSlot: string;
  paymentMethod: "PROMPTPAY_QR" | "CREDIT_CARD";
  paymentGatewayRef?: string;
  items: {
    sku: string;
    name: string;
    partPrice: number;
    laborPrice: number;
    stockStatus: StockStatus;
  }[];
  partsTotal: number;
  laborTotal: number;
  grandTotal: number;
  depositPaid: number;
  remainingBalance: number;
};

function formatToThaiDate(input: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split("-");
    return `${d}/${m}/${y}`;
  }
  return input;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody) as WebhookRequestBody;

    // Production security guard:
    // Prevent unverified browser clients from forging paid deposit bookings into ERP Cash Flow.
    const allowDemoCheckout = process.env.ALLOW_DEMO_CHECKOUT === "true";
    const paymentSig = request.headers.get("X-Payment-Webhook-Signature");
    let effectiveDepositPaid = Number(body.depositPaid || 0);
    let effectiveRemainingBalance = Number(body.remainingBalance || 0);
    let gatewayRef = body.paymentGatewayRef || `chrg_live_ack_${Date.now().toString(36)}`;

    if (isProduction() && !allowDemoCheckout) {
      if (paymentSig) {
        const sigCheck = verifyPaymentGatewaySignature(rawBody, paymentSig);
        if (!sigCheck.valid) {
          return NextResponse.json(
            { ok: false, error: sigCheck.reason || "Invalid payment gateway signature" },
            { status: 403 }
          );
        }
      } else if (body.bookingMode === "PAY_AT_SHOP") {
        // Safe unverified reservation mode: never credit unverified deposit money into ERP
        effectiveDepositPaid = 0;
        effectiveRemainingBalance = Number(body.grandTotal || 0);
        gatewayRef = "PAY_AT_SHOP";
      } else {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Direct unverified deposit webhook is disabled in production. Provide a valid X-Payment-Webhook-Signature or use bookingMode='PAY_AT_SHOP'.",
          },
          { status: 403 }
        );
      }
    }

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const randomSuffix = String(Math.floor(100 + Math.random() * 900));

    const bookingNo = body.bookingNo || `BK-${yyyy}${mm}${dd}-${randomSuffix}`;

    const hasPreOrder = body.items.some((i) => i.stockStatus === "PRE_ORDER");
    const hasPhysicalParts = body.items.some((i) => i.partPrice > 0);

    const partsReadiness = hasPreOrder
      ? "รอพัสดุส่งถึงร้าน (Inbound Pending)"
      : hasPhysicalParts
      ? "อะไหล่พร้อมแล้ว (Parts Ready)"
      : "บริการทั่วไป (General Service)";

    const bayAssigned = body.items.some((i) => i.sku.includes("PPF"))
      ? "ห้องปลอดฝุ่น Studio 1 (PPF & Detailing Bay)"
      : "ลิฟท์ 2 (Lift 2) & จุดตั้งศูนย์ 3D";

    const erpBookingRecord = {
      bookingNo,
      createdAt: `${dd}/${mm}/${yyyy} (${hh}.${min})`,
      appointmentDate: formatToThaiDate(body.appointmentDate),
      appointmentSlot: body.appointmentSlot,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      licensePlate: body.licensePlate,
      vehicleLabel: body.vehicleLabel,
      bayAssigned,
      partsReadiness: partsReadiness as
        | "อะไหล่พร้อมแล้ว (Parts Ready)"
        | "รอพัสดุส่งถึงร้าน (Inbound Pending)"
        | "บริการทั่วไป (General Service)",
      repairStage: 1 as const,
      items: body.items,
      partsTotal: body.partsTotal,
      laborTotal: body.laborTotal,
      grandTotal: body.grandTotal,
      depositPaid: effectiveDepositPaid,
      remainingBalance: effectiveRemainingBalance,
      paymentGatewayRef: gatewayRef,
      paymentMethod: body.paymentMethod,
    };

    // 1. Save into Outbox Store first (PostgreSQL via Prisma in production, file fallback in local dev)
    await saveOutboxBooking({
      ...erpBookingRecord,
      syncStatus: "PENDING_ERP_SYNC",
      retryCount: 0,
      holdToken: body.holdToken,
    });

    // 2. Dispatch to Private ERP via HMAC-authenticated Bridge API
    const dispatchResult = await dispatchBookingToErp(erpBookingRecord, body.holdToken);

    // 3. Update Outbox Status based on ERP delivery result
    if (dispatchResult.deliveredToLiveErp) {
      await updateBookingSyncStatus(bookingNo, "DEPOSIT_PAID_ERP_SYNCED", undefined, {
        endpointUrl: dispatchResult.erpEndpoint,
        event: "payment_gateway.deposit.succeeded",
        payloadJson: JSON.stringify({ bookingNo, appointmentId: dispatchResult.appointmentId }),
        httpStatus: dispatchResult.httpStatus,
      });
    } else {
      await updateBookingSyncStatus(
        bookingNo,
        "PENDING_ERP_SYNC",
        dispatchResult.error || "ERP Offline",
        {
          endpointUrl: dispatchResult.erpEndpoint,
          event: "payment_gateway.deposit.queued",
          payloadJson: JSON.stringify({ bookingNo, error: dispatchResult.error }),
          httpStatus: dispatchResult.httpStatus,
        }
      );
    }

    const erpSyncActions = [
      {
        module: "Workshop Appointments Calendar",
        action: `สร้างคิวนัดหมาย ${bookingNo} ลงตารางนัดหมาย วันที่ ${erpBookingRecord.appointmentDate} (${erpBookingRecord.appointmentSlot})`,
        badge: partsReadiness,
      },
      {
        module: "Warehouse & Inventory (FIFO Lot Reservation)",
        action: hasPreOrder
          ? "ล็อกสต็อกรายการที่มีของ และสร้างใบสั่งของพิเศษอัตโนมัติ (Draft Inbound PO / Special Order) สำหรับรายการ Pre-Order"
          : "ตัดจองสต็อกอะไหล่ (Reserved Stock) ล็อกไว้ให้ทะเบียน " + body.licensePlate,
        badge: "Stock Reserved",
      },
      {
        module: "Finance & Cash Flow Hub",
        action:
          effectiveDepositPaid > 0
            ? `บันทึกยอดเงินมัดจำรับล่วงหน้า ฿${effectiveDepositPaid.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
              })} (Ref: ${gatewayRef}) เข้าบัญชีกระแสเงินสด รอหักลบตอนปิดบิล POS`
            : "บันทึกคิวนัดหมายแบบรอชำระและตรวจสอบยอดที่หน้าเคาน์เตอร์อู่",
        badge: dispatchResult.deliveredToLiveErp ? "Synced to Live ERP" : "Queued in Storefront Outbox",
      },
    ];

    return NextResponse.json({
      ok: true,
      deliveredToLiveErp: dispatchResult.deliveredToLiveErp,
      syncStatus: dispatchResult.deliveredToLiveErp ? "DEPOSIT_PAID_ERP_SYNCED" : "PENDING_ERP_SYNC",
      event: "payment_gateway.deposit.succeeded",
      erpEndpoint: `POST ${dispatchResult.erpEndpoint}`,
      httpStatus: dispatchResult.httpStatus,
      trackingUrl: `/track/${bookingNo}`,
      booking: erpBookingRecord,
      erpSyncActions,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Invalid booking payload";
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }
}
