"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCart, clearCart } from '../lib/cart';

export default function CheckoutClient() {
  const params = useSearchParams();
  const singleProduct = params.get('product') || null;

  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);

  useEffect(()=>{
    const cart = getCart();
    if (singleProduct) {
      setItems([{ id: singleProduct, name: singleProduct, price: 0, qty: 1 }, ...cart]);
    } else setItems(cart);
  }, [singleProduct]);

  async function startCheckout() {
    if (!items || items.length === 0) return setMessage('Cart is empty');
    setMessage('Creating checkout session...');
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      clearCart();
      window.location.href = data.url;
    } else {
      setMessage(data.error || 'Failed to create checkout session');
    }
  }

  return (
    <div style={{maxWidth: 640}}>
      <h1>Checkout</h1>

      {items.length === 0 ? (
        <p>Your cart is empty. Go to <a href="/shop">shop</a>.</p>
      ) : (
        <div>
          <ul>
            {items.map(it=> (
              <li key={it.id} style={{marginBottom:8}}>{it.name} — ${it.price?.toFixed?.(2) ?? '0.00'} x {it.qty}</li>
            ))}
          </ul>
          <div style={{marginTop:12}}>
            <button onClick={startCheckout}>Pay with Stripe</button>
          </div>
          {message && <p style={{marginTop:12}}><em>{message}</em></p>}
        </div>
      )}
    </div>
  );
}
