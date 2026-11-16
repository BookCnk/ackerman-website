import {
  CATALOG_ITEMS,
  CatalogItem,
  ErpBookingRecord,
  VEHICLES,
  getCategoryFallbackImage,
  getSmartProductImage,
  getSmartProductGallery,
  getCategoryLaborInfo,
  buildItemSpecs,
} from "./mock-erp-data";
import { createErpSignatureHeaders } from "./erp-crypto";

const ERP_API_BASE_URL =
  (process.env.ERP_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

export type LiveCategory = {
  id: number;
  name: string;
  sort_order: number;
  product_count: number;
};

export type LiveAvailabilityResult = {
  source: "ERP_LIVE_API" | "LOCAL_SYNC_CACHE";
  erpEndpoint: string;
  vehicles: typeof VEHICLES;
  categories?: LiveCategory[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  items: CatalogItem[];
  bookedAppointments?: { appointment_date: string; appointment_time: string; booked_count: number }[];
  activeHolds?: { appointment_date: string; appointment_slot: string; hold_count: number }[];
};

export type SoftHoldResult = {
  success: boolean;
  holdToken?: string;
  bookingNo?: string;
  expiresAt?: string;
  expiresInSeconds?: number;
  message?: string;
  isMock?: boolean;
};

export type DispatchResult = {
  deliveredToLiveErp: boolean;
  erpEndpoint: string;
  httpStatus: number;
  appointmentId?: number;
  actions?: string[];
  error?: string;
};

/**
 * Real-time fetch of inventory stock and booked appointment slots from ERP via HMAC-authenticated API.
 */
export async function fetchErpInventoryAvailability(params?: {
  vehicleId?: string;
  category?: string;
  categoryId?: number | string;
  search?: string;
  page?: number;
  limit?: number;
  date?: string;
}): Promise<LiveAvailabilityResult> {
  const queryParams = new URLSearchParams();
  if (params?.date) queryParams.set("date", params.date);
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.categoryId) queryParams.set("category_id", params.categoryId.toString());
  if (params?.search) queryParams.set("search", params.search);

  const qs = queryParams.toString();
  const endpoint = `${ERP_API_BASE_URL}/api/v1/storefront/availability${qs ? `?${qs}` : ""}`;

  try {
    const sigHeaders = createErpSignatureHeaders("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...sigHeaders,
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        // Map live ERP products to standard CatalogItem
        const liveItems: CatalogItem[] = data.items.map((it: {
          productId: number;
          sku: string;
          name: string;
          brand: string;
          model?: string;
          categoryName?: string;
          imagePath?: string | null;
          available: number;
          stockStatus: "IN_STOCK" | "PRE_ORDER";
          leadTimeDays: number;
          sellPrice: number;
          attributes?: Record<string, any>;
        }) => {
          const curated = CATALOG_ITEMS.find((c) => c.sku === it.sku);
          if (curated) {
            return {
              ...curated,
              partPrice: it.sellPrice > 0 ? it.sellPrice : curated.partPrice,
              stockQty: it.available,
              stockStatus: it.stockStatus,
              leadTimeDays: it.leadTimeDays,
            };
          }

          const labor = getCategoryLaborInfo(it.categoryName);
          const specs = buildItemSpecs(it.brand, it.model, it.attributes, it.categoryName);
          const image = it.imagePath || getSmartProductImage(it.categoryName, it.brand, it.name);
          const galleryImages = getSmartProductGallery(it.categoryName, it.brand, it.name);

          return {
            id: `erp-${it.productId}`,
            sku: it.sku || `SKU-${it.productId}`,
            name: it.name,
            category: it.categoryName || "Others",
            brand: it.brand || "Ackermann Standard",
            image,
            galleryImages,
            partPrice: it.sellPrice || 0,
            laborPrice: labor.laborPrice,
            installHours: labor.installHours,
            stockStatus: it.stockStatus,
            stockQty: it.available,
            leadTimeDays: it.leadTimeDays,
            compatibleVehicles: ["ALL"],
            specs,
            warrantyMonths: labor.warrantyMonths,
            warrantyKm: labor.warrantyKm,
          };
        });

        return {
          source: "ERP_LIVE_API",
          erpEndpoint: endpoint,
          vehicles: VEHICLES,
          categories: data.categories || [],
          total: data.total,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
          items: liveItems,
          bookedAppointments: data.bookedAppointments,
          activeHolds: data.activeHolds,
        };
      }
    }
  } catch {
    // Fallback to local synchronized catalog cache when ERP is offline
  }

  let filtered = [...CATALOG_ITEMS];
  if (params?.vehicleId && params.vehicleId !== "ALL") {
    filtered = filtered.filter(
      (i) =>
        i.compatibleVehicles.includes("ALL") ||
        i.compatibleVehicles.includes(params.vehicleId!)
    );
  }
  if (params?.category) {
    filtered = filtered.filter((i) => i.category === params.category);
  }

  return {
    source: "LOCAL_SYNC_CACHE",
    erpEndpoint: endpoint,
    vehicles: VEHICLES,
    items: filtered,
  };
}

/**
 * Fetch a single product by ID or SKU from curated catalog or live ERP
 */
