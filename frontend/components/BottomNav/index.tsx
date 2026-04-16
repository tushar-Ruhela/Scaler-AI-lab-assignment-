'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Categories', icon: LayoutGrid, href: '/categories' },
    { label: 'Account', icon: User, href: '/account' },
    { label: 'Cart', icon: ShoppingCart, href: '/cart', badge: count },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[2000] px-4 py-2 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      {navItems.map((item, idx) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={idx} 
            href={item.href}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors duration-200 ${isActive ? 'text-blue-primary' : 'text-gray-500 hover:text-blue-primary'}`}
          >
            <div className="relative">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red text-white rounded-full min-w-[17px] h-[17px] px-1 text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-medium ${isActive ? 'text-blue-primary' : 'text-gray-600'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
