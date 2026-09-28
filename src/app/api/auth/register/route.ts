import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
  phone: z.string().trim().min(7).max(32),
  address: z.string().trim().min(5).max(250),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Enter a valid name, email, password, phone, and address. Passwords must be at least 12 characters.",
        },
        { status: 400 },
      );
    }
    const { name, email, password, phone, address } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        phone,
        address,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Customer registration failed:", error);
    return NextResponse.json(
      { error: "Registration could not be completed. Please try again." },
      { status: 500 },
    );
  }
}
