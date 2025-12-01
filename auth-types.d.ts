// auth-types.d.ts

// Augmentasi tipe untuk JWT dan Session
import 'next-auth/jwt';
import { DefaultSession, DefaultUser } from 'next-auth';

// --- Interface untuk User/AdapterUser (dari fungsi authorize) ---
// Kita perlu mendefinisikan role untuk digunakan di JWT
interface CustomUser extends DefaultUser {
    id: string;
    role?: 'customer' | 'admin' | 'staff'; // Tambahkan role Anda
}

// --- Modifikasi Tipe Session ---
// Tipe ini digunakan saat memanggil 'session' di frontend atau di Server Component
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: CustomUser & DefaultSession['user'];
    }
}

// --- Modifikasi Tipe JWT ---
// Tipe ini digunakan di JWT token (cookie)
declare module 'next-auth/jwt' {
    interface JWT {
        id: string; // [FIX 2] Tambahkan id ke JWT
        role?: 'customer' | 'admin' | 'staff'; // [FIX 1] Tambahkan role ke JWT
    }
}