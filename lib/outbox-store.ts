import fs from "fs";
import path from "path";
import { ErpBookingRecord, INITIAL_ERP_BOOKINGS } from "./mock-erp-data";

export type OutboxBooking = ErpBookingRecord & {
  syncStatus: "DEPOSIT_PAID_ERP_SYNCED" | "PENDING_ERP_SYNC" | "FAILED";
  retryCount: number;
  lastSyncAttempt?: string;
  lastSyncError?: string;
  holdToken?: string;
  warrantiesIssued?: number;
};

// In-memory cache + persistent JSON outbox file
let memoryOutbox: Map<string, OutboxBooking> = new Map();

// Initialize memoryOutbox with INITIAL_ERP_BOOKINGS
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
    // Ignore read errors
  }
}

function persistOutboxToFile(): void {
  try {
    const filePath = getOutboxFilePath();
    const records = Array.from(memoryOutbox.values());
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch {
    // Ignore write errors
  }
}

// Load on boot
loadOutboxFromFile();

export function saveOutboxBooking(booking: OutboxBooking): void {
  memoryOutbox.set(booking.bookingNo, booking);
  persistOutboxToFile();
}

export function getOutboxBooking(bookingNo: string): OutboxBooking | undefined {
  loadOutboxFromFile();
  return memoryOutbox.get(bookingNo);
}

export function getAllOutboxBookings(): OutboxBooking[] {
  loadOutboxFromFile();
  return Array.from(memoryOutbox.values());
}

export function getPendingOutboxBookings(): OutboxBooking[] {
  loadOutboxFromFile();
  return Array.from(memoryOutbox.values()).filter(
    (b) => b.syncStatus === "PENDING_ERP_SYNC"
  );
}

export function updateBookingSyncStatus(
  bookingNo: string,
  status: "DEPOSIT_PAID_ERP_SYNCED" | "PENDING_ERP_SYNC" | "FAILED",
  error?: string
): OutboxBooking | null {
  const existing = getOutboxBooking(bookingNo);
  if (!existing) return null;

  existing.syncStatus = status;
  existing.lastSyncAttempt = new Date().toISOString();
  if (error) {
    existing.lastSyncError = error;
    existing.retryCount = (existing.retryCount || 0) + 1;
  } else {
    existing.lastSyncError = undefined;
  }

  saveOutboxBooking(existing);
  return existing;
}

export function updateBookingWorkshopStatus(
  bookingNo: string,
  updates: {
    repairStage?: 1 | 2 | 3 | 4;
    partsReadiness?: "อะไหล่พร้อมแล้ว (Parts Ready)" | "รอพัสดุส่งถึงร้าน (Inbound Pending)" | "บริการทั่วไป (General Service)";
    warrantyCount?: number;
  }
): OutboxBooking | null {
  const existing = getOutboxBooking(bookingNo);
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

  saveOutboxBooking(existing);
  return existing;
}
