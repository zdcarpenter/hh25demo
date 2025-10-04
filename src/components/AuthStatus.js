"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthStatus() {
  // Defensive: useSession may be undefined during certain prerender steps in the build.
  // Guard against that so the server build doesn't crash.
  const maybeSession = typeof useSession === 'function' ? useSession() : { data: null };
  const session = maybeSession?.data;

  if (!session || !session.user) {
    return (
      <div style={{display:'flex', gap:8}}>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>
    );
  }

  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <span style={{fontSize:13}}>Hi, {session.user.name || session.user.email}</span>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
