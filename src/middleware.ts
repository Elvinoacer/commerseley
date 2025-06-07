import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isMatchingPath } from "./matching-pattern";
import { API_ROUTES } from "./utils/api";

export const publicRoutes = [
  "/auth/register",
  "/auth/login",
  "/",
  "/listing",
  "/listing/:path*",
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
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET));
      const { role } = payload as {
        role: string;
      };

      // if (publicRoutes.includes(pathname)) {
      //   return NextResponse.redirect(new URL(role === "SUPER_ADMIN" ? "/super-admin" : "/home", request.url));
      // }

      if (role === "SUPER_ADMIN" && userRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/super-admin", request.url));
      }
      if (role !== "SUPER_ADMIN" && superAdminRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      return NextResponse.next();
    } catch (e) {
      console.error("Token verification failed", e);
      const refreshResponse = await fetch(`${API_ROUTES}/auth/refresh-token `, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        response.cookies.set("accessToken", refreshResponse.headers.get("Set-Cookie") || "");
        return response;
      } else {
        //ur refresh is also failed
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  // !publicRoutes.includes(pathname) || removed

  if (!publicRoutes.some((pubr) => isMatchingPath(pubr, pathname))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
