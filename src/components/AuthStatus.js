"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogIn, UserPlus, LogOut, Crown } from 'lucide-react';

export default function AuthStatus() {
  // Defensive: useSession may be undefined during certain prerender steps in the build.
  // Guard against that so the server build doesn't crash.
  const maybeSession = typeof useSession === 'function' ? useSession() : { data: null };
  const session = maybeSession?.data;

  if (!session || !session.user) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/auth/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/auth/register"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
        >
          <UserPlus size={16} />
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {session.user.name || session.user.email}
          </p>
          <p className="text-xs text-muted-foreground">Welcome back!</p>
        </div>
      </div>
      <button 
        onClick={() => signOut()}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
      >
        <LogOut size={16} />
        <span className="hidden md:inline">Sign Out</span>
      </button>
    </div>
  );
}
