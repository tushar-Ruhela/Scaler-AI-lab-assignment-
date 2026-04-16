'use client';
import Link from 'next/link';
import { Heart, Star, Plus, TrendingDown } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';

interface Product {
  id: number; name: string; price: number; mrp: number;
  rating: number; rating_count: number; brand: string;
  primary_image: string; stock: number; specs?: any[];
}

export default function ProductCard({ product, isGrocery }: { product: Product, isGrocery?: boolean }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const mrp = Number(product.mrp);
  const price = Number(product.price);
  const rating = Number(product.rating);
  const ratingCount = Number(product.rating_count);
  const discount = Math.round(((mrp - price) / mrp) * 100);
  const wishlisted = isWishlisted(product.id);

  const tagList = ['#GiftOfLove', '#ColorPop', '#TopRated', '#BestSeller', '#Trending'];
  const tagColors = ['#fe0b55', '#bb86fc', '#f59e0b', '#10b981', '#ef4444'];
  const randomTagIndex = product.id % tagList.length;
  const tag = tagList[randomTagIndex];
  const tagBg = tagColors[randomTagIndex];

  if (isGrocery) {
    return (
      <div className="product-card grocery-card" style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="product-card-img-wrap" style={{ aspectRatio: '1/1', padding: 12, borderBottom: 'none' }}>
            <div style={{ position: 'absolute', top: 8, left: 8, background: '#e5f6ee', borderRadius: 4, padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 4, zIndex: 2 }}>
               <TrendingDown size={14} color="#10b981" />
            </div>
            <img src={product.primary_image || '/placeholder.png'} alt={product.name} loading="lazy" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
            {rating > 0 && (
               <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#fff', borderRadius: 4, padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #e0e0e0', fontSize: 11, fontWeight: 600, zIndex: 2 }}>
                 {rating.toFixed(1)} <Star size={10} fill="var(--green)" color="var(--green)" />
               </div>
            )}
          </div>
          <div className="product-card-body" style={{ padding: '8px 12px' }}>
            <div className="product-card-desc" style={{ fontSize: 11, color: '#878787', marginBottom: 4 }}>1 unit</div>
            <div className="product-card-name" style={{ fontSize: 13, height: 38, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#212121', fontWeight: 500 }}>{product.name}</div>
            <div className="product-card-prices-new" style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
              <span className="product-card-price-new" style={{ fontSize: 15, color: '#212121', fontWeight: 600 }}>₹{price}</span>
              {mrp > price && <span className="product-card-mrp-new" style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>₹{mrp}</span>}
            </div>
          </div>
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); addToCart(product.id, 1); }}
          style={{ position: 'absolute', bottom: 12, right: 12, background: '#fff', border: '1px solid #d4d5d9', borderRadius: 4, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6161' }}
          aria-label="Add to cart"
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <div className="product-card-img-wrap">
          <img
            src={product.primary_image || '/placeholder.png'}
            alt={product.name}
            loading="lazy"
          />
          {rating > 0 && (
            <div className="product-card-rating-overlay">
              {rating.toFixed(1)} <Star size={10} fill="var(--green)" /> ({ratingCount.toLocaleString()})
            </div>
          )}
        </div>
        <div className="product-card-body">
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-desc">{product.brand}</div>
          
          <div className="product-card-tag" style={{ background: tagBg }}>{tag}</div>
          
          <div className="product-card-prices-new">
            {mrp > price && <span className="product-card-mrp-new">₹{mrp.toLocaleString('en-IN')}</span>}
            <span className="product-card-price-new">₹{price.toLocaleString('en-IN')}</span>
          </div>
          
          {mrp > price && (
            <div className="product-card-discount-new">Extra {discount}% off</div>
          )}
        </div>
      </Link>
      
      {/* Wishlist button */}
      <button
        className={`product-card-wishlist ${wishlisted ? 'wishlisted' : ''}`}
        onClick={e => { e.preventDefault(); toggle(product.id); }}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} fill={wishlisted ? '#ff6161' : 'none'} color={wishlisted ? '#ff6161' : '#9aa0a6'} />
      </button>
    </div>
  );
}
