// lib/auth-client-utils.ts
'use client';

import { signIn, signOut as nextAuthSignOut } from "next-auth/react";

export { signIn };

export async function signOut(options?: { 
  redirect?: boolean; 
  redirectTo?: string;
}) {
  const { redirect = true, redirectTo = "/" } = options || {};
  
  await nextAuthSignOut({ 
    redirect, 
    callbackUrl: redirectTo 
  });
}