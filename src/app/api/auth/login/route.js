import { NextResponse } from 'next/server';
import { findUserByEmail, createSession } from '../../../../lib/userStore';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });
    const user = findUserByEmail(email);
    if (!user || user.password !== password) return NextResponse.json({ error: 'invalid credentials' }, { status: 401 });
    const sid = createSession(user.id);
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set('sid', sid, { httpOnly: true, path: '/' });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 400 });
  }
}
