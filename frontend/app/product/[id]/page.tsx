'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart, ChevronLeft, Shield, RotateCcw, Truck, Zap } from 'lucide-react';
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
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 mt-2">
          <Link href="/" className="hover:text-blue-primary">Home</Link> &rsaquo;
          <Link href={`/?category=${product.category_name?.toLowerCase().replace(/ /g,'-')}`} className="hover:text-blue-primary">{product.category_name}</Link> &rsaquo;
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] bg-white gap-8 p-4 md:p-6 rounded-sm shadow-sm">
          {/* Images */}
          <div className="md:sticky md:top-24 h-fit">
            <div className="w-full h-[400px] md:h-[450px] flex items-center justify-center p-4 border border-gray-100 rounded-sm mb-4 bg-white overflow-hidden">
              <img src={images[activeImg]?.url} alt={product.name} className="max-w-full max-h-full object-contain transition-transform duration-500" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img, i) => (
                <div 
                  key={img.id} 
                  className={`w-16 h-16 border-2 p-1 cursor-pointer transition-all shrink-0 bg-white ${i === activeImg ? 'border-blue-primary' : 'border-gray-100 hover:border-blue-primary/50'}`} 
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            
            {/* Action buttons near image */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                className="flex items-center justify-center gap-2 h-14 bg-[#ff9f00] text-white font-bold rounded-sm shadow-md transition-all hover:bg-[#f39700] disabled:bg-gray-300 disabled:shadow-none"
                onClick={() => {
                  if (!user) { toast.error('Please login to continue'); router.push('/auth/login'); return; }
                  setAdding(true); addToCart(product.id, 1).finally(() => setAdding(false)); 
                }}
                disabled={adding || product.stock === 0}
              >
                <ShoppingCart size={20} /> ADD TO CART
              </button>
              <button 
                className="flex items-center justify-center gap-2 h-14 bg-[#fb641b] text-white font-bold rounded-sm shadow-md transition-all hover:bg-[#f4511e] disabled:bg-gray-300 disabled:shadow-none" 
                onClick={handleBuyNow} 
                disabled={product.stock === 0}
              >
                <Zap size={20} fill="currentColor" /> BUY NOW
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm mb-0.5 font-medium uppercase tracking-wide">{product.brand}</div>
              <h1 className="text-xl md:text-2xl text-gray-900 mb-2 font-normal leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green text-white px-1.5 py-0.5 rounded-sm text-xs font-bold inline-flex items-center gap-1 shadow-sm">
                  {rating.toFixed(1)} <Star size={11} fill="white" />
                </span>
                <span className="text-gray-500 text-sm font-medium">{ratingCount.toLocaleString()} Ratings & Reviews</span>
              </div>

              <hr className="h-[1px] bg-gray-100 border-none my-4" />

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                {mrp > price && (
                  <>
                    <span className="text-gray-500 line-through text-lg">₹{mrp.toLocaleString('en-IN')}</span>
                    <span className="text-green text-lg font-bold">{discount}% off</span>
                  </>
                )}
              </div>
              
              <p className="mt-6">
                {product.stock > 0
                  ? <span className="text-green font-bold text-sm bg-green/5 px-3 py-1.5 rounded-full border border-green/10">✓ In Stock ({product.stock} units left)</span>
                  : <span className="text-red font-bold text-sm bg-red/5 px-3 py-1.5 rounded-full border border-red/10">✗ Out of Stock</span>
                }
              </p>

              <hr className="h-[1px] bg-gray-100 border-none my-6" />

              {/* Offers */}
              <div className="mb-6">
                <h4 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-tighter">Available Offers</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start text-sm text-gray-800">
                    <span className="text-green text-lg leading-none">🏷</span> 
                    <span><strong className="font-bold text-black">Bank Offer</strong> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</span>
                  </div>
                  <div className="flex gap-3 items-start text-sm text-gray-800">
                    <span className="text-green text-lg leading-none">🏷</span> 
                    <span><strong className="font-bold text-black">Special Price</strong> Get extra {discount}% off (price inclusive of discount)</span>
                  </div>
                  <div className="flex gap-3 items-start text-sm text-gray-800">
                    <span className="text-green text-lg leading-none">🏷</span> 
                    <span><strong className="font-bold text-black">No Cost EMI</strong> ₹{Math.round(price / 6).toLocaleString('en-IN')}/mo for 6 months</span>
                  </div>
                </div>
              </div>

              <hr className="h-[1px] bg-gray-100 border-none my-6" />

              {/* Delivery & services */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="flex gap-3 items-center bg-gray-50/50 p-4 rounded-lg">
                  <Truck size={24} className="text-green shrink-0" />
                  <div className="text-[13px] leading-snug text-gray-700"><strong>Free Delivery</strong> by <strong>Tomorrow</strong></div>
                </div>
                <div className="flex gap-3 items-center bg-gray-50/50 p-4 rounded-lg">
                  <RotateCcw size={24} className="text-green shrink-0" />
                  <div className="text-[13px] leading-snug text-gray-700"><strong>7 Days</strong> Replacement Policy</div>
                </div>
                <div className="flex gap-3 items-center bg-gray-50/50 p-4 rounded-lg">
                  <Shield size={24} className="text-green shrink-0" />
                  <div className="text-[13px] leading-snug text-gray-700"><strong>1 Year</strong> Brand Warranty</div>
                </div>
              </div>

              {/* Wishlist */}
              <button
                className={`flex items-center justify-center gap-2 py-3 md:py-4 px-6 border-2 rounded-sm font-bold transition-all text-sm md:text-base ${wishlisted ? 'bg-blue-primary border-blue-primary text-white shadow-md' : 'border-gray-200 text-gray-700 bg-white hover:border-blue-primary hover:text-blue-primary'}`}
                onClick={() => toggle(product.id)}
              >
                <Heart size={18} fill={wishlisted ? 'white' : 'none'} />
                {wishlisted ? 'WISHLISTED' : 'ADD TO WISHLIST'}
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 bg-white/50 p-6 rounded-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3 border-gray-100">Product Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="mt-8 bg-white/50 p-6 rounded-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3 border-gray-100">Specifications</h3>
                <div className="overflow-hidden border border-gray-100 rounded-sm">
                  <table className="w-full border-collapse">
                    <tbody>
                      {product.specs.map((s, i) => (
                        <tr key={i} className="border-b border-gray-100 group">
                          <td className="py-4 px-4 text-sm text-gray-500 w-1/3 bg-gray-50/50 font-medium group-last:border-none">{s.spec_key}</td>
                          <td className="py-4 px-4 text-sm text-gray-900 group-last:border-none">{s.spec_value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
