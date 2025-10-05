"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { createMfaSession } from '@/lib/mfaClient';

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
        onMessage?.('Starting verification...');
        const email = session?.user?.email || '';
        try {
          const mfaUrl = await createMfaSession({ amount: Number(val), successUrl: approve.href, email });
          window.location.href = mfaUrl;
          return;
        } catch (e) {
          onMessage?.('Verification service unavailable. Please try again.');
          setIsStarting(false);
        }
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
