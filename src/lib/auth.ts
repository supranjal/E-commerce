import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const emailLower = credentials.email.toLowerCase().trim();

        // 1. Check database if connected
        try {
          const user = await prisma.user.findUnique({
            where: { email: emailLower },
          });

          if (user) {
            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (isMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (error) {
          console.warn("Database auth check failed, checking mock credentials:", error);
        }

        // 2. Demo fallback accounts for academic evaluation
        if (
          emailLower === "admin@rudrakart.com" &&
          credentials.password === "Admin@12345"
        ) {
          return {
            id: "admin-demo-id",
            name: "RudraKart Administrator",
            email: "admin@rudrakart.com",
            role: "ADMIN",
          };
        }

        if (
          emailLower === "customer@rudrakart.com" &&
          credentials.password === "Customer@12345"
        ) {
          return {
            id: "customer-demo-id",
            name: "Aarav Sharma",
            email: "customer@rudrakart.com",
            role: "CUSTOMER",
          };
        }

        throw new Error("Invalid email or password.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "CUSTOMER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "rudrakart_development_secret_academic_2026",
};
