import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

export default function MfaFailurePage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Verification failed</h1>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t complete the multi-factor verification. This can happen if the session expired or was canceled.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/checkout">
                <RotateCcw className="mr-2 h-4 w-4" /> Try checkout again
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            If the issue persists, please try again later or contact support.
          </p>
        </div>
      </div>
    </main>
  );
}
