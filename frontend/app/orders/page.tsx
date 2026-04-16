'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import api from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 md:py-8 font-sans">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-primary/10 rounded-full">
            <Package size={22} className="text-blue-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-16 rounded-sm shadow-sm flex flex-col items-center text-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Package size={48} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven&apos;t placed any orders yet. Go ahead and order something awesome!</p>
            <Link href="/" className="bg-blue-primary text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-blue-dark transition-all uppercase tracking-wide">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="bg-gray-50/80 p-4 px-6 border-b border-gray-100 flex flex-wrap gap-x-8 gap-y-4 items-center">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ORDER PLACED</label>
                    <span className="text-sm font-medium text-gray-700">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TOTAL</label>
                    <span className="text-sm font-bold text-gray-900">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SHIP TO</label>
                    <span className="text-sm font-medium text-gray-700">{order.address_json?.full_name}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 md:ml-auto">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">ORDER #</label>
                    <span className="text-sm font-medium text-gray-500">{order.id}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  {(order.items || []).map((item: any, i: number) => (
                    <Link href={`/orders/${order.id}`} key={i} className="flex gap-6 items-center group no-underline">
                      <div className="w-20 h-20 bg-white border border-gray-50 p-2 rounded flex items-center justify-center shrink-0">
                        <img src={item.image || '/placeholder.png'} alt={item.product_name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-base font-medium text-gray-900 group-hover:text-blue-primary transition-colors line-clamp-2 leading-snug">{item.product_name}</div>
                        <div className="text-sm text-gray-500 mt-1 font-semibold">Qty: {item.quantity} · ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                      <div className="hidden md:flex items-center text-blue-primary font-bold text-sm uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                        View Details &rsaquo;
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
