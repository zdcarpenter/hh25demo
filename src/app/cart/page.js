"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCart, updateQty, clearCart } from '../../lib/cart';

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(()=>{ setItems(getCart()); }, []);

  function onChange(id, qty) {
    const updated = updateQty(id, Number(qty));
    setItems(updated);
  }

  function onClear() {
    clearCart();
    setItems([]);
  }

  const total = items.reduce((s,i)=>s + i.price * i.qty, 0);

  if (!items.length) return (
    <div>
      <h1>Your cart</h1>
      <p>Your cart is empty for this demo. Try the <Link href="/shop">shop</Link>.</p>
    </div>
  );

  return (
    <div>
      <h1>Your cart</h1>
      <ul>
        {items.map(it => (
          <li key={it.id} style={{marginBottom:8}}>
            {it.name} — ${it.price.toFixed(2)} x <input type="number" min={0} value={it.qty} onChange={e=>onChange(it.id, e.target.value)} style={{width:60}} /> = ${(it.price*it.qty).toFixed(2)}
          </li>
        ))}
      </ul>
      <p><strong>Total: ${total.toFixed(2)}</strong></p>
      <div style={{display:'flex', gap:8}}>
        <Link href="/checkout">Checkout</Link>
        <button onClick={onClear}>Clear cart</button>
      </div>
    </div>
  );
}
