'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, MessageSquare, X } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {
        toast.error('Order not found');
        router.push('/orders');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!order) return null;

  const address = order.address_json || {};
  const items = order.items || [];
  
  // Fake tracking dates based on created_at
  const createdDate = new Date(order.created_at);
  const deliveryDate = new Date(createdDate);
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: 16, paddingBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#878787', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-blue-600">Home</Link> <ChevronRight size={12} /> 
          <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-blue-600">My Account</Link> <ChevronRight size={12} /> 
          <Link href="/orders" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-blue-600">My Orders</Link> <ChevronRight size={12} /> 
          <span style={{ color: '#2874f0' }}>OD{String(order.id).replace(/-/g, '').substring(0,18).toUpperCase()}</span>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: 16, alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item: any, i: number) => (
            <div key={i} style={{ background: '#fff', borderRadius: 4, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #f0f0f0', paddingBottom: 24, marginBottom: 24 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 500, color: '#212121', lineHeight: 1.4, marginBottom: 8 }}>{item.product_name}</h2>
                  <div style={{ fontSize: 12, color: '#878787', marginBottom: 16 }}>Seller: BrightTech</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 500 }}>₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 12, color: '#388e3c', fontWeight: 500 }}>{item.quantity} offer applied</span>
                  </div>
                </div>
                <div style={{ width: 100, height: 100 }}>
                  <img src={item.image || '/placeholder.png'} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              <div className="order-stepper">
                <div className="order-step completed" style={{ padding: '0 0 32px 0' }}>
                  <div className="order-step-marker completed" style={{ top: 0, left: -6 }}></div>
                  <div style={{ background: '#e8f5e9', padding: '12px 16px', borderRadius: 4, marginLeft: 16, marginTop: -12 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#212121', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>Order Confirmed</div>
                    <div style={{ fontSize: 12, color: '#212121' }}>Your Order has been placed., {new Date(createdDate.getTime()).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                  </div>
                </div>
                
                <div className="order-step">
                  <div className="order-step-marker"></div>
                  <div style={{ paddingLeft: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#878787' }}>Shipped, Expected by {new Date(createdDate.getTime() + 86400000 * 2).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
                
                <div className="order-step">
                  <div className="order-step-marker"></div>
                  <div style={{ paddingLeft: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#878787' }}>Out For Delivery</div>
                  </div>
                </div>

                <div className="order-step last">
                  <div className="order-step-marker"></div>
                  <div style={{ paddingLeft: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#878787' }}>Delivery, {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} By 11 PM</div>
                  </div>
                </div>
              </div>

              <div style={{ color: '#2874f0', fontSize: 14, fontWeight: 500, margin: '24px 0 16px', display: 'flex', alignItems: 'center' }}>
                See All Updates <ChevronRight size={16} />
              </div>

              <div style={{ fontSize: 12, color: '#878787', borderTop: '1px solid #f0f0f0', paddingTop: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
                Delivery Executive details will be available once the order is out for delivery
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 16 }}>
                <button style={{ background: 'transparent', border: 'none', borderRight: '1px solid #f0f0f0', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#212121', cursor: 'pointer' }}>
                  <X size={18} /> Cancel
                </button>
                <button style={{ background: 'transparent', border: 'none', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#212121', cursor: 'pointer' }}>
                  <MessageSquare size={18} /> Chat with us
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Delivery Details */}
          <div style={{ background: '#fff', borderRadius: 4, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#212121', marginBottom: 20 }}>Delivery details</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ padding: '2px 8px', background: '#f0f0f0', color: '#212121', fontSize: 11, fontWeight: 500, borderRadius: 2 }}>Home</div>
              <div style={{ fontSize: 14, color: '#212121', lineHeight: 1.4, flex: 1 }}>
                <span style={{ fontWeight: 500 }}>{address.full_name}</span><br />
                {address.address_line1}, {address.city}, {address.pincode}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 34 }}></div>
              <div style={{ fontSize: 14, color: '#212121', fontWeight: 500 }}>{address.phone}</div>
            </div>
          </div>

          {/* Price Details */}
          <div style={{ background: '#fff', borderRadius: 4, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#212121', marginBottom: 20 }}>Price details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14, borderBottom: '1px dashed #e0e0e0', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#212121' }}>Listing price</span>
                <span style={{ textDecoration: 'line-through', color: '#878787' }}>₹{(parseFloat(order.total_amount) + 500).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#212121' }}>Special price</span>
                <span style={{ color: '#212121' }}>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#212121' }}>Total fees</span>
                <span style={{ color: '#212121' }}>₹19</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#212121' }}>Other discount</span>
                <span style={{ color: '#388e3c' }}>-₹19</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, color: '#212121', marginBottom: 24 }}>
              <span>Total amount</span>
              <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
            </div>

            <div style={{ background: '#f5fbf6', border: '1px solid #e0e0e0', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#212121' }}>Paid By</span>
              <span style={{ fontSize: 14, fontWeight: 600, border: '1px solid #ddd', padding: '2px 8px', borderRadius: 4, background: '#fff' }}>UPI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
