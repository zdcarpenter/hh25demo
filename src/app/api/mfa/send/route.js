import { NextResponse } from 'next/server';
import { sendCode } from '../../../../lib/mfaStore';

export async function POST(req) {
  try {
    const { phone, product } = await req.json();
    if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 });
    const result = sendCode(phone, product || 'sku-1');
    // In a real integration you'd send an SMS/Push here. For demo we return a hint.
    return NextResponse.json({ ok: true, hint: result.hint });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
