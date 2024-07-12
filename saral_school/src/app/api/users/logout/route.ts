import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  cookies().delete("token");
  return NextResponse.json({
    message: "Logged out successfully",
  });
}
