import { NextResponse } from 'next/server';
import { getUserBySession } from '../../../../lib/userStore';

export async function GET(req) {
  try {
    const sid = req.cookies.get('sid')?.value;
    const user = sid ? getUserBySession(sid) : null;
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
