// lib/auth-server.ts

// Import semua named exports dari auth.ts
import * as authExports from '@/auth';

// Export ulang fungsi auth dan signOut
export const { auth, signOut } = authExports;