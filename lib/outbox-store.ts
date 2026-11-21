import fs from "fs";
import path from "path";
import { ErpBookingRecord, INITIAL_ERP_BOOKINGS, StockStatus } from "./mock-erp-data";
import { prisma } from "./prisma";
import { isProduction } from "./erp-crypto";

export type SyncStatus = "DEPOSIT_PAID_ERP_SYNCED" | "PENDING_ERP_SYNC" | "FAILED";

export type OutboxBooking = ErpBookingRecord & {
  syncStatus: SyncStatus;
  retryCount: number;
  lastSyncAttempt?: string;
  lastSyncError?: string;
  holdToken?: string;
  warrantiesIssued?: number;
};

// Local development fallback store (only used when PostgreSQL is unavailable in non-production)
const memoryOutbox: Map<string, OutboxBooking> = new Map();
for (const b of INITIAL_ERP_BOOKINGS) {
  memoryOutbox.set(b.bookingNo, {
    ...b,
    syncStatus: "DEPOSIT_PAID_ERP_SYNCED",
    retryCount: 0,
  });
}

function getOutboxFilePath(): string {
  return path.join(process.cwd(), ".outbox_store.json");
}

function loadOutboxFromFile(): void {
  try {
    const filePath = getOutboxFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const records = JSON.parse(content) as OutboxBooking[];
      for (const rec of records) {
        memoryOutbox.set(rec.bookingNo, rec);
      }
    }
  } catch {
    // Ignore file read errors in dev fallback
  }
}

