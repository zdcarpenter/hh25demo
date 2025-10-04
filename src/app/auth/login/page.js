"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.ok) router.push('/');
    else setMsg(res?.error || 'Login failed');
  }

  return (
    <div style={{maxWidth:420}}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <div style={{marginTop:8}}><button type="submit">Sign in</button></div>
      </form>
      {msg && <p><em>{msg}</em></p>}
    </div>
  );
}
