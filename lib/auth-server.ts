// lib/auth-server.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email/WhatsApp/Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        // Cek di tabel User (staff/admin) terlebih dahulu
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ],
            isActive: true
          }
        });

        if (user) {
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (isValidPassword) {
            return {
              id: user.id,
              email: user.email || user.username,
              name: user.name,
              role: user.role,
              type: 'user' as const
            };
          }
        }

        // Jika bukan user, cek di tabel Customer
        const customer = await prisma.customer.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { whatsapp: credentials.identifier }
            ],
            isActive: true
          }
        });

        if (customer && customer.password) {
          const isValidPassword = await bcrypt.compare(credentials.password, customer.password);
          if (isValidPassword) {
            return {
              id: customer.id,
              email: customer.email || customer.whatsapp,
              name: customer.name,
              type: 'customer' as const
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.type = token.type as "user" | "customer";
        session.user.role = token.role as Role;
      }
      return session;
    }
  }
};