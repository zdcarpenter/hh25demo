"use client";

const KEY = 'demo_cart_v1';

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addItem(item) {
  const cart = getCart();
  const existing = cart.find(i=>i.id===item.id);
  if (existing) existing.qty += item.qty || 1;
  else cart.push({ ...item, qty: item.qty || 1 });
  saveCart(cart);
  return cart;
}

export function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if (item) item.qty = qty;
  const filtered = cart.filter(i=>i.qty>0);
  saveCart(filtered);
  return filtered;
}

export function clearCart() { localStorage.removeItem(KEY); }
