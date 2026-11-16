import { NextResponse } from "next/server";
import { createErpSoftHold, releaseErpSoftHold } from "@/lib/erp-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createErpSoftHold(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create soft hold";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const holdToken = searchParams.get("token");
    if (!holdToken) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
    }
    const ok = await releaseErpSoftHold(holdToken);
    return NextResponse.json({ success: ok });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to release soft hold";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
