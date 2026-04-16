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
      <div className="container">
        <div className="empty-cart">
          <ShoppingBag size={80} color="#dadce0" />
          <h3>Your cart is empty!</h3>
          <p>Add items to it now.</p>
          <Link href="/" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>My Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
        </div>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items-section">
            <div className="cart-header">
              <h2>Shopping Cart</h2>
            </div>
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Link href={`/product/${item.product_id}`}>
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="cart-item-img" />
                </Link>
                <div className="cart-item-info">
                  <Link href={`/product/${item.product_id}`}>
                    <div className="cart-item-name">{item.name}</div>
                  </Link>
                  <div className="cart-item-seller">Seller: {item.brand}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    {item.mrp > item.price && (
                      <>
                        <span className="cart-item-mrp">₹{(item.mrp * item.quantity).toLocaleString('en-IN')}</span>
                        <span className="cart-item-saving">
                          {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1) : removeFromCart(item.id)}
                      >
                        {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <div className="qty-display">{item.quantity}</div>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                    <Link href="/wishlist" style={{ fontSize: 13, color: '#9aa0a6' }}>Save for Later</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Price ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              <span>₹{totalMrp.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="saving">− ₹{saving.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span style={{ color: '#388e3c' }}>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {saving > 0 && (
              <div style={{ background: '#e8f5e9', border: '1px solid #388e3c', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#388e3c', fontWeight: 600, marginTop: 12 }}>
                🎉 You will save ₹{saving.toLocaleString('en-IN')} on this order
              </div>
            )}
            <button
              className="btn btn-orange btn-full"
              style={{ marginTop: 20, padding: 14, fontSize: 15 }}
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
      </div>
    </div>
  );
}
