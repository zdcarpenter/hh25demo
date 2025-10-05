"use client";

import React, { useState } from 'react';

// PayPalRedirect: Stripe-like redirect flow for PayPal.
// Props:
// - amount: string | number (USD amount to charge)
// - onMessage?: (msg: string) => void
// - isDisabled?: boolean (disable when awaiting product data, etc)
export default function PayPalRedirect({ amount, onMessage, isDisabled = false }) {
  const [isStarting, setIsStarting] = useState(false);

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
        window.location.href = approve.href;
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
