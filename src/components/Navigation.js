"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Navigation() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  
  const navItems = [
    { href: '/shop', label: 'Products' },
    { href: '/checkout', label: 'Checkout' }
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </Link>
        );
      })}
      
      {/* Cart Icon with Badge */}
      <Link
        href="/cart"
        className={`relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
          pathname === '/cart'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
