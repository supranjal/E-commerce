import { NextResponse } from "next/server";
import { SERVER_BOOT_ID } from "@/lib/server-boot";

export async function GET() {
  return NextResponse.json(
    { instanceId: SERVER_BOOT_ID },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
