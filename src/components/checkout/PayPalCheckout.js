"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

// Minimal PayPal checkout component.
// - Uses server-side /api/paypal/create-order and /api/paypal/capture-order
// - If cart is empty and a product query param is present, fetch product price
// - Renders PayPal Buttons when SDK loads, otherwise shows a simple fallback
export default function PayPalCheckout({ amount }) {
  const router = useRouter();
  const params = useSearchParams();
  const singleProductId = params.get('product');
  const { clearCart } = useCart();
  const paypalRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const renderRef = useRef({ productPrice: null });
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSinglePriceIfNeeded() {
      try {
        if ((amount === '0.00' || amount === 0 || !amount) && singleProductId) {
          const res = await fetch(`/api/products/${singleProductId}`);
          if (!res.ok) return;
          const json = await res.json();
          if (json && json.price) {
            renderRef.current.productPrice = String(json.price);
          }
        }
      } catch (e) {
        // ignore
      }
    }

    fetchSinglePriceIfNeeded();

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || (typeof window !== 'undefined' && window.__NEXT_PUBLIC_PAYPAL_CLIENT_ID);
    if (!clientId) {
      setMessage('PayPal client ID not configured.');
      return;
    }

    const src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;

    function renderButtonsLocal() {
      // ensure container still in DOM
      const container = buttonsContainerRef.current || paypalRef.current;
      if (!container || !document.body.contains(container) || !window.paypal) return;
      if (container.dataset && container.dataset.paypalRendered === '1') return;
      // clear only the inner buttons container
      try { container.innerHTML = ''; } catch (e) { /* ignore DOM exceptions */ }

      const payloadAmount = (renderRef.current.productPrice && renderRef.current.productPrice !== '0.00') ? renderRef.current.productPrice : (amount || '0.00').toString();

      const buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: function () {
          setMessage('Creating order...');
          return fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: payloadAmount }),
          })
            .then((res) => res.json())
            .then((json) => json.id);
        },
        onApprove: function (data) {
          setMessage('Capturing order...');
          return fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID }),
          })
            .then((res) => res.json())
            .then(() => {
              if (!mounted) return;
              clearCart();
              router.push('/success');
            })
            .catch(() => setMessage('Capture failed'));
        },
        onError: function (err) {
          setMessage('PayPal error');
        },
      });

      try {
        const rendered = buttons.render(container);
        if (rendered && typeof rendered.then === 'function') {
          rendered.then(() => {
            if (container) container.dataset.paypalRendered = '1';
          }).catch(() => {});
        } else {
          if (container) container.dataset.paypalRendered = '1';
        }
      } catch (err) {
        // ignore render errors
      }
    }

    // if SDK already present, render immediately
    if (typeof window !== 'undefined' && window.paypal) {
      renderButtonsLocal();
      return () => { mounted = false; };
    }

    // avoid loading duplicate script tags; attach/detach listeners properly
    const existing = document.querySelector('script[src^="https://www.paypal.com/sdk/js"]');
    let script = null;
    let onLoadHandler = renderButtonsLocal;
    let onErrorHandler = () => setLoadError('load-failed');

    if (existing) {
      existing.addEventListener('load', onLoadHandler);
      existing.addEventListener('error', onErrorHandler);
    } else {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      try { script.crossOrigin = 'anonymous'; } catch (e) {}
      script.addEventListener('load', onLoadHandler);
      script.addEventListener('error', onErrorHandler);
      document.body.appendChild(script);
    }

    return () => {
      mounted = false;
      // cleanup only the inner buttons container
      try {
        const container = buttonsContainerRef.current || paypalRef.current;
        if (container) container.innerHTML = '';
      } catch (e) {}
      // detach listeners
      try {
        if (existing) {
          existing.removeEventListener('load', onLoadHandler);
          existing.removeEventListener('error', onErrorHandler);
        }
        if (script) {
          script.removeEventListener('load', onLoadHandler);
          script.removeEventListener('error', onErrorHandler);
        }
      } catch (e) {}
    };
  }, [amount, singleProductId, clearCart, router]);

  return (
    <div className="mt-3">
      {/* JS SDK Buttons */}
      <div ref={paypalRef}><div ref={buttonsContainerRef}></div></div>
      {message && <div className="mt-2 text-sm text-muted-foreground">{message}</div>}

      {loadError && (
        <div className="mt-4 p-3 rounded border">
          <div className="mb-2 font-medium">PayPal SDK failed to load</div>
          <div className="text-sm text-muted-foreground mb-3">You can use the fallback redirect flow or simulate a payment for local testing.</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-secondary/80 rounded text-sm"
              onClick={async () => {
                setMessage('Creating order (fallback)...');
                try {
                  const payloadAmount = (renderRef.current.productPrice && renderRef.current.productPrice !== '0.00') ? renderRef.current.productPrice : (amount || '0.00').toString();
                  const res = await fetch('/api/paypal/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: payloadAmount }),
                  });
                  const json = await res.json();
                  if (!res.ok) {
                    setMessage('Fallback create order failed');
                    return;
                  }
                  const approve = json.links && json.links.find((l) => l.rel === 'approve');
                  if (approve && approve.href) {
                    window.location.href = approve.href;
                  } else {
                    setMessage('No approval link returned by PayPal');
                  }
                } catch (err) {
                  setMessage('Fallback create order failed');
                }
              }}
            >
              Go to PayPal
            </button>
            <button
              className="px-3 py-1 bg-primary text-white rounded text-sm"
              onClick={() => {
                setMessage('Simulating PayPal payment...');
                setTimeout(() => {
                  clearCart();
                  router.push('/success');
                }, 600);
              }}
            >
              Simulate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
