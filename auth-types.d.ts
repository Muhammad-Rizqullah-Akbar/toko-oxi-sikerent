// types/auth-types.d.ts

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: "user" | "customer";
      role?: string; // Role hanya untuk user, optional untuk customer
    } & DefaultSession["user"];
  }

  interface User {
    type: "user" | "customer";
    role?: string; // Optional karena customer tidak punya role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "user" | "customer";
    role?: string; // Optional
  }
}

// Types untuk aplikasi
export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  username: string;
  role: string; // ADMIN atau STAFF
  lastLogin: Date | null;
}

export interface AuthCustomer {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  totalPoints: number;
  isVerified: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  // TIDAK ADA ROLE!
}