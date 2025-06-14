import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const { searchParams } = new URL(req.url);

    // Check if this is an admin request
    const isAdminRequest = searchParams.get("admin") === "true";

    if (isAdminRequest) {
      return NextResponse.redirect(new URL("/api/orders/get-all-orders-for-admin", req.url));
    }

    // Default to user orders
    return NextResponse.redirect(new URL("/api/orders/get-order-by-user-id", req.url));
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
