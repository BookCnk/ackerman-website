import { NextResponse } from "next/server";
import { fetchErpInventoryAvailability } from "@/lib/erp-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const categoryId = searchParams.get("categoryId") || searchParams.get("category_id") || undefined;
  const search = searchParams.get("search") || searchParams.get("q") || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
  const date = searchParams.get("date") ?? undefined;

  const result = await fetchErpInventoryAvailability({
    vehicleId,
    category,
    categoryId,
    search,
    page,
    limit,
    date,
  });

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
