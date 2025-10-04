"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  async function onAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(true);
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    
    setTimeout(() => {
      setAddingToCart(false);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-2';
      notification.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ${product.name} added to cart!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }, 300);
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
    <div className="group relative bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200">
      <Link href={`/checkout?product=${product.id}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              {product.badge}
            </div>
          )}
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-background/90 text-foreground hover:bg-background'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
                <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded text-xs font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
      
      {/* Action Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={onAdd}
          disabled={addingToCart}
          className="w-full"
          size="sm"
        >
          {addingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
