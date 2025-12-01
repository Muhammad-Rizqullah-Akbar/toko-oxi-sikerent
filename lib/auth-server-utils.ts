// lib/auth-server-utils.ts

// Mengimpor semua named exports dari auth.ts di root project
import * as authExports from '@/auth'; 

// [SOLUSI DEFINITIF] Ekspor ulang fungsi auth dan signOut
// Ini memastikan bahwa fungsi-fungsi tersebut dievaluasi di runtime yang benar
export const auth = authExports.auth;
export const signOut = authExports.signOut;