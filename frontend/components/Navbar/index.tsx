'use client';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, User, Search, LogOut, Package, Shirt, Laptop, Smartphone, Sofa, Dumbbell, BookOpen, Sparkles, Plane, MapPin, Zap, ChevronDown, ShoppingBag, Ticket, Shield, CreditCard, Gift, Bell, Store, Headphones, LineChart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';

interface Category { id: number; name: string; slug: string; }
interface ProductSuggestion { id: number; name: string; primary_image: string; price: number; }

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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
  const searchWrapperRef = useRef<HTMLFormElement>(null);

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
        <div className="max-w-[1280px] mx-auto">
          {/* Row 1: Brand Switcher (Flipkart, EMI, Travel) */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-b from-[#f1f3f6] to-white md:bg-white overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="flex items-center gap-1.5 bg-[#ffcc00] text-black px-4 py-1.5 rounded-[20px] text-[13px] font-bold shadow-sm shrink-0">
              <Sparkles size={14} className="fill-blue-primary" />
              Flipkart
            </Link>
            <Link href="/?category=emi" className="flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-1.5 rounded-[20px] text-[13px] font-semibold text-gray-700 hover:bg-gray-50 shrink-0">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#dbfae1] text-[#16a34a] text-[10px] font-bold">%</span>
              EMI
            </Link>
            <Link href="/?category=travel" className="flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-1.5 rounded-[20px] text-[13px] font-semibold text-gray-700 hover:bg-gray-50 shrink-0">
              <Plane size={14} className="text-red" />
              Travel
            </Link>
            
            <div className="flex-1" />
            
            {/* Desktop Only: Supercoin & Location inside row 1 */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1 bg-[#fffdf5] border border-[#ffcc00] px-2.5 py-1 rounded-[20px] text-[12px] font-semibold text-black">
                <Zap size={14} fill="#ffcc00" color="#e6b800" /> 0
              </div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-900 whitespace-nowrap cursor-pointer">
                <MapPin size={15} />
                247776 <span className="text-blue-dark">Select location &rsaquo;</span>
              </div>
            </div>
          </div>

          {/* Row 2 (Mobile Only): Location Selector */}
          <div className="md:hidden flex items-center justify-between px-4 py-1 text-[13px]">
            <div className="flex items-center gap-1.5 text-gray-800 font-medium">
              <MapPin size={14} className="text-gray-600" />
              <span>Location not set</span>
              <span className="text-blue-primary font-semibold flex items-center">Select delivery location <span className="text-[16px] leading-none ml-0.5">&rsaquo;</span></span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full text-[11px] font-bold border border-yellow-200">
               <Zap size={12} fill="#ffcc00" className="text-yellow-600" /> 0
            </div>
          </div>

          {/* Row 3: Search Bar & Notifications (Mobile) / Search & Account (Desktop) */}
          <div className="flex items-center gap-4 px-4 pb-3 pt-1">
            <div className="relative flex-1">
              <form 
                className="w-full flex items-center bg-[#f0f5ff] rounded-lg overflow-hidden border border-gray-100 transition-all duration-200 focus-within:bg-white focus-within:border-blue-primary focus-within:shadow-[0_0_0_4px_rgba(40,116,240,0.1)]" 
                onSubmit={handleSearch}
                ref={searchWrapperRef}
              >
                <div className="px-3 text-gray-500">
                  <Search size={18} />
                </div>
                <input
                  className="flex-1 py-2.5 md:py-3 border-none outline-none bg-transparent text-[14px] md:text-[15px] text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal"
                  type="text"
                  placeholder="Search for Products"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  autoComplete="off"
                />
              </form>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 z-[1001] overflow-hidden flex flex-col">
                  {suggestions.map(s => (
                    <Link key={s.id} href={`/product/${s.id}`} 
                      className="flex items-center gap-3 px-4 py-3 no-underline text-gray-900 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-none"
                      onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                    >
                      <img src={s.primary_image || '/placeholder.png'} className="w-8 h-8 object-contain" alt={s.name} />
                      <div className="text-[13px] font-medium truncate">{s.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="relative" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                  <div className="flex items-center gap-2 text-gray-800 text-[15px] font-medium cursor-pointer hover:text-blue-primary">
                    <User size={20} />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                  {showUserMenu && (
                    <div className="absolute top-[120%] right-0 bg-white rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.1)] min-w-[240px] z-[1000] py-2 border border-gray-200">
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50">
                        <Package size={16} className="text-blue-primary" /> Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50">
                        <Heart size={16} className="text-blue-primary" /> Wishlist
                      </Link>
                      <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 w-full text-left hover:bg-gray-50 border-t mt-1">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-2 text-gray-800 text-[15px] font-medium hover:text-blue-primary">
                  <User size={20} /> Login
                </Link>
              )}

              <div className="relative" onMouseEnter={() => setShowMoreMenu(true)} onMouseLeave={() => setShowMoreMenu(false)}>
                <div className="flex items-center gap-1 text-gray-800 text-[15px] font-medium cursor-pointer hover:text-blue-primary">
                  <span>More</span> <ChevronDown size={14} className={`transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`} />
                </div>
                {showMoreMenu && (
                  <div className="absolute top-full right-0 bg-white shadow-xl min-w-[200px] py-2 border border-gray-100 z-[1000] mt-2 rounded-sm">
                    <Link href="/" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <Bell size={16} /> Notifications
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <Headphones size={16} /> Customer Care
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/cart" className="flex items-center gap-2 text-gray-800 text-[15px] font-medium hover:text-blue-primary relative">
                <ShoppingCart size={20} /> 
                <span>Cart</span>
                {count > 0 && <span className="absolute -top-2 -right-3 bg-red text-white rounded-full min-w-[17px] h-[17px] text-[10px] font-bold flex items-center justify-center border-2 border-white">{count}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Row 3: Category Strip (Only on Home Page) */}
      {pathname === '/' && categories.length > 0 && (
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
