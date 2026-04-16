'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart, ChevronLeft, Shield, RotateCcw, Truck } from 'lucide-react';
import api from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';

interface Product {
  id: number; name: string; brand: string; price: number; mrp: number;
  stock: number; rating: number; rating_count: number; description: string;
  category_name: string; images: { id: number; url: string; is_primary: boolean }[];
  specs: { spec_key: string; spec_value: string }[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => { setProduct(data.product); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><p>Product not found.</p></div>;

  const mrp = Number(product.mrp);
  const price = Number(product.price);
  const rating = Number(product.rating);
  const ratingCount = Number(product.rating_count);
  const discount = Math.round(((mrp - price) / mrp) * 100);
  const wishlisted = isWishlisted(product.id);
  const images = product.images.length > 0 ? product.images : [{ id: 0, url: '/placeholder.png', is_primary: true }];

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/auth/login');
      return;
    }
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
    router.push('/checkout');
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: 16, marginTop: 8 }}>
          <a href="/">Home</a> &rsaquo;
          <a href={`/?category=${product.category_name?.toLowerCase().replace(/ /g,'-')}`}>{product.category_name}</a> &rsaquo;
          <span style={{ color: '#202124' }}>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-detail-images">
            <div className="image-carousel-main">
              <img src={images[activeImg]?.url} alt={product.name} />
            </div>
            <div className="image-carousel-thumbs">
              {images.map((img, i) => (
                <div key={img.id} className={`thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img.url} alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>
            {/* Action buttons near image (Flipkart style) */}
            <div className="product-detail-actions" style={{ marginTop: 24 }}>
              <button
                className="btn btn-orange btn-lg"
                onClick={() => {
                  if (!user) { toast.error('Please login to continue'); router.push('/auth/login'); return; }
                  setAdding(true); addToCart(product.id, 1).finally(() => setAdding(false)); 
                }}
                disabled={adding || product.stock === 0}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="product-detail-info">
              <div className="product-detail-brand">{product.brand}</div>
              <h1 className="product-detail-name">{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="product-detail-rating">
                  {rating.toFixed(1)} <Star size={12} fill="white" />
                </span>
                <span className="product-detail-rating-count">{ratingCount.toLocaleString()} ratings</span>
              </div>

              <hr className="product-divider" />

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
                <span className="product-detail-price">₹{price.toLocaleString('en-IN')}</span>
                {mrp > price && (
                  <>
                    <span className="product-detail-mrp">₹{mrp.toLocaleString('en-IN')}</span>
                    <span className="product-detail-discount">{discount}% off</span>
                  </>
                )}
              </div>
              <p className="product-detail-stock mt-8">
                {product.stock > 0
                  ? <span className="in-stock">✓ In Stock ({product.stock} units left)</span>
                  : <span className="out-of-stock">✗ Out of Stock</span>
                }
              </p>

              <hr className="product-divider" />

              {/* Offers */}
              <div className="product-offers">
                <h4>Available Offers</h4>
                <div className="offer-item"><span className="offer-icon">🏷</span> <span><strong>Bank Offer</strong> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</span></div>
                <div className="offer-item"><span className="offer-icon">🏷</span> <span><strong>Special Price</strong> Get extra {discount}% off (price inclusive of discount)</span></div>
                <div className="offer-item"><span className="offer-icon">🏷</span> <span><strong>No Cost EMI</strong> ₹{Math.round(price / 6).toLocaleString('en-IN')}/mo for 6 months</span></div>
              </div>

              <hr className="product-divider" />

              {/* Delivery & services */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14 }}>
                  <Truck size={18} color="#388e3c" style={{ flexShrink: 0 }} />
                  <div><strong>Free Delivery</strong> by <strong>Tomorrow</strong></div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14 }}>
                  <RotateCcw size={18} color="#388e3c" style={{ flexShrink: 0 }} />
                  <div><strong>7 Days</strong> Replacement Policy</div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14 }}>
                  <Shield size={18} color="#388e3c" style={{ flexShrink: 0 }} />
                  <div><strong>1 Year</strong> Warranty</div>
                </div>
              </div>

              <hr className="product-divider" />

              {/* Wishlist */}
              <button
                className={`btn btn-outline btn-full ${wishlisted ? 'wishlisted' : ''}`}
                onClick={() => toggle(product.id)}
              >
                <Heart size={16} fill={wishlisted ? '#2874f0' : 'none'} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="product-specs">
                <h3>Specifications</h3>
                <table className="spec-table">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={i}>
                        <td>{s.spec_key}</td>
                        <td>{s.spec_value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="product-description">
                <h3>Product Description</h3>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
