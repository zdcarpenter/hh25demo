import { NextResponse } from 'next/server';
import { verifyCode } from '../../../../lib/mfaStore';

export async function POST(req) {
  try {
    const { phone, product, code } = await req.json();
    if (!phone || !code) return NextResponse.json({ error: 'phone and code required' }, { status: 400 });
    const result = verifyCode(phone, product || 'sku-1', code);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
