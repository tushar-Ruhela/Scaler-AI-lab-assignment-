'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Package, Ticket, HelpCircle, ChevronRight, 
  CreditCard, MapPin, Globe, Bell, Shield, 
  MessageSquare, Store, FileText, LayoutGrid, Heart, LogOut,
  Sparkles, Zap
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary"></div>
      </div>
    );
  }

  const sections = [
    {
      title: "Account Settings",
      items: [
        { icon: Sparkles, label: "Flipkart Plus", color: "text-blue-primary" },
        { icon: User, label: "Edit Profile" },
        { icon: CreditCard, label: "Saved Cards & Wallet" },
        { icon: MapPin, label: "Saved Addresses" },
        { icon: Globe, label: "Select Language" },
        { icon: Bell, label: "Notification Settings" },
        { icon: Shield, label: "Privacy Center" },
      ]
    },
    {
      title: "My Activity",
      items: [
        { icon: MessageSquare, label: "Reviews" },
        { icon: HelpCircle, label: "Questions & Answers" },
      ]
    },
    {
      title: "Earn with Flipkart",
      items: [
        { icon: Store, label: "Sell on Flipkart" },
      ]
    },
    {
      title: "Feedback & Information",
      items: [
        { icon: FileText, label: "Terms, Policies and Licenses" },
        { icon: HelpCircle, label: "Browse FAQs" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-24">
      {/* Header Profile Section */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm border-b border-gray-200">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{user.name}</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Explore <span className="text-blue-primary font-bold italic">BLACK</span> benefits</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fefce8] border border-yellow-200 px-3 py-1.5 rounded-full shadow-sm">
           <Zap size={15} fill="#ffcc00" className="text-yellow-600" />
           <span className="text-[14px] font-bold">0</span>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Orders', icon: Package, href: '/orders', color: 'text-blue-600' },
            { label: 'Wishlist', icon: Heart, href: '/wishlist', color: 'text-red-500' },
            { label: 'Coupons', icon: Ticket, href: '#', color: 'text-orange-500' },
            { label: 'Help Center', icon: HelpCircle, href: '#', color: 'text-blue-500' },
          ].map((item, idx) => (
            <Link key={idx} href={item.href} className="bg-white p-3.5 rounded-lg border border-gray-100 flex items-center gap-3 shadow-sm active:bg-gray-50 transition-colors">
              <div className={`${item.color} bg-opacity-10 p-1.5 rounded-full`}>
                <item.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[14px] font-bold text-gray-800">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Settings List */}
      <div className="space-y-2 mt-2">
        {sections.map((section, sidx) => (
          <div key={sidx} className="bg-white border-y border-gray-200">
            {section.title && (
              <div className="px-4 py-3 text-[15px] font-bold text-gray-900 border-b border-gray-50">{section.title}</div>
            )}
            <div className="divide-y divide-gray-50">
              {section.items.map((item, iidx) => (
                <div key={iidx} className="flex items-center justify-between px-4 py-4 active:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <item.icon size={22} strokeWidth={2} className={item.color || "text-blue-primary"} />
                    <span className="text-[14px] font-medium text-gray-800">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-active:text-blue-primary" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <button 
          onClick={logout}
          className="w-full bg-white text-blue-primary font-bold py-4 rounded-md border border-gray-200 shadow-sm active:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
