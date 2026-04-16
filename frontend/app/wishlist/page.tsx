'use client';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/lib/WishlistContext';
import { useCart } from '@/lib/CartContext';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <Heart size={22} color="#ff6161" fill="#ff6161" />
          <h1>My Wishlist ({items.length})</h1>
        </div>
        {items.length === 0 ? (
          <div className="no-results">
            <Heart size={64} />
            <h3 style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Your wishlist is empty</h3>
            <p style={{ marginTop: 8 }}>Save items you love here</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: 20 }}>Explore Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map(item => (
              <div key={item.id} className="wishlist-item">
                <Link href={`/product/${item.product_id}`} className="wishlist-item-img">
                  <img src={item.image || '/placeholder.png'} alt={item.name} />
                </Link>
                <div className="wishlist-item-body">
                  <Link href={`/product/${item.product_id}`}>
                    <div className="wishlist-item-name">{item.name}</div>
                  </Link>
                  <div className="wishlist-item-price">₹{parseFloat(item.price).toLocaleString('en-IN')}</div>
                  {item.stock === 0 && (
                    <div style={{ color: '#c62828', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Out of Stock</div>
                  )}
                  <div className="wishlist-item-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => addToCart(item.product_id)}
                      disabled={item.stock === 0}
                      style={{ flex: 1 }}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggle(item.product_id)}
                      title="Remove from wishlist"
                    >
                      <Heart size={16} fill="#ff6161" color="#ff6161" />
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
