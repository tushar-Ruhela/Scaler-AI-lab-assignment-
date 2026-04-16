'use client';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/lib/WishlistContext';
import { useCart } from '@/lib/CartContext';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 md:py-8 font-sans">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-full">
            <Heart size={22} className="text-[#ff6161] fill-[#ff6161]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Wishlist <span className="text-gray-400 font-normal text-lg">({items.length})</span></h1>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white p-20 rounded-sm shadow-sm flex flex-col items-center text-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={48} className="text-gray-100" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm">Save your favorite items here to keep track of them and buy later!</p>
            <Link href="/" className="bg-blue-primary text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-blue-dark transition-all uppercase tracking-wide">Explore Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-all group">
                <Link href={`/product/${item.product_id}`} className="block aspect-[4/5] p-6 flex items-center justify-center bg-white border-b border-gray-50 overflow-hidden">
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110" />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/product/${item.product_id}`} className="no-underline">
                    <div className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-primary transition-colors line-clamp-2 leading-relaxed h-10">{item.name}</div>
                  </Link>
                  <div className="text-lg font-bold text-gray-900 mb-3 mt-1">₹{parseFloat(item.price).toLocaleString('en-IN')}</div>
                  
                  {item.stock === 0 && (
                    <div className="text-red-600 text-[12px] mb-4 font-bold bg-red-50 py-1 px-3 rounded-full w-fit">Out of Stock</div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-[#ff9f00] text-white py-2.5 rounded-sm text-xs font-bold shadow-sm hover:bg-[#f39700] transition-all disabled:bg-gray-200 disabled:shadow-none uppercase"
                      onClick={() => addToCart(item.product_id)}
                      disabled={item.stock === 0}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-sm bg-white hover:bg-gray-50 transition-all shadow-sm"
                      onClick={() => toggle(item.product_id)}
                      title="Remove from wishlist"
                    >
                      <Heart size={18} className="text-[#ff6161] fill-[#ff6161]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
