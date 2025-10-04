import Link from 'next/link';

export default function Cart() {
  return (
    <div>
      <h1>Your cart</h1>
      <p>Your cart is empty for this demo. Try the <Link href="/shop">shop</Link>.</p>
    </div>
  );
}
