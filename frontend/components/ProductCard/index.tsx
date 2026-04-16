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
      <div className="bg-white rounded-lg overflow-hidden relative border border-[#e0e0e0] group">
        <Link href={`/product/${product.id}`} className="block no-underline text-inherit">
          <div className="relative aspect-square p-3 flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 bg-[#e5f6ee] rounded p-0.5 flex items-center gap-1 z-[2]">
               <TrendingDown size={14} className="text-[#10b981]" />
            </div>
            <img 
              src={product.primary_image || '/placeholder.png'} 
              alt={product.name} 
              loading="lazy" 
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105" 
            />
            {rating > 0 && (
               <div className="absolute bottom-2 left-2 bg-white rounded p-0.5 flex items-center gap-1 border border-[#e0e0e0] text-[11px] font-semibold z-[2]">
                 {rating.toFixed(1)} <Star size={10} className="fill-green text-green" />
               </div>
            )}
          </div>
          <div className="p-2 px-3 pb-3">
            <div className="text-[11px] text-[#878787] mb-1">1 unit</div>
            <div className="text-[13px] h-[38px] line-clamp-2 text-[#212121] font-medium leading-[1.4]">{product.name}</div>
            <div className="mt-2 flex items-center gap-1.5 flex-row">
              <span className="text-[15px] text-[#212121] font-semibold">₹{price}</span>
              {mrp > price && <span className="text-xs text-[#878787] line-through">₹{mrp}</span>}
            </div>
          </div>
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); addToCart(product.id, 1); }}
          className="absolute bottom-3 right-3 bg-white border border-[#d4d5d9] rounded w-7 h-7 flex items-center justify-center cursor-pointer text-red hover:bg-red/5 transition-colors"
          aria-label="Add to cart"
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="product-card group bg-white rounded-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer relative shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-200 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-blue-primary">
      <Link href={`/product/${product.id}`} className="no-underline block">
        <div className="relative p-3 md:p-5 bg-white h-[160px] md:h-[200px] flex items-center justify-center overflow-hidden border-none text-center">
          <img
            src={product.primary_image || '/placeholder.png'}
            alt={product.name}
            loading="lazy"
            className="max-h-[130px] md:max-h-[168px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {rating > 0 && (
            <div className="absolute bottom-2 left-2 bg-white/95 text-gray-800 px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-black/5">
              {rating.toFixed(1)} <Star size={10} className="fill-green text-green" /> <span className="text-gray-500 font-normal">({ratingCount.toLocaleString()})</span>
            </div>
          )}
        </div>
        <div className="p-2 md:p-3 px-3 md:px-4 pb-4 md:pb-5">
          <div className="text-[13px] md:text-[15px] font-medium text-gray-900 mb-0.5 line-clamp-2 leading-[1.4] min-h-[36px] md:min-h-10">{product.name}</div>
          <div className="text-[11px] md:text-[13px] text-gray-500 mb-1.5 md:mb-2">{product.brand}</div>
          
          <div className="inline-block text-white px-2 md:px-2.5 py-0.5 md:py-1 rounded-sm text-[10px] md:text-[11px] font-bold mb-1.5 md:mb-2 uppercase tracking-[0.5px]" style={{ background: tagBg }}>{tag}</div>
          
          <div className="flex items-baseline gap-1.5 md:gap-2">
            <span className="text-lg md:text-xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
            {mrp > price && <span className="text-[13px] md:text-[15px] text-gray-500 line-through">₹{mrp.toLocaleString('en-IN')}</span>}
          </div>
          
          {mrp > price && (
            <div className="text-[10px] md:text-xs text-green font-semibold mt-0.5 md:mt-1">Extra {discount}% off</div>
          )}
        </div>
      </Link>
      
      {/* Wishlist button */}
      <button
        className={`absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all z-[1] border border-gray-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${wishlisted ? 'wishlisted' : ''}`}
        onClick={e => { e.preventDefault(); toggle(product.id); }}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} fill={wishlisted ? '#ff6161' : 'none'} color={wishlisted ? '#ff6161' : '#9aa0a6'} />
      </button>
    </div>
  );
}
