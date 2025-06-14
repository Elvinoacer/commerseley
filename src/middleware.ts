// src/middleware.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isMatchingPath } from "./matching-pattern";

type UserRole = "USER" | "SUPER_ADMIN"; // Adjust based on your actual roles

export const publicRoutes = [
  "/auth/register",
  "/auth/login",
  "/not-found",
  "/error",
  "/",
  "/others",
  "/about",
  "/terms",
  "/privacy",
  "/contact",
  "/faq",
  "/shipping",
  "/returns",
];

const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];
const userRoutes = ["/home", "/listing"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 1. Handle redirects for authenticated users trying to access auth pages
  if (token && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    const redirectPath = getRedirectPathForRole(token.role as UserRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 2. Check protected routes
  if (!publicRoutes.some((pubr) => isMatchingPath(pubr, pathname))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Handle role-based access
    const role = token.role as UserRole;

    if (role === "SUPER_ADMIN" && userRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/super-admin", request.url));
    }

    if (role !== "SUPER_ADMIN" && superAdminRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

// Helper function to get redirect path based on role
function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin";
    default:
      return "/home";
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
