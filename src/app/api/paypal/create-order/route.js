import { NextResponse } from 'next/server';

async function getPayPalBase() {
  const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
  return mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('PayPal server credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
  }
  const base = await getPayPalBase();
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Failed to get PayPal token: ' + text);
  }
  const json = await res.json();
  return json.access_token;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = (body && body.amount) ? String(body.amount) : '0.00';

    const token = await getAccessToken();
    const base = await getPayPalBase();

    const appBase = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '');

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'USD', value: amount } }],
        application_context: {
          return_url: `${appBase}/success`,
          cancel_url: `${appBase}/checkout`
        }
      }),
    });

    const orderJson = await orderRes.json();
    if (!orderRes.ok) {
      return NextResponse.json({ error: orderJson }, { status: 500 });
    }

    // Return the full order JSON (client can find approve link at orderJson.links)
    return NextResponse.json(orderJson);
  } catch (err) {
    console.error('create-order error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
