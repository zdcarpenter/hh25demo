"use client";

import Link from 'next/link';
import { addItem } from '../../lib/cart';

const products = [
  { id: 'sku-1', name: 'Fancy Socks', price: 9.99 },
  { id: 'sku-2', name: 'Cool Hat', price: 19.99 },
  { id: 'sku-3', name: 'T-Shirt', price: 14.99 },
];

export default function Shop() {
  function onAdd(p) {
    addItem({ id: p.id, name: p.name, price: p.price, qty: 1 });
    alert(`${p.name} added to cart`);
  }

  return (
    <div>
      <h1>Shop</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} style={{marginBottom: 12}}>
            <strong>{p.name}</strong> — ${p.price.toFixed(2)}{' '}
            <button onClick={()=>onAdd(p)} style={{marginLeft:8}}>Add to cart</button>
            <Link href={`/checkout?product=${p.id}`} style={{marginLeft: 8}}>Buy</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
