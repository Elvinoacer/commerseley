import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Check if this is an admin request
    const isAdminRequest = searchParams.get("admin") === "true";

    if (isAdminRequest) {
      return NextResponse.redirect(new URL("/api/products/fetch-admin-products", req.url));
    }

    // Default to client products
    return NextResponse.redirect(new URL("/api/products/fetch-client-products", req.url));
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
