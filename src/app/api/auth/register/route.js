import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!email || !password || !phone) return NextResponse.json({ error: 'name, email, password and phone are required' }, { status: 400 });
    // basic phone validation: digits, optional +, length between 7 and 20
    const normalizedPhone = String(phone || '').trim();
    const phoneDigits = normalizedPhone.replace(/[^0-9+]/g, '');
    if (!/^[+0-9]{7,20}$/.test(phoneDigits)) {
      return NextResponse.json({ error: 'invalid phone number' }, { status: 400 });
    }
    if (!clientPromise) {
      return NextResponse.json({ error: 'database not configured' }, { status: 500 });
    }
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ error: 'database unavailable' }, { status: 500 });
    }
    const users = client.db().collection('users');
    const existing = await users.findOne({ email });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);
  const res = await users.insertOne({ name: name || '', email, password: hash, phone: phoneDigits });
  return NextResponse.json({ ok: true, userId: res.insertedId.toString() });
  } catch (err) {
    console.error('register error:', err?.message || err);
    return NextResponse.json({ error: 'failed to register' }, { status: 500 });
  }
}
