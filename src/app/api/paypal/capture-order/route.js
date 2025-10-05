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
    const orderId = body && body.orderId;
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const token = await getAccessToken();
    const base = await getPayPalBase();

    const captureRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const captureJson = await captureRes.json();
    if (!captureRes.ok) {
      return NextResponse.json({ error: captureJson }, { status: 500 });
    }

    return NextResponse.json({ capture: captureJson });
  } catch (err) {
    console.error('capture-order error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
