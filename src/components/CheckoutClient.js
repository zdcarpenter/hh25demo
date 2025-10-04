"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutClient() {
  const params = useSearchParams();
  const product = params.get('product') || 'sku-1';

  const [message, setMessage] = useState('');

  async function startCheckout() {
    setMessage('Creating checkout session...');
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ product }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      setMessage(data.error || 'Failed to create checkout session');
    }
  }

  return (
    <div style={{maxWidth: 480}}>
      <h1>Checkout</h1>
      <p>Buying <strong>{product}</strong></p>

      <div style={{marginTop:12}}>
        <button onClick={startCheckout}>Pay with Stripe</button>
      </div>

      {message && <p style={{marginTop:12}}><em>{message}</em></p>}
    </div>
  );
}
