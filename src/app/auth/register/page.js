"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    if (res.ok) {
      // Sign in after registration
      const s = await signIn('credentials', { redirect: false, email, password });
      if (s?.ok) router.push('/');
      else setMsg('Registration succeeded but signin failed');
    } else {
      setMsg(data.error || 'Registration failed');
    }
  }

  return (
    <div style={{maxWidth:420}}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <div style={{marginTop:8}}><button type="submit">Create account</button></div>
      </form>
      {msg && <p><em>{msg}</em></p>}
    </div>
  );
}
