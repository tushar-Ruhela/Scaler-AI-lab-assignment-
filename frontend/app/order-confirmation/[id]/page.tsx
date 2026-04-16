'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import api from '@/lib/api';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-sm p-8 md:p-14 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm scale-110 border border-green/20">
          <CheckCircle size={44} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Order Placed Successfully! 🎉</h1>
        <p className="text-gray-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
          Your order has been confirmed and is currently being prepared for shipping.
        </p>

        <div className="bg-gray-50 py-4 px-8 rounded-sm inline-block border border-gray-200 mt-8 shadow-sm">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmation Number</div>
          <strong className="text-xl font-bold text-gray-900 tracking-wider">#{id}</strong>
        </div>

        {order && (
          <div className="mt-12 text-left bg-gray-50/50 p-6 md:p-10 rounded-sm border border-gray-100 shadow-inner overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <Package size={20} className="text-blue-primary" />
              Order Summary
            </h3>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-8">
              {(order.items || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-6 py-4 border-b border-gray-100 last:border-none hover:bg-white transition-all p-3 rounded-sm group">
                  <div className="w-16 h-16 bg-white border border-gray-100 p-2 flex items-center justify-center rounded shrink-0 shadow-sm grow-0">
                    <img src={item.image || '/placeholder.png'} alt={item.product_name} className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-gray-900 line-clamp-1 group-hover:text-blue-primary transition-colors">{item.product_name}</div>
                    <div className="text-xs text-gray-500 font-bold mt-1 tracking-wide">QTY: {item.quantity} · Item Price: ₹{item.unit_price.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-base font-black text-gray-900 tracking-tight">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-6 px-4 bg-white rounded-sm border border-gray-100 shadow-sm">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Amount Paid</span>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
            </div>

            {order.address_json && (
              <div className="mt-8 p-6 bg-white border border-dashed border-gray-300 rounded-sm shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-black text-blue-primary uppercase tracking-[0.2em] mb-3">
                  <Package size={14} />
                  Delivery Details
                </div>
                <div className="text-sm text-gray-600 leading-relaxed font-medium">
                  <strong className="text-gray-900 block mb-1 text-base">{order.address_json.full_name}</strong>
                  {order.address_json.address_line1}<br />
                  <span className="text-gray-400">{order.address_json.city}, {order.address_json.state} - {order.address_json.pincode}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12 pt-8 border-t border-gray-100">
          <Link href="/orders" className="flex items-center justify-center gap-2 px-10 py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-sm hover:bg-gray-900 hover:text-white transition-all group active:scale-95 shadow-lg shadow-gray-200">
            <Package size={20} className="group-hover:-rotate-12 transition-transform" />
            MY ORDERS
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-primary text-white font-bold rounded-sm hover:bg-blue-dark transition-all active:scale-95 shadow-lg shadow-blue-200">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
