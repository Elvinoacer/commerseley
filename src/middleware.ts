// // src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { isMatchingPath } from "./matching-pattern";
// import { API_ROUTES } from "./utils/api";

// export const publicRoutes = [
//   "/auth/register",
//   "/auth/login",
//   "/",
//   // "/listing",
//   // "/listing/:path*",
//   "/others",
//   "/about",
//   "/terms",
//   "/privacy",
//   "/contact",
//   "/faq",
//   "/shipping",
//   "/returns",
// ];
// const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];
// const userRoutes = ["/home", "/listing"];

// export async function middleware(request: NextRequest) {
//   const accessToken = request.cookies.get("accessToken")?.value;
//   const { pathname } = request.nextUrl;

//   if (accessToken) {
//     try {
//       const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET));
//       const { role } = payload as { role: string };

//       if (role === "SUPER_ADMIN" && userRoutes.some((route) => pathname.startsWith(route))) {
//         return NextResponse.redirect(new URL("/super-admin", request.url));
//       }
//       if (role !== "SUPER_ADMIN" && superAdminRoutes.some((route) => pathname.startsWith(route))) {
//         return NextResponse.redirect(new URL("/home", request.url));
//       }

//       return NextResponse.next();
//     } catch (e) {
//       console.error("Token verification failed", e);
//       // Attempt to refresh the token
//       const refreshResponse = await fetch(`${API_ROUTES.AUTH}/refresh-token`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (refreshResponse.ok) {
//         // Clone the response to modify cookies
//         const response = NextResponse.next();
//         // The refreshed cookies should be automatically set by the browser
//         return response;
//       } else {
//         // Refresh failed, redirect to login
//         const response = NextResponse.redirect(new URL("/auth/login", request.url));
//         response.cookies.delete("accessToken");
//         response.cookies.delete("refreshToken");
//         return response;
//       }
//     }
//   }

//   // Redirect to login for non-public routes
//   if (!publicRoutes.some((pubr) => isMatchingPath(pubr, pathname))) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// Updated middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isMatchingPath } from "./matching-pattern";
import { API_ROUTES } from "./utils/api";

export const publicRoutes = [
  "/auth/register",
  "/auth/login",
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
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Allow CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      },
    });
  }

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET));
      const { role } = payload as { role: string };

      if (role === "SUPER_ADMIN" && userRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/super-admin", request.url));
      }
      if (role !== "SUPER_ADMIN" && superAdminRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      return NextResponse.next();
    } catch (e) {
      console.error("Token verification failed", e);
      const refreshResponse = await fetch(`${API_ROUTES.AUTH}/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        // Ensure CORS headers are set
        response.headers.set("Access-Control-Allow-Origin", "https://commersely-starterup.vercel.app");
        response.headers.set("Access-Control-Allow-Credentials", "true");
        return response;
      } else {
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  if (!publicRoutes.some((pubr) => isMatchingPath(pubr, pathname))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
