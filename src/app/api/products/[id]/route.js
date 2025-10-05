import { NextResponse } from 'next/server';

// Simple demo product lookup matching shop SKUs. In a real app you'd fetch from your DB.
const SAMPLE_PRODUCTS = {
  'sku-1': { id: 'sku-1', name: 'Premium Cotton T-Shirt', price: '24.99' },
  'sku-2': { id: 'sku-2', name: 'Classic Baseball Cap', price: '18.99' },
  'sku-3': { id: 'sku-3', name: 'Comfortable Crew Socks', price: '12.99' },
  'sku-4': { id: 'sku-4', name: 'Leather Wallet', price: '49.99' },
  'sku-5': { id: 'sku-5', name: 'Denim Jeans', price: '79.99' },
  'sku-6': { id: 'sku-6', name: 'Sneakers', price: '129.99' },
  default: { id: 'default', name: 'Demo Product', price: '12.50' },
};

export async function GET(request, { params }) {
  try {
    // In Next.js App Router (v15+), params may be a thenable. Await it before accessing properties.
    const { id } = await params;
    // return sample product if available, else default
    const product = SAMPLE_PRODUCTS[id] || SAMPLE_PRODUCTS['default'];
    return NextResponse.json(product);
  } catch (err) {
    console.error('products route error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
