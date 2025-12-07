// auth.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-server";

// Export handler untuk API route
const handler = NextAuth(authOptions);

// Export untuk client/server components
export const auth = () => {
  if (typeof window !== "undefined") {
    throw new Error("`auth()` should only be used on the server");
  }
  return NextAuth(authOptions);
};

// Export untuk penggunaan lain
export { 
  handler as GET, 
  handler as POST,
  NextAuth,
  authOptions 
};