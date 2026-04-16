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
    <div className="container">
      <div className="confirmation-page">
        <div className="confirmation-icon">
          <CheckCircle size={40} />
        </div>
        <h1>Order Placed Successfully! 🎉</h1>
        <p>Your order has been confirmed and will be delivered soon.</p>
        <div className="order-id-box">
          <div style={{ fontSize: 13, color: '#5f6368', marginBottom: 4 }}>Order ID</div>
          <strong>#{id}</strong>
        </div>

        {order && (
          <>
            <div style={{ marginTop: 32, maxWidth: 480, margin: '32px auto 0', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Order Details</h3>
              {(order.items || []).map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f1f3f4' }}>
                  <img src={item.image || '/placeholder.png'} alt={item.product_name} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 6, background: '#f8f9fa' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.product_name}</div>
                    <div style={{ fontSize: 13, color: '#9aa0a6' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
                <span>Total Paid</span>
                <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              {order.address_json && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8f9fa', borderRadius: 8, fontSize: 13, color: '#5f6368', lineHeight: 1.7 }}>
                  <strong style={{ color: '#202124' }}>Delivering to:</strong><br />
                  {order.address_json.full_name}<br />
                  {order.address_json.address_line1}, {order.address_json.city} - {order.address_json.pincode}
                </div>
              )}
            </div>
          </>
        )}

        <div className="confirmation-actions" style={{ marginTop: 32 }}>
          <Link href="/orders" className="btn btn-outline btn-lg">
            <Package size={18} /> View My Orders
          </Link>
          <Link href="/" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
