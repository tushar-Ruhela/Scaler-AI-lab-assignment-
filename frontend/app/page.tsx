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
        <div className="hero-banner">
          <h1>India's Biggest Online Store</h1>
          <p>Electronics, Fashion, Home, Books, Sports & more — all at the best prices</p>
        </div>
      )}
      
      {category === 'grocery' && (
        <div style={{ background: '#e1610b', paddingTop: 20 }}>
          <div className="container" style={{ padding: '0 16px 20px', textAlign: 'center' }}>
            <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Celebrate Akshaya Tritiya</h1>
            <p style={{ color: '#fff', fontSize: 16, opacity: 0.9 }}>Exciting grabs, fresh produce and amazing discounts!</p>
          </div>
        </div>
      )}

      {category === 'emi' && (
        <div style={{ background: 'linear-gradient(to bottom, #2874f0, #1a4eb8)', minHeight: 'calc(100vh - 120px)', paddingTop: '60px', color: '#fff', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: '#facc15', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Instant EMI for Everyone</h1>
            <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 50, color: '#fff' }}>Get up to ₹500 Off* | <span style={{ color: '#facc15' }}>No Cost EMI</span></h2>
            
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px 48px', display: 'inline-flex', alignItems: 'center', gap: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', margin: '0 auto' }}>
              <div style={{ background: '#facc15', borderRadius: '8px 8px 8px 32px', width: 80, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={40} strokeWidth={2.5} color="#2874f0" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#2874f0', lineHeight: 1 }}>Flipkart</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#000', lineHeight: 1 }}>EMI</div>
              </div>
            </div>

            <div style={{ marginTop: 120, background: '#2874f0', padding: '32px 0', borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: '0 -10px 30px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: 48, fontWeight: 900, color: '#facc15', textTransform: 'uppercase', letterSpacing: 2 }}>Apply Now</h2>
            </div>
          </div>
        </div>
      )}

      {category === 'travel' && (
        <div style={{ background: '#f0f8ff', minHeight: 'calc(100vh - 120px)', padding: '32px 16px', fontFamily: 'sans-serif' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, background: '#e0efff', padding: '12px 24px', borderRadius: 8 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>Welcome Tushar</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', padding: '4px 10px', borderRadius: 16, fontSize: 13, fontWeight: 600, color: '#202124' }}>
                <Zap size={14} fill="#facc15" color="#ca8a04" /> 0
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
              {[ 
                { title: 'Flights', subtitle: 'Up to 25% Off', color: '#10b981', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500' },
                { title: 'Hotels', subtitle: 'Up to 65% Off', color: '#10b981', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' },
                { title: 'Buses', subtitle: '', color: '#10b981', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500' }
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 24, padding: 24, textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden', height: 280, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111', marginBottom: 4, zIndex: 2 }}>{item.title}</h2>
                  {item.subtitle && <p style={{ fontSize: 18, fontWeight: 700, color: item.color, zIndex: 2 }}>{item.subtitle}</p>}
                  <img src={item.img} style={{ position: 'absolute', bottom: -20, left: 0, width: '100%', height: 160, objectFit: 'contain', zIndex: 1 }} alt={item.title} />
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', marginBottom: 24, border: '1px solid #e0e7ff', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 28 }}>🧳</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#202124' }}>My trips</span>
              </div>
              <ChevronRight size={28} color="#202124" strokeWidth={2.5} />
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #e0e7ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ background: '#004c99', color: '#fff', padding: '8px 16px', fontWeight: 800, borderRadius: 2, letterSpacing: 1, fontSize: 20 }}>HDFC BANK</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#202124' }}>Up to 13% Off*</div>
                  <div style={{ fontSize: 15, color: '#666', fontWeight: 500 }}>on Credit Card Trxns.</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#aaa', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>*T&C Apply</div>
            </div>
          </div>
        </div>
      )}

      {category !== 'emi' && category !== 'travel' && (
      <div className="container">
        {/* Products section */}
        
        {!search && !category && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Brands In Spotlight</h2>
            <div style={{ borderRadius: 8, overflow: 'hidden', background: '#e0f7fa' }}>
              <img 
                src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=1200&h=300&fit=crop" 
                alt="Garnier Promotion" 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
              />
            </div>
          </div>
        )}

        <div className="products-section">
          <div className="products-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {search ? `Results for "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
              {pagination && <span style={{ fontWeight: 400, fontSize: 14, color: '#9aa0a6' }}>({pagination.total} items)</span>}
              {search && (
                <button
                  onClick={() => router.push(category ? `/?category=${category}` : '/')}
                  className="btn btn-sm" style={{ background: '#fce8e6', color: '#c62828', borderRadius: 20, padding: '4px 10px', fontSize: 12 }}
                >
                  Clear Search ✕
                </button>
              )}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={16} color="#9aa0a6" />
              <select
                className="sort-select"
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
            <div className="product-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="product-card">
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 16 }}>
                    <div className="skeleton" style={{ height: 14, marginBottom: 8, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 14, marginBottom: 8, borderRadius: 4, width: '80%' }} />
                    <div className="skeleton" style={{ height: 20, borderRadius: 4, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="no-results">
              <p style={{ fontSize: 18, fontWeight: 600 }}>No products found</p>
              <p style={{ marginTop: 8 }}>Try a different search or category</p>
            </div>
          ) : (
            <>
              {category === 'grocery' && <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 8 }}>Grab or Gone</h3>}
              <div className="product-grid" style={category === 'grocery' ? { gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' } : {}}>
                {products.map(p => <ProductCard key={p.id} product={p} isGrocery={category === 'grocery'} />)}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ padding: '0 8px', color: '#9aa0a6' }}>...</span>}
                    <button className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => goToPage(p)}>{p}</button>
                  </Fragment>
                ))}
              <button className="page-btn" onClick={() => goToPage(page + 1)} disabled={page === pagination.totalPages}>
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
