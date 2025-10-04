import { NextResponse } from 'next/server';
import { deleteSession } from '../../../../lib/userStore';

export async function POST(req) {
  try {
    const sid = req.cookies.get('sid')?.value;
    if (sid) deleteSession(sid);
    const res = NextResponse.json({ ok: true });
    res.cookies.set('sid', '', { path: '/', maxAge: 0 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 400 });
  }
}
