import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });
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
    const res = await users.insertOne({ name: name || '', email, password: hash });
    return NextResponse.json({ ok: true, userId: res.insertedId.toString() });
  } catch (err) {
    console.error('register error:', err?.message || err);
    return NextResponse.json({ error: 'failed to register' }, { status: 500 });
  }
}
