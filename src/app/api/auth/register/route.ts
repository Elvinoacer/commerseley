// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations/auth";
import { notifyAdminsAboutNewUser } from "../[...nextauth]/utils";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = signupSchema.parse(data);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "USER",
      },
    });
    await notifyAdminsAboutNewUser(user.id);

    return NextResponse.json({
      success: true,
      userId: user.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
