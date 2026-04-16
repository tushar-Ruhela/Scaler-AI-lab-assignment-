'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Address {
  full_name: string; phone: string; email: string;
  address_line1: string; address_line2: string;
  city: string; state: string; pincode: string;
}

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalMrp, saving } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [address, setAddress] = useState<Address>({
    full_name: '', phone: '', email: '',
    address_line1: '', address_line2: '',
    city: '', state: 'Maharashtra', pincode: '',
  });

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <ShoppingBag size={60} color="#dadce0" />
        <h2 style={{ marginTop: 16 }}>Nothing to checkout</h2>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Continue Shopping</Link>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!address.full_name.trim()) errs.full_name = 'Name is required';
    if (!/^\d{10}$/.test(address.phone)) errs.phone = 'Enter valid 10-digit phone';
    if (address.email && !/\S+@\S+\.\S+/.test(address.email)) errs.email = 'Enter valid email';
    if (!address.address_line1.trim()) errs.address_line1 = 'Address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = 'Enter valid 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) { toast.error('Please fix the errors'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { address });
      toast.success('Order placed successfully!');
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder = '', half = false, as = 'input' }: any) => (
    <div className={`form-group ${half ? '' : 'full'}`}>
      <label className="form-label" htmlFor={`field-${name}`}>{label}</label>
      {as === 'select' ? (
        <select
          id={`field-${name}`}
          className={`form-input ${errors[name] ? 'error' : ''}`}
          value={(address as any)[name]}
          onChange={e => setAddress(a => ({ ...a, [name]: e.target.value }))}
        >
          {STATES.map(s => <option key={s}>{s}</option>)}
        </select>
      ) : (
        <input
          id={`field-${name}`}
          type={type}
          placeholder={placeholder}
          className={`form-input ${errors[name] ? 'error' : ''}`}
          value={(address as any)[name]}
          onChange={e => setAddress(a => ({ ...a, [name]: e.target.value }))}
        />
      )}
      {errors[name] && <span style={{ color: '#c62828', fontSize: 12 }}>{errors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <MapPin size={22} color="#2874f0" />
          <h1>Checkout</h1>
        </div>
        <div className="checkout-layout">
          {/* Form */}
          <div className="checkout-form-section">
            <h2>Delivery Address</h2>
            <div className="form-grid">
              <Field name="full_name" label="Full Name *" placeholder="John Doe" half />
              <Field name="phone" label="Phone Number *" placeholder="10-digit number" type="tel" half />
              <Field name="email" label="Email (for confirmation)" placeholder="you@example.com" type="email" />
              <Field name="address_line1" label="House No., Street *" placeholder="House/Flat No., Street" />
              <Field name="address_line2" label="Locality / Area" placeholder="Locality, Area" />
              <Field name="city" label="City *" placeholder="Mumbai" half />
              <Field name="state" label="State *" half as="select" />
              <Field name="pincode" label="Pincode *" placeholder="6-digit pincode" half />
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-review">
            <h3>Order Summary</h3>
            {items.map(item => (
              <div key={item.id} className="order-review-item">
                <img src={item.image || '/placeholder.png'} alt={item.name} className="order-review-img" />
                <span className="order-review-name">{item.name} × {item.quantity}</span>
                <span className="order-review-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #e8eaed', paddingTop: 12, marginTop: 4 }}>
              <div className="summary-row"><span>MRP Total</span><span>₹{totalMrp.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Discount</span><span style={{ color: '#388e3c' }}>− ₹{saving.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Delivery</span><span style={{ color: '#388e3c' }}>FREE</span></div>
              <div className="summary-row total"><span>Order Total</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div>
            </div>
            <button
              className="btn btn-orange btn-full"
              style={{ marginTop: 20, padding: 14, fontSize: 15 }}
              onClick={handlePlaceOrder}
              disabled={loading}
              id="place-order-btn"
            >
              {loading ? 'Placing Order...' : `Place Order — ₹${subtotal.toLocaleString('en-IN')}`}
            </button>
            <p style={{ fontSize: 12, color: '#9aa0a6', textAlign: 'center', marginTop: 10 }}>
              🔒 Safe and Secure Payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
