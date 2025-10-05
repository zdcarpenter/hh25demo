"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

// PayPalRedirect: Stripe-like redirect flow for PayPal.
// Props:
// - amount: string | number (USD amount to charge)
// - onMessage?: (msg: string) => void
// - isDisabled?: boolean (disable when awaiting product data, etc)
export default function PayPalRedirect({ amount, onMessage, isDisabled = false }) {
  const [isStarting, setIsStarting] = useState(false);
  const { data: session } = useSession();

  async function startPayPal() {
    if (isDisabled || isStarting) return;
    try {
      setIsStarting(true);
      const val = (typeof amount === 'number' ? amount.toFixed(2) : String(amount || '0.00'));
      onMessage?.('Creating PayPal order...');
  const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: val }),
      });
      const json = await res.json();
      if (!res.ok) {
        onMessage?.('Failed to create PayPal order');
        setIsStarting(false);
        return;
      }
      const approve = json.links && json.links.find((l) => l.rel === 'approve');
      if (approve && approve.href) {
        // Wrap with MFA session creation (mandatory)
        onMessage?.('Starting verification...');
        const email = session?.user?.email || '';
        try {
          const mfaReq = await fetch('http://localhost:3000/api/v1/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-merchant-id': 'mch_2q1pj10y',
              'Authorization': 'mk_test_bSl7UzrGG0HR_IJj-q2GiAmaV3jtIoitt-Fbb5WYTF0',
            },
            body: JSON.stringify({
              appId: 'app_jvijdrec',
              amount: Number(val),
              currency: 'USD',
              user: { email },
              successUrl: approve.href,
              failureUrl: `${window.location.origin}/mfa/failure`,
            }),
          });

          // robust parse
          let mfaRaw;
          try { mfaRaw = await mfaReq.text(); } catch { mfaRaw = ''; }
          let mfa = {};
          try { mfa = JSON.parse(mfaRaw || '{}'); } catch { /* plain text */ }
          const mfaUrl = (mfa && (mfa.url || mfa.redirectUrl || mfa.mfaUrl)) || (mfaRaw && /^https?:\/\//.test(mfaRaw) ? mfaRaw : null);

          if (mfaReq.ok && mfaUrl) {
            window.location.href = mfaUrl;
            return;
          }
        } catch (e) {
          // fall through to error UI
        }

        onMessage?.('Verification service unavailable. Please try again.');
        setIsStarting(false);
      } else {
        onMessage?.('No approval link from PayPal');
        setIsStarting(false);
      }
    } catch (e) {
      onMessage?.('Failed to start PayPal checkout');
      setIsStarting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={startPayPal}
      disabled={isStarting || isDisabled}
      className="w-full mb-2 px-4 py-2 bg-[#ffc439] text-black rounded font-medium hover:brightness-95 disabled:opacity-70"
    >
      {isStarting ? 'Starting PayPal...' : 'Pay with PayPal'}
    </button>
  );
}
