// auth.ts (Root Project)

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// NOTE: Interface ini harus ada dan sama persis dengan yang didefinisikan 
// di file auth-types.d.ts Anda (file deklarasi tipe kustom).
interface CustomUser {
    id: string;
    name: string | null;
    email: string | null | undefined;
    role: 'customer' | 'admin' | 'staff'; // Sesuaikan jika ada role lain
}

export const { 
    handlers, // WAJIB: Untuk file app/api/auth/[...nextauth]/route.ts
    auth, // WAJIB: Untuk Server Components (misal: Header.tsx)
    signIn, // WAJIB: Untuk Server Actions
    signOut // WAJIB: Untuk Server Actions
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', 
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                whatsapp: { label: 'WhatsApp', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.whatsapp || !credentials.password) {
                    return null;
                }

                const customer = await prisma.customer.findUnique({
                    where: { whatsapp: credentials.whatsapp as string },
                });

                if (!customer || !customer.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    customer.password
                );

                if (isValid) {
                    return {
                        id: customer.id,
                        name: customer.name,
                        email: customer.email || undefined,
                        role: 'customer', 
                    } as CustomUser; // Type Assertion untuk memenuhi CustomUser
                }
                
                return null;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                const customUser = user as CustomUser; 
                token.id = customUser.id;
                token.role = customUser.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as string; 
                // Type Assertion ke tipe literal yang spesifik
                session.user.role = token.role as ('customer' | 'admin' | 'staff'); 
            }
            return session;
        },
    },
});