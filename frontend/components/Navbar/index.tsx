'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, User, Search, LogOut, Package, Shirt, Laptop, Smartphone, Sofa, Dumbbell, BookOpen, Sparkles, Plane, MapPin, Zap, ChevronDown, ShoppingBag, Ticket, Shield, CreditCard, Gift, Bell, Store, Headphones, LineChart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

interface Category { id: number; name: string; slug: string; }
interface ProductSuggestion { id: number; name: string; primary_image: string; price: number; }

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      api.get(`/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`)
         .then(({ data }) => setSuggestions(data.products || []))
         .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const iconMap: Record<string, any> = {
    'fashion': Shirt,
    'electronics': Laptop,
    'mobiles': Smartphone,
    'home-furniture': Sofa,
    'grocery': ShoppingBag,
    'sports-fitness': Dumbbell,
    'books': BookOpen,
  };

  return (
    <>
      <nav className="navbar-top">
        {/* Row 1: Logo & Utility Pills */}
        <div className="navbar-row-top">
          <Link href="/" className="navbar-logo-pill">
            <Sparkles className="navbar-logo-icon" size={14} />
            Flipkart
          </Link>
          
          <div className="navbar-quick-pills" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <Link href="/" className="npill" style={!categoryParam ? { background: '#f5f5f5', border: '1px solid #e0e0e0' } : {}}>
              <Sparkles size={14} color="#2874f0" />
              Flipkart
            </Link>
            <Link href="/?category=emi" className="npill" style={categoryParam === 'emi' ? { background: '#4a00e0', color: '#fff', border: 'none' } : {}}>
              <span className="npill-icon" style={categoryParam === 'emi' ? { background: '#ffd700', color: '#000', fontSize: '10px' } : { background: '#dbfae1', color: '#16a34a', fontSize: '10px' }}>%</span>
              EMI
            </Link>
            <Link href="/?category=travel" className="npill" style={categoryParam === 'travel' ? { background: '#e3342f', color: '#fff', border: 'none' } : {}}>
              <Plane size={14} color={categoryParam === 'travel' ? "#fff" : "#3b82f6"} />
              Travel
            </Link>
            <Link href="/?category=grocery" className="npill" style={categoryParam === 'grocery' ? { background: '#e1610b', color: '#fff', border: 'none' } : {}}>
              <ShoppingBag size={14} color={categoryParam === 'grocery' ? "#fff" : "#8b5cf6"} />
              Grocery
            </Link>
          </div>

          <div className="navbar-delivery">
            <MapPin size={16} color="#000" />
            247776 <span>Select delivery location &rsaquo;</span>
          </div>

          <div className="navbar-coins">
            <Zap size={14} fill="#ffcc00" color="#e6b800" /> 0
          </div>
        </div>

        {/* Row 2: Search & Account Actions */}
        <div className="navbar-row-bottom">
          <div className="navbar-search-wrapper" ref={searchWrapperRef}>
            <form className="navbar-search" onSubmit={handleSearch}>
              <button type="submit" className="navbar-search-btn" aria-label="Search">
                <Search size={20} />
              </button>
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                id="navbar-search-input"
                autoComplete="off"
              />
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(s => (
                  <Link 
                    key={s.id} 
                    href={`/product/${s.id}`} 
                    className="search-suggestion-item"
                    onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                  >
                    <img src={s.primary_image || '/placeholder.png'} className="search-suggestion-img" alt={s.name} />
                    <div className="search-suggestion-details">
                      <div className="search-suggestion-name">{s.name}</div>
                      <div className="search-suggestion-price">₹{Number(s.price).toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="navbar-actions">
            {user ? (
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div
                  className="nav-action-btn"
                  id="user-menu-btn"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <User size={22} />
                  {user.name.split(' ')[0]} <ChevronDown size={14} style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: 4 }} />
                </div>
                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: '120%', right: 0,
                    background: '#fff', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    minWidth: 240, zIndex: 1000, overflow: 'hidden', padding: '8px 0', border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ padding: '8px 16px', fontSize: 14, color: '#878787', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>Your Account</div>
                    
                    {[
                      { icon: User, label: 'My Profile', href: '/' },
                      { icon: Package, label: 'Orders', href: '/orders' },
                      { icon: Ticket, label: 'Coupons', href: '/' },
                      { icon: Zap, label: 'Supercoin', href: '/' },
                      { icon: Shield, label: 'Flipkart Plus Zone', href: '/' },
                      { icon: CreditCard, label: 'Saved Cards & Wallet', href: '/' },
                      { icon: MapPin, label: 'Saved Addresses', href: '/' },
                      { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                      { icon: Gift, label: 'Gift Cards', href: '/' },
                      { icon: Bell, label: 'Notifications', href: '/' },
                    ].map((item, idx) => (
                      <Link key={idx} href={item.href} onClick={() => setShowUserMenu(false)}
                        className="search-suggestion-item"
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', fontSize: 14, color: '#202124', border: 'none', background: 'transparent' }}
                      >
                        <item.icon size={16} color="#2874f0" /> {item.label}
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); router.push('/'); }}
                      className="search-suggestion-item"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', fontSize: 14, color: '#c62828', width: '100%', border: 'none', borderTop: '1px solid #f0f0f0', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: 4 }}
                    >
                      <LogOut size={16} color="#c62828" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="nav-action-btn" id="login-btn">
                <User size={22} />
                Login
              </Link>
            )}

            {user && (
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowMoreMenu(true)}
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                <div className="nav-action-btn" style={{ cursor: 'pointer', padding: '0 8px', height: '100%', display: 'flex', alignItems: 'center' }}>
                  More <ChevronDown size={14} style={{ transform: showMoreMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: 4 }} />
                </div>
                {showMoreMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: -40,
                    background: '#fff', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    minWidth: 220, zIndex: 1000, overflow: 'hidden', padding: '8px 0', border: '1px solid #e0e0e0', marginTop: 8
                  }}>
                    {[
                      { icon: Store, label: 'Become a Seller', href: '/' },
                      { icon: Bell, label: 'Notification Settings', href: '/' },
                      { icon: Headphones, label: '24x7 Customer Care', href: '/' },
                      { icon: LineChart, label: 'Advertise on Flipkart', href: '/' },
                    ].map((item, idx) => (
                      <Link key={idx} href={item.href}
                        className="search-suggestion-item"
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', fontSize: 14, color: '#333', textDecoration: 'none', background: 'transparent' }}
                      >
                        <item.icon size={18} color="#202124" /> {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link href="/cart" className="nav-action-btn" id="cart-btn">
              <ShoppingCart size={22} />
              <span>Cart</span>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Row 3: Category Strip */}
      {categories.length > 0 && (
        <div className="category-bar-wrapper">
          <div className="category-bar-inner">
            <Link href="/" className={`category-item ${!categoryParam ? 'active' : ''}`}>
              <Sparkles size={24} />
              <span>For You</span>
            </Link>
            {categories.map(cat => {
              const Icon = iconMap[cat.slug] || Package;
              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`category-item ${categoryParam === cat.slug ? 'active' : ''}`}
                >
                  <Icon size={24} strokeWidth={1.5} />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
