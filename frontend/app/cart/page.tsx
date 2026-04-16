'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal, totalMrp, saving } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-sm shadow-sm flex flex-col items-center">
          <ShoppingBag size={120} className="text-gray-100 mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty!</h3>
          <p className="text-gray-500 mb-8">Add items to it now.</p>
          <Link href="/" className="bg-blue-primary text-white px-12 py-3 rounded-sm font-bold shadow-md hover:bg-blue-dark transition-all">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            My Cart <span className="text-sm font-normal text-gray-500">({items.length} item{items.length !== 1 ? 's' : ''})</span>
          </h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Items Section */}
          <div className="flex-1 bg-white shadow-sm rounded-sm w-full">
            <div className="p-4 px-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Items in your cart</h2>
            </div>
            {items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row p-6 gap-6 border-b border-gray-100 last:border-none transition-colors hover:bg-gray-50/30">
                <Link href={`/product/${item.product_id}`} className="shrink-0 flex items-center justify-center">
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="w-28 h-28 object-contain" />
                </Link>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 overflow-hidden">
                      <Link href={`/product/${item.product_id}`} className="text-base text-gray-900 font-medium hover:text-blue-primary block mb-1 truncate">
                        {item.name}
                      </Link>
                      <div className="text-[13px] text-gray-400 mb-3">Seller: {item.brand}</div>
                      
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        {item.mrp > item.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 line-through">₹{(item.mrp * item.quantity).toLocaleString('en-IN')}</span>
                            <span className="text-green text-sm font-bold">
                              {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% Off
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                        onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1) : removeFromCart(item.id)}
                      >
                        {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                      </button>
                      <div className="w-10 text-center text-sm font-bold border-x border-gray-200">{item.quantity}</div>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className="text-sm font-bold text-gray-900 uppercase tracking-wide hover:text-blue-primary transition-colors py-2" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                    <Link href="/wishlist" className="text-sm font-bold text-gray-900 uppercase tracking-wide hover:text-blue-primary transition-colors py-2">
                      Save for Later
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 px-6 flex justify-end items-center bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sticky bottom-0 border-t border-gray-100 md:relative md:shadow-none">
              <button
                className="bg-[#fb641b] text-white px-16 py-3.5 rounded-sm font-bold shadow-md hover:bg-[#f4511e] transition-all uppercase"
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to place your order');
                    router.push('/auth/login');
                  } else {
                    router.push('/checkout');
                  }
                }}
              >
                Place Order
              </button>
            </div>
          </div>

          {/* Price Summary Section */}
          <div className="lg:w-[380px] w-full shrink-0 h-fit sticky top-24">
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
              <div className="p-4 px-6 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Price Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base text-gray-900">
                  <span>Price ({items.length} item{items.length === 1 ? '' : 's'})</span>
                  <span>₹{totalMrp.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base text-gray-900">
                  <span>Discount</span>
                  <span className="text-green">- ₹{saving.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base text-gray-900">
                  <span>Delivery Charges</span>
                  <span className="text-green font-medium">FREE</span>
                </div>
                
                <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {saving > 0 && (
                  <div className="bg-green/5 border border-green/10 p-3 rounded-sm text-center">
                    <p className="text-green text-[15px] font-bold">
                      🎉 You will save ₹{saving.toLocaleString('en-IN')} on this order
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 px-6 bg-gray-50 flex items-center gap-3 border-t border-gray-100">
                <Shield size={18} className="text-gray-400" />
                <span className="text-[12px] font-medium text-gray-500 italic">Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
