import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, Shield, Clock, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Shop Smart,
            <br />
            <span className="text-blue-600">Shop Easy</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Fast shipping, secure checkout, 
            and customer satisfaction guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 group"
            >
              <ShoppingBag size={20} />
              Shop Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link 
              href="#features"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Shipping</h3>
          <p className="text-gray-600">
            Free delivery on orders over $50. Fast and reliable shipping to your doorstep.
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payment</h3>
          <p className="text-gray-600">
            Your payment information is encrypted and secure. Shop with confidence.
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
          <p className="text-gray-600">
            Round-the-clock customer support to help you with any questions or concerns.
          </p>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our most popular items, carefully selected for quality and value.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
                alt="Featured Product"
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-500 ml-1">(24)</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Cotton T-Shirt</h3>
              <p className="text-gray-600 text-sm mb-3">Comfortable and stylish</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">$24.99</span>
                <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Details →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400&h=400&fit=crop"
                alt="Featured Product"
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-500 ml-1">(18)</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Classic Baseball Cap</h3>
              <p className="text-gray-600 text-sm mb-3">Adjustable and durable</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">$18.99</span>
                <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Details →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
                alt="Featured Product"
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-500 ml-1">(45)</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Athletic Sneakers</h3>
              <p className="text-gray-600 text-sm mb-3">Comfortable and modern</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">$129.99</span>
                <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