function persistOutboxToFile(): void {
  try {
    const filePath = getOutboxFilePath();
    const records = Array.from(memoryOutbox.values());
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch {
    // Ignore file write errors in dev fallback
  }
}

loadOutboxFromFile();

function hasDatabaseConfigured(): boolean {
  return Boolean((process.env.DATABASE_URL || "").trim());
}

function formatThaiTimestamp(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} (${hh}.${min})`;
}

function mapPrismaBookingToOutbox(row: {
  bookingNo: string;
  createdAt: Date;
  appointmentDate: string;
  appointmentSlot: string;
  customerName: string;
  customerPhone: string;
  licensePlate: string;
  vehicleLabel: string;
  bayAssigned: string;
  partsReadiness: string;
  repairStage: number;
  partsTotal: number;
  laborTotal: number;
  grandTotal: number;
  depositPaid: number;
  remainingBalance: number;
  paymentGatewayRef: string | null;
  paymentMethod: "PROMPTPAY_QR" | "CREDIT_CARD";
  status: string;
  holdToken: string | null;
  retryCount: number;
  lastSyncAttempt: Date | null;
  lastSyncError: string | null;
  warrantiesIssued: number;
  items: {
    sku: string;
    name: string;
    partPrice: number;
    laborPrice: number;
    stockStatus: StockStatus;
  }[];
}): OutboxBooking {
  const syncStatus: SyncStatus =
    row.status === "PENDING_ERP_SYNC" || row.status === "PENDING_DEPOSIT"
      ? "PENDING_ERP_SYNC"
      : row.status === "FAILED"
      ? "FAILED"
      : "DEPOSIT_PAID_ERP_SYNCED";

  const clampedStage = Math.min(4, Math.max(1, row.repairStage || 1)) as 1 | 2 | 3 | 4;

  return {
    bookingNo: row.bookingNo,
    createdAt: formatThaiTimestamp(row.createdAt),
    appointmentDate: row.appointmentDate,
    appointmentSlot: row.appointmentSlot,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    licensePlate: row.licensePlate,
    vehicleLabel: row.vehicleLabel,
    bayAssigned: row.bayAssigned,
    partsReadiness: row.partsReadiness as ErpBookingRecord["partsReadiness"],
    repairStage: clampedStage,
    items: row.items.map((it) => ({
      sku: it.sku,
      name: it.name,
      partPrice: it.partPrice,
      laborPrice: it.laborPrice,
      stockStatus: it.stockStatus,
    })),
    partsTotal: row.partsTotal,
    laborTotal: row.laborTotal,
    grandTotal: row.grandTotal,
    depositPaid: row.depositPaid,
    remainingBalance: row.remainingBalance,
    paymentGatewayRef: row.paymentGatewayRef || "",
    paymentMethod: row.paymentMethod,
    syncStatus,
    retryCount: row.retryCount || 0,
    lastSyncAttempt: row.lastSyncAttempt?.toISOString(),
    lastSyncError: row.lastSyncError || undefined,
    holdToken: row.holdToken || undefined,
    warrantiesIssued: row.warrantiesIssued || 0,
  };
}

function handleDbError(context: string, err: unknown): void {
  if (isProduction()) {
    console.error(`[OUTBOX_PRISMA] ${context} failed in production:`, err);
    throw err;
  }
}

export async function saveOutboxBooking(booking: OutboxBooking): Promise<void> {
  if (hasDatabaseConfigured()) {
    try {
      await prisma.serviceBooking.upsert({
        where: { bookingNo: booking.bookingNo },
        create: {
          bookingNo: booking.bookingNo,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          licensePlate: booking.licensePlate,
          vehicleLabel: booking.vehicleLabel,
          appointmentDate: booking.appointmentDate,
          appointmentSlot: booking.appointmentSlot,
          bayAssigned: booking.bayAssigned,
          partsReadiness: booking.partsReadiness,
          repairStage: booking.repairStage,
          partsTotal: booking.partsTotal,
          laborTotal: booking.laborTotal,
          grandTotal: booking.grandTotal,
          depositPaid: booking.depositPaid,
          remainingBalance: booking.remainingBalance,
          paymentMethod: booking.paymentMethod,
          paymentGatewayRef: booking.paymentGatewayRef || null,
          holdToken: booking.holdToken || null,
          retryCount: booking.retryCount || 0,
          lastSyncAttempt: booking.lastSyncAttempt ? new Date(booking.lastSyncAttempt) : null,
          lastSyncError: booking.lastSyncError || null,
          warrantiesIssued: booking.warrantiesIssued || 0,
          status: booking.syncStatus,
          items: {
            create: booking.items.map((it) => ({
              sku: it.sku,
              name: it.name,
              partPrice: it.partPrice,
              laborPrice: it.laborPrice,
              stockStatus: it.stockStatus,
            })),
          },
        },
        update: {
          status: booking.syncStatus,
          holdToken: booking.holdToken || null,
          retryCount: booking.retryCount || 0,
          lastSyncAttempt: booking.lastSyncAttempt ? new Date(booking.lastSyncAttempt) : undefined,
          lastSyncError: booking.lastSyncError ?? null,
          partsReadiness: booking.partsReadiness,
          repairStage: booking.repairStage,
          warrantiesIssued: booking.warrantiesIssued || 0,
        },
      });
      return;
    } catch (err) {
      handleDbError("saveOutboxBooking", err);
    }
  }

  memoryOutbox.set(booking.bookingNo, booking);
  persistOutboxToFile();
}

export async function getOutboxBooking(bookingNo: string): Promise<OutboxBooking | undefined> {
  if (hasDatabaseConfigured()) {
    try {
      const row = await prisma.serviceBooking.findUnique({
        where: { bookingNo },
        include: { items: true },
      });
      if (row) return mapPrismaBookingToOutbox(row);
      if (isProduction()) return undefined;
    } catch (err) {
      handleDbError("getOutboxBooking", err);
    }
  }

  loadOutboxFromFile();
  return memoryOutbox.get(bookingNo);
}

export async function getAllOutboxBookings(): Promise<OutboxBooking[]> {
  if (hasDatabaseConfigured()) {
    try {
      const rows = await prisma.serviceBooking.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(mapPrismaBookingToOutbox);
    } catch (err) {
      handleDbError("getAllOutboxBookings", err);
    }
  }

  loadOutboxFromFile();
  return Array.from(memoryOutbox.values());
}

export async function getPendingOutboxBookings(): Promise<OutboxBooking[]> {
  if (hasDatabaseConfigured()) {
    try {
      const rows = await prisma.serviceBooking.findMany({
        where: { status: "PENDING_ERP_SYNC" },
        include: { items: true },
        orderBy: { createdAt: "asc" },
      });
      return rows.map(mapPrismaBookingToOutbox);
    } catch (err) {
      handleDbError("getPendingOutboxBookings", err);
    }
  }

  loadOutboxFromFile();
  return Array.from(memoryOutbox.values()).filter((b) => b.syncStatus === "PENDING_ERP_SYNC");
}

export async function updateBookingSyncStatus(
  bookingNo: string,
  status: SyncStatus,
  error?: string,
  webhookLog?: { endpointUrl: string; event: string; payloadJson: string; httpStatus: number }
): Promise<OutboxBooking | null> {
  if (hasDatabaseConfigured()) {
    try {
      const existing = await prisma.serviceBooking.findUnique({ where: { bookingNo } });
      if (existing) {
        const updated = await prisma.serviceBooking.update({
          where: { bookingNo },
          data: {
            status,
            lastSyncAttempt: new Date(),
            lastSyncError: error ?? null,
            retryCount: error ? (existing.retryCount || 0) + 1 : existing.retryCount || 0,
            ...(webhookLog
              ? {
                  webhookLogs: {
                    create: {
                      endpointUrl: webhookLog.endpointUrl,
                      event: webhookLog.event,
                      payloadJson: webhookLog.payloadJson,
                      httpStatus: webhookLog.httpStatus,
                    },
                  },
                }
              : {}),
          },
          include: { items: true },
        });
        return mapPrismaBookingToOutbox(updated);
      }
      if (isProduction()) return null;
    } catch (err) {
      handleDbError("updateBookingSyncStatus", err);
    }
  }

  loadOutboxFromFile();
  const existing = memoryOutbox.get(bookingNo);
  if (!existing) return null;

  existing.syncStatus = status;
  existing.lastSyncAttempt = new Date().toISOString();
  if (error) {
    existing.lastSyncError = error;
    existing.retryCount = (existing.retryCount || 0) + 1;
  } else {
    existing.lastSyncError = undefined;
  }

  memoryOutbox.set(bookingNo, existing);
  persistOutboxToFile();
  return existing;
}

export async function updateBookingWorkshopStatus(
  bookingNo: string,
  updates: {
    repairStage?: 1 | 2 | 3 | 4;
    partsReadiness?:
      | "อะไหล่พร้อมแล้ว (Parts Ready)"
      | "รอพัสดุส่งถึงร้าน (Inbound Pending)"
      | "บริการทั่วไป (General Service)";
    warrantyCount?: number;
  }
): Promise<OutboxBooking | null> {
  if (hasDatabaseConfigured()) {
    try {
      const existing = await prisma.serviceBooking.findUnique({ where: { bookingNo } });
      if (existing) {
        const updated = await prisma.serviceBooking.update({
          where: { bookingNo },
          data: {
            ...(updates.repairStage !== undefined ? { repairStage: updates.repairStage } : {}),
            ...(updates.partsReadiness !== undefined ? { partsReadiness: updates.partsReadiness } : {}),
            ...(updates.warrantyCount !== undefined
              ? { warrantiesIssued: (existing.warrantiesIssued || 0) + updates.warrantyCount }
              : {}),
          },
          include: { items: true },
        });
        return mapPrismaBookingToOutbox(updated);
      }
      if (isProduction()) return null;
    } catch (err) {
      handleDbError("updateBookingWorkshopStatus", err);
    }
  }

  loadOutboxFromFile();
  const existing = memoryOutbox.get(bookingNo);
  if (!existing) return null;

  if (updates.repairStage !== undefined) {
    existing.repairStage = updates.repairStage;
  }
  if (updates.partsReadiness !== undefined) {
    existing.partsReadiness = updates.partsReadiness;
  }
  if (updates.warrantyCount !== undefined) {
    existing.warrantiesIssued = (existing.warrantiesIssued || 0) + updates.warrantyCount;
  }

  memoryOutbox.set(bookingNo, existing);
  persistOutboxToFile();
  return existing;
}
