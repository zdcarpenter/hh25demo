"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

// StripeCheckout: standalone Stripe button that mirrors the prior inline behavior
// Props:
// - useSingleProduct: boolean (if true, send { product: singleProductId })
// - singleProductId: string | null
// - items: array of cart-like items [{ id, name, price, quantity|qty }]
// - isDisabled: boolean (disable while single product details are loading)
// - onMessage?: (msg: string) => void
// - onDebug?: (payload: any, response: any) => void
export default function StripeCheckout({ useSingleProduct, singleProductId, items, isDisabled, onMessage, onDebug }) {
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();

  async function startCheckout() {
    const noItems = !items || items.length === 0;
    if (!useSingleProduct && noItems) {
      onMessage?.('Cart is empty');
      return;
    }
    if (useSingleProduct && !singleProductId) {
      onMessage?.('Missing product');
      return;
    }

    setIsProcessing(true);
    onMessage?.('Creating secure checkout session...');

    try {
      const payload = useSingleProduct
        ? { product: singleProductId }
        : {
            items: items.map((it) => ({
              id: it.id,
              name: it.name,
              price: it.price,
              qty: Number(it.quantity ?? it.qty ?? 1),
            })),
          };

      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try { data = await res.json(); } catch {
        const text = await res.text().catch(() => 'no-body');
        data = { error: text };
      }

      onDebug?.(payload, { status: res.status, body: data });

      if (res.ok && data.url) {
        // Step 2: Call MFA API to create a session with successUrl set to the Stripe checkout URL
        onMessage?.('Starting verification...');

        const email = session?.user?.email || '';
        const calcTotal = (items || []).reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity ?? it.qty ?? 1) || 0), 0);

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const mfaBody = {
          appId: 'app_jvijdrec',
          amount: Number(calcTotal.toFixed(2)),
          currency: 'USD',
          user: { email },
          successUrl: data.url,
          failureUrl: `${origin}/mfa/failure`,
        };

        const mfaReq = await fetch('https://open-mfa.vercel.app/api/v1/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-merchant-id': 'mch_2q1pj10y',
            'Authorization': 'mk_test_bSl7UzrGG0HR_IJj-q2GiAmaV3jtIoitt-Fbb5WYTF0',
          },
          body: JSON.stringify(mfaBody),
        });

        // Parse MFA response robustly (JSON or plain URL string)
        let mfaRaw;
        try { mfaRaw = await mfaReq.text(); } catch { mfaRaw = ''; }
        let mfa = {};
        try { mfa = JSON.parse(mfaRaw || '{}'); } catch { /* not JSON */ }
        const mfaUrl = (mfa && (mfa.url || mfa.redirectUrl || mfa.mfaUrl)) || (mfaRaw && /^https?:\/\//.test(mfaRaw) ? mfaRaw : null);

        // Log MFA response for debugging
        try {
          console.debug('[MFA] request body', mfaBody);
          console.debug('[MFA] response status', mfaReq.status);
          console.debug('[MFA] response raw', mfaRaw);
          console.debug('[MFA] response parsed', mfa);
        } catch {}
        onDebug?.({ kind: 'mfa', request: mfaBody }, { status: mfaReq.status, body: mfaRaw, parsed: mfa });

        if (mfaReq.ok && mfaUrl) {
          onMessage?.('Redirecting to verification...');
          try { clearCart(); } catch {}
          try {
            window.location.href = mfaUrl;
          } catch (err) {
            onMessage?.('Redirect failed. Open this URL manually: ' + (mfaUrl || ''));
            setIsProcessing(false);
          }
        } else {
          onMessage?.('Verification service unavailable. Please try again.');
          setIsProcessing(false);
        }
      } else {
        onMessage?.(`Failed to create checkout session (status ${res.status}): ${data.error || JSON.stringify(data)}`);
        setIsProcessing(false);
      }
    } catch (error) {
      onMessage?.('Network error. Please try again.');
      setIsProcessing(false);
    }
  }

  return (
    <Button onClick={startCheckout} disabled={isProcessing || isDisabled} className="w-full mt-6" size="lg">
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with Stripe
        </>
      )}
    </Button>
  );
}
