import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });

const PRODUCTS = {
  'sku-1': { name: 'Premium Cotton T-Shirt', price: 24.99 },
  'sku-2': { name: 'Classic Baseball Cap', price: 18.99 },
  'sku-3': { name: 'Comfortable Crew Socks', price: 12.99 },
  'sku-4': { name: 'Leather Wallet', price: 49.99 },
  'sku-5': { name: 'Denim Jeans', price: 79.99 },
  'sku-6': { name: 'Sneakers', price: 129.99 },
};

export async function POST(req) {
  try {
    const { product, items } = await req.json();
    // items expected: [{ id, name, price, qty }]
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    console.debug('[stripe] create-session payload', { product, items, origin });

    let line_items = [];
    if (Array.isArray(items) && items.length) {
      line_items = items.map(it => {
        const prod = PRODUCTS[it.id] || { name: it.name || it.id, price: Number(it.price) || 0 };
        return {
          price_data: {
            currency: 'usd',
            product_data: { name: prod.name },
            unit_amount: Math.round((prod.price || 0) * 100),
          },
          quantity: Number(it.qty) || 1,
        };
      });
    } else {
      const p = PRODUCTS[product] || PRODUCTS['sku-1'];
      line_items = [{
        price_data: {
          currency: 'usd',
          product_data: { name: p.name },
          unit_amount: Math.round(p.price * 100),
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout?success=1`,
      cancel_url: `${origin}/checkout?canceled=1`,
    });

    console.debug('[stripe] created session', { id: session.id, url: session.url });

    return NextResponse.json({ ok: true, url: session.url, id: session.id });
  } catch (err) {
    console.error('stripe create session error', err?.message || err);
    // surface the underlying error message for debugging (do not leak in production)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
