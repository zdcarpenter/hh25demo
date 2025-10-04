"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Shield, Lock, CheckCircle, ArrowLeft, Sparkles, Clock, Loader2 } from 'lucide-react';

export default function CheckoutClient() {
  const params = useSearchParams();
  const singleProduct = params.get('product');
  const { items: cartItems, clearCart } = useCart();

  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reflect live cart state in the UI
  const items = cartItems;
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || item.qty || 0), 0);

  async function startCheckout() {
    const useSingleProduct = !!singleProduct && items.length === 0;
    if (!useSingleProduct && (!items || items.length === 0)) {
      setMessage('Cart is empty');
      return;
    }

    setIsProcessing(true);
    setMessage('Creating secure checkout session...');

    try {
      const payload = useSingleProduct
        ? { product: singleProduct }
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
      const data = await res.json();

      if (res.ok && data.url) {
        clearCart();
        setMessage('Redirecting to secure payment...');
        window.location.href = data.url;
      } else {
        setMessage(data.error || 'Failed to create checkout session');
        setIsProcessing(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsProcessing(false);
    }
  }

  if (items.length === 0 && !singleProduct) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Nothing to checkout</h1>
            <p className="text-muted-foreground mb-8">Your cart is empty. Add some products to get started!</p>
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Protected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity || item.qty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${((item.price || 0) * (item.quantity || item.qty)).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${(item.price || 0).toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={startCheckout} disabled={isProcessing} className="w-full mt-6" size="lg">
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

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Instant delivery for digital products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>

                {message && (
                  <div
                    className={`mt-4 p-3 rounded-lg text-sm ${
                      message.includes('error') || message.includes('Failed') || message.includes('empty')
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}
                  >
                    {message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
