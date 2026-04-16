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
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <Package size={22} color="#2874f0" />
          <h1>My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="no-results">
            <Package size={64} />
            <h3 style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>No orders yet</h3>
            <p style={{ marginTop: 8 }}>Order something awesome!</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: 20 }}>Start Shopping</Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-item">
                  <label>ORDER PLACED</label>
                  <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="order-card-header-item">
                  <label>TOTAL</label>
                  <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="order-card-header-item">
                  <label>SHIP TO</label>
                  <span>{order.address_json?.full_name}</span>
                </div>
                <div className="order-card-header-item" style={{ marginLeft: 'auto' }}>
                  <label>ORDER #</label>
                  <span>{order.id}</span>
                </div>
                <span className={`order-status-badge ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-card-body">
                {(order.items || []).map((item: any, i: number) => (
                  <Link href={`/orders/${order.id}`} key={i} className="order-card-item" style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}>
                    <img src={item.image || '/placeholder.png'} alt={item.product_name} />
                    <div className="order-card-item-info" style={{ flex: 1 }}>
                      <div className="order-card-item-name">{item.product_name}</div>
                      <div className="order-card-item-meta">Qty: {item.quantity} · ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
