// src/lib/auth-helpers.ts
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

type User = {
  id: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

/**
 * Checks if user is authenticated
 * @param req NextRequest or NextApiRequest
 * @returns Returns user object if authenticated, otherwise throws error
 */
export async function requireAuth(req: NextRequest | NextApiRequest): Promise<User> {
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.sub || !token.email || !token.role) {
    throw new Error("Not authenticated");
  }

  return {
    id: token.sub,
    email: token.email,
    role: token.role as "USER" | "SUPER_ADMIN",
  };
}

/**
 * Checks if user is a super admin
 * @param req NextRequest or NextApiRequest
 * @returns Returns user object if super admin, otherwise throws error
 */
export async function requireSuperAdmin(req: NextRequest | NextApiRequest): Promise<User> {
  const user = await requireAuth(req);

  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super admin access required");
  }

  return user;
}
