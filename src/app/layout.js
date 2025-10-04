import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AuthStatus from '../components/AuthStatus';
import AuthProvider from '../components/AuthProvider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Demo Checkout",
  description: "Demo checkout site for MFA package",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header style={{padding: 16, borderBottom: '1px solid #e6e6e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <Link href="/" style={{fontWeight: 700, textDecoration: 'none'}}>Demo</Link>
            <nav style={{display: 'flex', gap: 10}}>
              <Link href="/shop">Shop</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/checkout">Checkout</Link>
            </nav>
          </div>
          <div style={{fontSize: 13, color: '#666'}}><AuthStatus /></div>
        </header>
        <main style={{padding: 20}}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
