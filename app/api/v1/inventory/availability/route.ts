import { NextResponse } from "next/server";
import { fetchErpInventoryAvailability } from "@/lib/erp-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const result = await fetchErpInventoryAvailability({ vehicleId, category });

  return NextResponse.json({
    ok: true,
    ...result,
  });
}