export async function getProductById(id: string): Promise<CatalogItem | null> {
  const cleanId = (id || "").trim();
  if (!cleanId) return null;

  // 1. Check curated catalog first
  const curated = CATALOG_ITEMS.find(
    (c) => c.id === cleanId || c.sku === cleanId || c.id.toLowerCase() === cleanId.toLowerCase()
  );
  if (curated) {
    return {
      ...curated,
      galleryImages: curated.galleryImages || getSmartProductGallery(curated.category, curated.brand, curated.name),
    };
  }

  // 2. Fetch from ERP API if it is an ERP product (e.g. erp-123, 123, or barcode)
  const numericId = cleanId.startsWith("erp-") ? cleanId.replace("erp-", "") : cleanId;
  const isNumeric = /^\d+$/.test(numericId);
  const endpoint = isNumeric
    ? `${ERP_API_BASE_URL}/api/v1/storefront/availability?product_id=${encodeURIComponent(numericId)}`
    : `${ERP_API_BASE_URL}/api/v1/storefront/availability?search=${encodeURIComponent(cleanId)}&limit=10`;

  try {
    const rawBody = "";
    const sigHeaders = createErpSignatureHeaders(rawBody);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...sigHeaders,
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        const item = data.items.find(
          (it: any) =>
            String(it.productId) === String(numericId) ||
            it.sku === cleanId ||
            `erp-${it.productId}` === cleanId
        ) || data.items[0];

        if (item) {
          const labor = getCategoryLaborInfo(item.categoryName);
          const specs = buildItemSpecs(item.brand, item.model, item.attributes, item.categoryName);
          const image = item.imagePath || getSmartProductImage(item.categoryName, item.brand, item.name);
          const galleryImages = getSmartProductGallery(item.categoryName, item.brand, item.name);

          return {
            id: `erp-${item.productId}`,
            sku: item.sku || `SKU-${item.productId}`,
            name: item.name,
            category: item.categoryName || "Others",
            brand: item.brand || "Ackermann Standard",
            image,
            galleryImages,
            partPrice: item.sellPrice || 0,
            laborPrice: labor.laborPrice,
            installHours: labor.installHours,
            stockStatus: item.stockStatus,
            stockQty: item.available,
            leadTimeDays: item.leadTimeDays,
            compatibleVehicles: ["ALL"],
            specs,
            warrantyMonths: labor.warrantyMonths,
            warrantyKm: labor.warrantyKm,
          };
        }
      }
    }
  } catch {
    // Fallback if ERP is offline
  }

  return null;
}

/**
 * Locks requested items and appointment bay slot for 15 minutes while customer scans PromptPay QR.
 */
export async function createErpSoftHold(payload: {
  booking_no: string;
  customer_name: string;
  customer_phone: string;
  license_plate: string;
  appointment_date: string;
  appointment_slot: string;
  bay_type?: string;
  items: { sku: string; quantity: number; name: string; stockStatus: string }[];
}): Promise<SoftHoldResult> {
  const endpoint = `${ERP_API_BASE_URL}/api/v1/storefront/holds`;
  const rawBody = JSON.stringify(payload);

  try {
    const sigHeaders = createErpSignatureHeaders(rawBody);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...sigHeaders,
      },
      body: rawBody,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        holdToken: data.holdToken,
        bookingNo: data.bookingNo,
        expiresAt: data.expiresAt,
        expiresInSeconds: data.expiresInSeconds || 900,
        message: data.message,
      };
    }
  } catch {
    // Fallback simulated soft hold if ERP is offline
  }

  const expires = new Date(Date.now() + 15 * 60 * 1000);
  return {
    success: true,
    holdToken: `hld_local_${Date.now().toString(36)}`,
    bookingNo: payload.booking_no,
    expiresAt: expires.toISOString(),
    expiresInSeconds: 900,
    message: "ระบบล็อกสต็อกและคิวช่องซ่อม 15 นาทีเรียบร้อยแล้ว (Local Fallback)",
    isMock: true,
  };
}

/**
 * Releases soft hold if customer cancels payment.
 */
export async function releaseErpSoftHold(holdToken: string): Promise<boolean> {
  const endpoint = `${ERP_API_BASE_URL}/api/v1/storefront/holds/${holdToken}`;

  try {
    const sigHeaders = createErpSignatureHeaders("");
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        ...sigHeaders,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Confirms payment and triggers full auto-processing in ERP:
 * Upsert Customer/Car + Confirm Appointment + Reserve Stock / Special Order + Cash Flow Entry.
 */
export async function dispatchBookingToErp(
  booking: ErpBookingRecord,
  holdToken?: string
): Promise<DispatchResult> {
  const endpoint = `${ERP_API_BASE_URL}/api/v1/storefront/bookings/confirm`;
  const payload = {
    ...booking,
    holdToken,
  };
  const rawBody = JSON.stringify(payload);

  try {
    const sigHeaders = createErpSignatureHeaders(rawBody);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...sigHeaders,
      },
      body: rawBody,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return {
        deliveredToLiveErp: true,
        erpEndpoint: endpoint,
        httpStatus: res.status,
        appointmentId: data.appointmentId,
        actions: data.actions,
      };
    }

    return {
      deliveredToLiveErp: false,
      erpEndpoint: endpoint,
      httpStatus: res.status,
      error: `ERP returned HTTP ${res.status}`,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      deliveredToLiveErp: false,
      erpEndpoint: endpoint,
      httpStatus: 503,
      error: errorMessage,
    };
  }
}
