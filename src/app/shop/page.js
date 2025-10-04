"use client";

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Heart, Star, Plus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const products = [
  { 
    id: 'sku-1', 
    name: 'Premium Cotton T-Shirt', 
    price: 24.99, 
    originalPrice: 34.99,
    description: 'Soft and comfortable cotton t-shirt perfect for everyday wear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller'
  },
  { 
    id: 'sku-2', 
    name: 'Classic Baseball Cap', 
    price: 18.99, 
    originalPrice: 24.99,
    description: 'Adjustable baseball cap with premium cotton twill construction',
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 89,
    badge: 'Sale'
  },
  { 
    id: 'sku-3', 
    name: 'Comfortable Crew Socks', 
    price: 12.99, 
    originalPrice: 16.99,
    description: 'Moisture-wicking crew socks with cushioned sole for all-day comfort',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 67,
    badge: 'New'
  },
  { 
    id: 'sku-4', 
    name: 'Leather Wallet', 
    price: 49.99, 
    originalPrice: 69.99,
    description: 'Genuine leather bifold wallet with RFID protection',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 156,
    badge: 'Premium'
  },
  { 
    id: 'sku-5', 
    name: 'Denim Jeans', 
    price: 79.99, 
    originalPrice: 99.99,
    description: 'Classic fit denim jeans with stretch for comfort and style',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 203,
    badge: 'Popular'
  },
  { 
    id: 'sku-6', 
    name: 'Sneakers', 
    price: 129.99, 
    originalPrice: 159.99,
    description: 'Comfortable athletic sneakers with modern design',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 341,
    badge: 'Trending'
  },
];

export default function Shop() {
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState(null);
  const [likedItems, setLikedItems] = useState(new Set());

  async function onAdd(p) {
    setAddingToCart(p.id);
    // Use cart context so header badge and pages update reactively
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
    
    setTimeout(() => {
      setAddingToCart(null);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-2';
      notification.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ${p.name} added to cart!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }, 300);
  }

  function toggleLike(productId) {
    const newLiked = new Set(likedItems);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedItems(newLiked);
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'} 
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
        <p className="text-gray-300 text-lg">Discover our collection of high-quality products</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.badge}
                </div>
              )}
              
              {/* Wishlist Button */}
              <button 
                onClick={() => toggleLike(product.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                  likedItems.has(product.id) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart size={18} className={likedItems.has(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-6">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Product Name */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Pricing */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => onAdd(product)}
                  disabled={addingToCart === product.id}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    addingToCart === product.id
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800'
                  }`}
                >
                  {addingToCart === product.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>

                <Link
                  href={`/checkout?product=${product.id}`}
                  className="px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
