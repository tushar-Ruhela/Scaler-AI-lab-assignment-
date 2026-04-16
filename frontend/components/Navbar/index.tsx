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
      <nav className="bg-white border-b border-gray-200 relative z-[1000]">
        {/* Row 1: Logo & Utility Pills */}
        <div className="flex items-center justify-between px-4 py-2 max-w-[1280px] mx-auto gap-6">
          <Link href="/" className="flex items-center justify-center bg-[#ffcc00] text-black px-3.5 py-1.5 rounded-sm rounded-br-xl font-extrabold italic no-underline text-base shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.1)] shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            <Sparkles className="w-3.5 mr-1 fill-blue-primary" size={14} />
            Flipkart
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3 flex-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="flex items-center gap-1.5 bg-[#f0f2f5] px-3 md:px-4 py-2 rounded-[20px] text-xs md:text-[13px] font-semibold text-gray-800 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-[#e4e7eb]" style={!categoryParam ? { background: '#f5f5f5', border: '1px solid #e0e0e0' } : {}}>
              <Sparkles size={14} color="#2874f0" />
              Flipkart
            </Link>
            <Link href="/?category=emi" className="flex items-center gap-1.5 bg-[#f0f2f5] px-3 md:px-4 py-2 rounded-[20px] text-xs md:text-[13px] font-semibold text-gray-800 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-[#e4e7eb]" style={categoryParam === 'emi' ? { background: '#4a00e0', color: '#fff', border: 'none' } : {}}>
              <span className="flex items-center justify-center w-4 h-4 rounded-full p-0.5" style={categoryParam === 'emi' ? { background: '#ffd700', color: '#000', fontSize: '10px' } : { background: '#dbfae1', color: '#16a34a', fontSize: '10px' }}>%</span>
              EMI
            </Link>
            <Link href="/?category=travel" className="flex items-center gap-1.5 bg-[#f0f2f5] px-3 md:px-4 py-2 rounded-[20px] text-xs md:text-[13px] font-semibold text-gray-800 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-[#e4e7eb]" style={categoryParam === 'travel' ? { background: '#e3342f', color: '#fff', border: 'none' } : {}}>
              <Plane size={14} color={categoryParam === 'travel' ? "#fff" : "#3b82f6"} />
              Travel
            </Link>
            <Link href="/?category=grocery" className="flex items-center gap-1.5 bg-[#f0f2f5] px-3 md:px-4 py-2 rounded-[20px] text-xs md:text-[13px] font-semibold text-gray-800 cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-[#e4e7eb]" style={categoryParam === 'grocery' ? { background: '#e1610b', color: '#fff', border: 'none' } : {}}>
              <ShoppingBag size={14} color={categoryParam === 'grocery' ? "#fff" : "#8b5cf6"} />
              Grocery
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap cursor-pointer">
            <MapPin size={16} color="#000" />
            247776 <span className="text-blue-dark">Select delivery location &rsaquo;</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[#fffdf5] border border-[#ffcc00] px-2.5 py-1 rounded-[20px] text-[13px] font-semibold text-black">
            <Zap size={14} fill="#ffcc00" color="#e6b800" /> 0
          </div>
        </div>

        {/* Row 2: Search & Account Actions */}
        <div className="flex items-center gap-4 md:gap-8 px-4 pb-3 pt-1 md:pt-2 max-w-[1280px] mx-auto">
          <div className="relative flex-1 max-w-[900px]">
            <form className="w-full flex items-center bg-blue-light rounded-lg overflow-hidden border border-transparent transition-all duration-200 focus-within:bg-white focus-within:border-blue-primary focus-within:shadow-[0_0_0_4px_rgba(40,116,240,0.1)]" onSubmit={handleSearch}>
              <button type="submit" className="bg-transparent border-none px-3 md:px-4 py-3 text-gray-600 cursor-pointer" aria-label="Search">
                <Search size={20} />
              </button>
              <input
                className="flex-1 py-3 border-none outline-none bg-transparent text-[15px] text-gray-900 font-medium placeholder:text-gray-600 placeholder:font-normal"
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
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-200 z-[1001] overflow-hidden flex flex-col">
                {suggestions.map(s => (
                  <Link 
                    key={s.id} 
                    href={`/product/${s.id}`} 
                    className="flex items-center gap-3 px-4 py-2.5 no-underline text-gray-900 border-b border-gray-100 transition-colors duration-200 cursor-pointer hover:bg-gray-50 last:border-none"
                    onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                  >
                    <img src={s.primary_image || '/placeholder.png'} className="w-8 h-8 object-contain shrink-0" alt={s.name} />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-overflow-ellipsis">{s.name}</div>
                      <div className="text-xs font-semibold text-blue-primary mt-0.5">₹{Number(s.price).toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div
                  className="flex items-center gap-2 text-gray-800 text-[15px] font-medium cursor-pointer transition-colors duration-200 hover:text-blue-primary"
                  id="user-menu-btn"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <User size={22} className="shrink-0" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: 4 }} />
                </div>
                {showUserMenu && (
                  <div className="absolute top-[120%] right-0 bg-white rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.1)] min-w-[240px] z-[1000] overflow-hidden py-2 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-[#878787] border-b border-[#f0f0f0] mb-1">Your Account</div>
                    
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
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 transition-colors duration-200 hover:bg-gray-50 bg-transparent"
                      >
                        <item.icon size={16} className="text-blue-primary" /> {item.label}
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); router.push('/'); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-dark w-full border-t border-[#f0f0f0] bg-transparent cursor-pointer text-left mt-1 hover:bg-gray-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-2 text-gray-800 text-[15px] font-medium transition-colors duration-200 hover:text-blue-primary" id="login-btn">
                <User size={22} className="shrink-0" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {user && (
              <div
                className="relative"
                onMouseEnter={() => setShowMoreMenu(true)}
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                <div className="flex items-center gap-1 text-gray-800 text-[15px] font-medium cursor-pointer px-2 transition-colors duration-200 hover:text-blue-primary h-full">
                  <span className="hidden sm:inline">More</span> <ChevronDown size={14} style={{ transform: showMoreMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: 4 }} />
                </div>
                {showMoreMenu && (
                  <div className="absolute top-full right-[-40px] bg-white rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.1)] min-w-[220px] z-[1000] overflow-hidden py-2 border border-gray-200 mt-2">
                    {[
                      { icon: Store, label: 'Become a Seller', href: '/' },
                      { icon: Bell, label: 'Notification Settings', href: '/' },
                      { icon: Headphones, label: '24x7 Customer Care', href: '/' },
                      { icon: LineChart, label: 'Advertise on Flipkart', href: '/' },
                    ].map((item, idx) => (
                      <Link key={idx} href={item.href}
                        className="flex items-center gap-3.5 px-5 py-3.5 text-sm text-[#333] no-underline bg-transparent hover:bg-gray-50"
                      >
                        <item.icon size={18} className="text-gray-900" /> {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link href="/cart" className="flex items-center gap-2 text-gray-800 text-[15px] font-medium no-underline transition-colors duration-200 hover:text-blue-primary relative" id="cart-btn">
              <ShoppingCart size={22} className="shrink-0" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && <span className="absolute [-top-1.5] [right-[-12px]] sm:[-right-3] bg-red text-white rounded-full min-w-[18px] h-[18px] px-1 text-[11px] font-bold flex items-center justify-center border-2 border-white">{count}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Row 3: Category Strip */}
      {categories.length > 0 && (
        <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative z-[999]">
          <div className="flex gap-4 md:gap-6 overflow-x-auto max-w-[1200px] mx-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className={`flex flex-col items-center gap-2 py-2.5 px-1 cursor-pointer transition-all border-b-[3px] whitespace-nowrap text-gray-800 relative hover:text-blue-primary ${!categoryParam ? 'border-b-blue-primary text-blue-primary font-bold' : 'border-transparent'}`}>
              <Sparkles size={24} className="transition-transform duration-200 hover:scale-110" />
              <span className="text-[11px] md:text-[14px] font-medium">For You</span>
            </Link>
            {categories.map(cat => {
              const Icon = iconMap[cat.slug] || Package;
              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`flex flex-col items-center gap-2 py-2.5 px-1 cursor-pointer transition-all border-b-[3px] whitespace-nowrap text-gray-800 relative hover:text-blue-primary ${categoryParam === cat.slug ? 'border-b-blue-primary text-blue-primary font-bold' : 'border-transparent'}`}
                >
                  <Icon size={24} strokeWidth={1.5} className="transition-transform duration-200 hover:scale-110" />
                  <span className="text-[11px] md:text-[14px] font-medium">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
