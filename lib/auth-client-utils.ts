// lib/auth-client-utils.ts

// Kita impor semua eksport dari auth.ts di root project
import * as authExports from '@/auth'; 

// [FIX UTAMA] Ekspor ulang fungsi auth dan signOut
// Ini memaksa modul untuk dievaluasi dengan benar di runtime.
export const auth = authExports.auth;
export const signOut = authExports.signOut;