import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AuthStatus from '../components/AuthStatus';
import AuthProvider from '../components/AuthProvider';
import { CartProvider } from '../lib/cart-context';
import Navigation from '../components/Navigation';
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
  title: "Luxe Commerce",
  description: "Premium shopping experience with secure checkout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <header className="bg-background border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                      <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-primary" />
                        SHOP
                      </Link>
                      <Navigation />
                    </div>
                    <AuthStatus />
                  </div>
                </div>
              </header>
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
