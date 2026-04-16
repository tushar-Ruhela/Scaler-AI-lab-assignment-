'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ShoppingCart, ArrowRight, Grid } from 'lucide-react';
import api from '@/lib/api';
import { useCart } from '@/lib/CartContext';

interface Category {
  id: number;
  name: string;
  image_url?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { count } = useCart();

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => {
        const fetched = data.categories || [];
        setCategories(fetched);
        if (fetched.length > 0) setSelectedId(fetched[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectedCategory = categories.find(c => c.id === selectedId);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <ChevronLeft size={24} className="text-gray-800" />
          </Link>
          <h1 className="text-[17px] font-bold text-gray-900">All Categories</h1>
        </div>
        <div className="flex items-center gap-5">
           <Search size={22} className="text-gray-700" />
           <Link href="/cart" className="relative">
             <ShoppingCart size={22} className="text-gray-700" />
             {count > 0 && (
               <span className="absolute -top-1.5 -right-2 bg-red text-white rounded-full min-w-[17px] h-[17px] text-[10px] font-bold flex items-center justify-center border-2 border-white">
                 {count}
               </span>
             )}
           </Link>
        </div>
      </div>

      <div className="flex bg-[#f1f3f6] min-h-[calc(100vh-112px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-[100px] bg-[#f1f3f6] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-r border-gray-200">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={`flex flex-col items-center justify-center p-3 py-4 cursor-pointer transition-all duration-200 border-l-[3px] ${selectedId === cat.id ? 'bg-white border-blue-primary font-bold' : 'border-transparent text-gray-600'}`}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-1.5 overflow-hidden shadow-sm border border-gray-100">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <Grid size={24} className="text-gray-400" />
                )}
              </div>
              <span className={`text-[11px] text-center leading-tight ${selectedId === cat.id ? 'text-blue-primary' : 'text-gray-800'}`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto p-4 pb-24">
          {loading ? (
             <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-primary"></div>
             </div>
          ) : selectedCategory ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
               {/* Spotlight Header */}
               <div className="relative rounded-xl overflow-hidden aspect-[16/7] shadow-sm border border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center p-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCategory.name}</h2>
                    <Link href={`/?category=${selectedCategory.name.toLowerCase()}`} className="mt-2 inline-flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-bold">
                       Explore <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="absolute right-[-10px] bottom-[-10px] opacity-40">
                     <Grid size={120} className="text-blue-100" />
                  </div>
               </div>

               {/* Grid Items */}
               <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 px-1">In The Spotlight</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Link key={i} href={`/?category=${selectedCategory.name.toLowerCase()}`} className="flex flex-col items-center bg-gray-50 rounded-xl p-3 border border-gray-100 active:scale-[0.98] transition-transform">
                           <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                              <img src={selectedCategory.image_url || '/placeholder.png'} className="w-[80%] h-[80%] object-contain opacity-80" alt="Subcategory" />
                           </div>
                           <span className="text-[12px] font-medium text-gray-800">New Arrivals</span>
                        </Link>
                     ))}
                  </div>
               </div>

               {/* Bottom CTA */}
               <div className="pt-4">
                  <Link href={`/?category=${selectedCategory.name.toLowerCase()}`} className="w-full flex items-center justify-center gap-2 bg-blue-primary text-white font-bold py-3.5 rounded-lg shadow-md active:bg-blue-600 transition-colors">
                     View All {selectedCategory.name} <ArrowRight size={18} />
                  </Link>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <Grid size={48} strokeWidth={1} />
               <p className="mt-4 font-medium text-sm">Select a category to explore</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
