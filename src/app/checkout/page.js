import React, { Suspense } from 'react';
import CheckoutClient from '../../components/CheckoutClient';
import { Loader2, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center space-y-6 py-20">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xl font-medium">Loading secure checkout...</span>
        </div>
        <p className="text-muted-foreground text-center max-w-md">
          Please wait while we prepare your secure payment environment
        </p>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
