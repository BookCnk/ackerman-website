import {
  CATALOG_ITEMS,
  CatalogItem,
  ErpBookingRecord,
  VEHICLES,
} from "./mock-erp-data";

const ERP_API_BASE_URL =
  process.env.ERP_API_BASE_URL || "https://erp.ackermanngarage.com";
const ERP_WEBHOOK_SECRET =
  process.env.ERP_WEBHOOK_SECRET || "ack_whsec_dev_signature_2026";

export async function fetchErpInventoryAvailability(params?: {
  vehicleId?: string;
  category?: string;
}): Promise<{
  source: "ERP_LIVE_API" | "LOCAL_SYNC_CACHE";
  erpEndpoint: string;
  vehicles: typeof VEHICLES;
  items: CatalogItem[];
}> {
  const endpoint = `${ERP_API_BASE_URL}/api/v1/inventory/availability`;

  // If external ERP URL is explicitly configured in env, attempt live fetch with 2.5s timeout
  if (process.env.ERP_API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${ERP_WEBHOOK_SECRET}`,
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return {
          source: "ERP_LIVE_API",
          erpEndpoint: endpoint,
          vehicles: data.vehicles ?? VEHICLES,
          items: data.items ?? CATALOG_ITEMS,
        };
      }
    } catch {
      // Fallback to local synchronized catalog cache when ERP is offline
    }
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

export async function dispatchBookingToErp(
  booking: ErpBookingRecord
): Promise<{
  deliveredToLiveErp: boolean;
  erpEndpoint: string;
  httpStatus: number;
}> {
  const endpoint = `${ERP_API_BASE_URL}/api/v1/webhooks/online-booking`;

  if (process.env.ERP_API_BASE_URL) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ackermann-Webhook-Secret": ERP_WEBHOOK_SECRET,
          "X-Ackermann-Event": "booking.deposit.paid",
        },
        body: JSON.stringify(booking),
        signal: controller.signal,
      });
      clearTimeout(timer);
      return {
        deliveredToLiveErp: res.ok,
        erpEndpoint: endpoint,
        httpStatus: res.status,
      };
    } catch {
      // Return simulated 200 OK if ERP server is not running locally
    }
  }

  return {
    deliveredToLiveErp: false,
    erpEndpoint: endpoint,
    httpStatus: 200,
  };
}

