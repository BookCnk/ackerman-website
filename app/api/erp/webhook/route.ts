import { NextResponse } from "next/server";
import { dispatchBookingToErp } from "@/lib/erp-client";
import { StockStatus } from "@/lib/mock-erp-data";

type WebhookRequestBody = {
  customerName: string;
  customerPhone: string;
  licensePlate: string;
  vehicleLabel: string;
  appointmentDate: string;
  appointmentSlot: string;
  paymentMethod: "PROMPTPAY_QR" | "CREDIT_CARD";
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
    const body = (await request.json()) as WebhookRequestBody;

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const randomSuffix = String(Math.floor(100 + Math.random() * 900));

    const bookingNo = `BK-${yyyy}${mm}${dd}-${randomSuffix}`;
    const gatewayRef = `chrg_live_ack_${Date.now().toString(36)}`;

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
      depositPaid: body.depositPaid,
      remainingBalance: body.remainingBalance,
      paymentGatewayRef: gatewayRef,
      paymentMethod: body.paymentMethod,
    };

    const dispatchResult = await dispatchBookingToErp(erpBookingRecord);

    const erpSyncActions = [
      {
        module: "Workshop Appointments Calendar",
        action: `สร้างคิวนัดหมาย ${bookingNo} ลงตารางช่องซ่อม "${bayAssigned}" วันที่ ${erpBookingRecord.appointmentDate}`,
        badge: partsReadiness,
      },
      {
        module: "Warehouse & Inventory (FIFO Lot Reservation)",
        action: hasPreOrder
          ? "ล็อกสต็อกรายการที่มีของ และสร้างใบขอซื้ออัตโนมัติ (Draft Inbound PO) สำหรับรายการ Pre-Order"
          : "ตัดจองสต็อกอะไหล่ (Reserved Stock) ล็อกไว้ให้ทะเบียน " + body.licensePlate,
        badge: "Stock Reserved",
      },
      {
        module: "Finance & Cash Flow Hub",
        action: `บันทึกยอดเงินมัดจำรับล่วงหน้า ฿${body.depositPaid.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
        })} (Ref: ${gatewayRef}) รอหักลบตอนปิดบิล POS`,
        badge: "Verified via Gateway Webhook",
      },
    ];

    return NextResponse.json({
      ok: true,
      event: "payment_gateway.deposit.succeeded",
      erpEndpoint: `POST ${dispatchResult.erpEndpoint}`,
      httpStatus: dispatchResult.httpStatus,
      trackingUrl: `/track/${bookingNo}`,
      booking: erpBookingRecord,
      erpSyncActions,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid booking payload" },
      { status: 400 }
    );
  }
}
