'use client';
import { useState, useEffect, useCallback, Suspense, Fragment } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Zap, Sparkles } from 'lucide-react';

interface Product {
  id: number; name: string; price: number; mrp: number;
  rating: number; rating_count: number; brand: string;
  primary_image: string; stock: number;
}
interface Category { id: number; name: string; slug: string; image_url: string; }
interface Pagination { total: number; page: number; limit: number; totalPages: number; }

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, sort, order };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.products || []);
      setPagination(data.pagination);
    } catch {} finally { setLoading(false); }
  }, [search, category, page, sort, order]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      {!search && !category && (
        <div className="bg-gradient-to-br from-blue-primary to-[#1a3a8a] text-white py-12 px-6 text-center mb-6">
          <h1 className="text-[2.5rem] font-extrabold mb-2 leading-tight">India&apos;s Biggest Online Store</h1>
          <p className="text-[1.1rem] opacity-90 max-w-2xl mx-auto">Electronics, Fashion, Home, Books, Sports & more — all at the best prices</p>
        </div>
      )}
      
      {category === 'grocery' && (
        <div className="bg-[#e1610b] pt-5">
          <div className="max-w-[1280px] mx-auto px-4 pb-5 text-center">
            <h1 className="text-white text-[32px] font-extrabold uppercase mb-3 tracking-wider">Celebrate Akshaya Tritiya</h1>
            <p className="text-white text-lg opacity-90 font-medium">Exciting grabs, fresh produce and amazing discounts!</p>
          </div>
        </div>
      )}

      {category === 'emi' && (
        <div className="bg-gradient-to-b from-blue-primary to-[#1a4eb8] min-h-[calc(100vh-120px)] pt-[60px] text-white text-center font-sans">
          <div className="max-w-[800px] mx-auto flex flex-col h-full px-4">
            <h1 className="text-[40px] md:text-[56px] font-extrabold text-yellow-light mb-2 [text-shadow:0_2px_10px_rgba(0,0,0,0.2)] leading-tight">Instant EMI for Everyone</h1>
            <h2 className="text-2xl md:text-[32px] font-semibold mb-12 text-white">Get up to ₹500 Off* | <span className="text-yellow-light">No Cost EMI</span></h2>
            
            <div className="bg-white rounded-2xl p-8 md:px-12 flex flex-row items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] mx-auto w-fit">
              <div className="bg-yellow-light rounded-lg rounded-br-[32px] w-20 h-[76px] flex items-center justify-center shrink-0">
                <Sparkles size={40} strokeWidth={2.5} className="text-blue-primary" />
              </div>
              <div className="text-left">
                <div className="text-[26px] font-extrabold text-blue-primary leading-none">Flipkart</div>
                <div className="text-[44px] font-black text-black leading-none mt-1">EMI</div>
              </div>
            </div>

            <div className="mt-[120px] bg-blue-primary py-8 border-t-[32px] border-t-transparent rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
              <h2 className="text-[48px] font-black text-yellow-light uppercase tracking-widest">Apply Now</h2>
            </div>
          </div>
        </div>
      )}

      {category === 'travel' && (
        <div className="bg-[#f0f8ff] min-h-[calc(100vh-120px)] p-8 px-4 font-sans">
          <div className="max-w-[900px] mx-auto">
            <div className="flex justify-between items-center mb-6 bg-[#e0efff] p-3 px-6 rounded-lg">
              <h1 className="text-lg font-bold text-black">Welcome Tushar</h1>
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-2xl text-[13px] font-semibold text-[#202124]">
                <Zap size={14} className="fill-yellow-light text-yellow-600" /> 0
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mb-6">
              {[ 
                { title: 'Flights', subtitle: 'Up to 25% Off', color: 'text-green-600', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500' },
                { title: 'Hotels', subtitle: 'Up to 65% Off', color: 'text-green-600', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' },
                { title: 'Buses', subtitle: '', color: 'text-green-600', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-[24px] p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)] relative overflow-hidden h-[280px] flex flex-col group">
                  <h2 className="text-[32px] font-extrabold text-[#111] mb-1 z-[2] group-hover:scale-105 transition-transform">{item.title}</h2>
                  {item.subtitle && <p className={`text-lg font-bold ${item.color} z-[2]`}>{item.subtitle}</p>}
                  <img src={item.img} className="absolute -bottom-5 left-0 w-full h-40 object-contain z-[1] opacity-90 transition-transform group-hover:scale-110" alt={item.title} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 px-6 flex justify-between items-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] mb-6 border border-[#e0e7ff] cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-[28px]">🧳</span>
                <span className="text-2xl font-bold text-[#202124]">My trips</span>
              </div>
              <ChevronRight size={28} className="text-[#202124] stroke-[2.5]" />
            </div>

            <div className="bg-white rounded-2xl p-5 px-6 flex justify-between items-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#e0e7ff]">
              <div className="flex items-center gap-6">
                <div className="bg-[#004c99] text-white px-4 py-2 font-extrabold rounded-sm tracking-widest text-xl">HDFC BANK</div>
                <div>
                  <div className="text-xl font-extrabold text-[#202124]">Up to 13% Off*</div>
                  <div className="text-[15px] text-gray-500 font-medium">on Credit Card Trxns.</div>
                </div>
              </div>
              <div className="text-[11px] text-gray-300 [writing-mode:vertical-rl] rotate-180">*T&C Apply</div>
            </div>
          </div>
        </div>
      )}

      {category !== 'emi' && category !== 'travel' && (
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Products section */}
        
        {!search && !category && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Brands In Spotlight</h2>
            <div className="rounded-lg overflow-hidden bg-[#e0f7fa] shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=1200&h=300&fit=crop" 
                alt="Garnier Promotion" 
                className="w-full h-auto block" 
              />
            </div>
          </div>
        )}

        <div className="py-2 pb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900">
              {search ? `Results for "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
              {pagination && <span className="font-normal text-sm text-gray-500">({pagination.total} items)</span>}
              {search && (
                <button
                  onClick={() => router.push(category ? `/?category=${category}` : '/')}
                  className="bg-[#fce8e6] text-[#c62828] rounded-3xl px-2.5 py-1 text-xs hover:bg-[#fbd5d1] transition-colors"
                >
                  Clear Search ✕
                </button>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <select
                className="py-1.5 px-3 border border-gray-300 rounded-sm text-[13px] outline-none cursor-pointer hover:border-gray-400 focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/10 transition-all font-medium text-gray-700 bg-white"
                value={`${sort}_${order}`}
                onChange={e => {
                  const [s, o] = e.target.value.split('_');
                  updateParam('sort', s);
                  const params2 = new URLSearchParams(searchParams.toString());
                  params2.set('sort', s); params2.set('order', o); params2.delete('page');
                  router.push(`/?${params2.toString()}`);
                }}
              >
                <option value="created_at_desc">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Best Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 p-0 shadow-sm">
                  <div className="bg-gray-100 animate-pulse h-[200px]" />
                  <div className="p-4">
                    <div className="h-3.5 bg-gray-100 animate-pulse mb-2 rounded w-full" />
                    <div className="h-3.5 bg-gray-100 animate-pulse mb-4 rounded w-4/5" />
                    <div className="h-5 bg-gray-100 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 px-6 text-gray-500 flex flex-col items-center">
              <p className="text-xl font-semibold mb-2 text-gray-700">No products found</p>
              <p className="opacity-80">Try a different search or category</p>
            </div>
          ) : (
            <>
              {category === 'grocery' && <h3 className="text-lg font-bold mb-4 mt-2">Grab or Gone</h3>}
              <div className={`grid gap-2 md:gap-4 ${category === 'grocery' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`}>
                {products.map(p => <ProductCard key={p.id} product={p} isGrocery={category === 'grocery'} />)}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex gap-2 justify-center mt-12 pb-8">
              <button 
                className={`w-9 h-9 border border-gray-300 rounded-sm flex items-center justify-center transition-all bg-white hover:border-blue-primary hover:text-blue-primary disabled:opacity-30 disabled:cursor-not-allowed`}
                onClick={() => goToPage(page - 1)} 
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="flex items-center px-2 text-gray-400">...</span>}
                    <button 
                      className={`w-9 h-9 border rounded-sm flex items-center justify-center font-medium transition-all ${p === page ? 'bg-blue-primary border-blue-primary text-white shadow-md shadow-blue-primary/20' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-primary hover:text-blue-primary'}`} 
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  </Fragment>
                ))}
              <button 
                className={`w-9 h-9 border border-gray-300 rounded-sm flex items-center justify-center transition-all bg-white hover:border-blue-primary hover:text-blue-primary disabled:opacity-30 disabled:cursor-not-allowed`}
                onClick={() => goToPage(page + 1)} 
                disabled={page === pagination.totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="loading-center"><div className="spinner" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
