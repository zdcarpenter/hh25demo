import Link from 'next/link';

const products = [
  { id: 'sku-1', name: 'Fancy Socks', price: 9.99 },
  { id: 'sku-2', name: 'Cool Hat', price: 19.99 },
];

export default function Shop() {
  return (
    <div>
      <h1>Shop</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} style={{marginBottom: 12}}>
            <strong>{p.name}</strong> — ${p.price.toFixed(2)}{' '}
            <Link href={`/checkout?product=${p.id}`} style={{marginLeft: 8}}>Buy</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
