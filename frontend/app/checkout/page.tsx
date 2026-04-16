'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, ShoppingBag, Shield } from 'lucide-react';
import Link from 'next/link';

interface Address {
  full_name: string; phone: string; email: string;
  address_line1: string; address_line2: string;
  city: string; state: string; pincode: string;
}

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const Field = ({ address, setAddress, errors, name, label, type = 'text', placeholder = '', half = false, as = 'input' }: any) => (
  <div className={`flex flex-col gap-1.5 ${half ? '' : 'md:col-span-2'}`}>
    <label className="text-sm font-semibold text-gray-700" htmlFor={`field-${name}`}>{label}</label>
    {as === 'select' ? (
      <select
        id={`field-${name}`}
        className={`py-3 px-4 border rounded-sm outline-none bg-white text-sm transition-all focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/10 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        value={(address as any)[name]}
        onChange={e => setAddress((a: any) => ({ ...a, [name]: e.target.value }))}
      >
        {STATES.map(s => <option key={s}>{s}</option>)}
      </select>
    ) : (
      <input
        id={`field-${name}`}
        type={type}
        placeholder={placeholder}
        className={`py-3 px-4 border rounded-sm outline-none text-sm transition-all focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/10 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        value={(address as any)[name]}
        onChange={e => setAddress((a: any) => ({ ...a, [name]: e.target.value }))}
      />
    )}
    {errors[name] && <span className="text-red-600 text-[11px] font-medium">{errors[name]}</span>}
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalMrp, saving, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [address, setAddress] = useState<Address>({
    full_name: '', phone: '', email: '',
    address_line1: '', address_line2: '',
    city: '', state: 'Maharashtra', pincode: '',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-32 text-center">
        <div className="bg-white p-12 rounded-sm shadow-sm flex flex-col items-center">
          <ShoppingBag size={80} className="text-gray-100 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nothing to checkout</h2>
          <p className="text-gray-500 mb-8">Add items to your cart to see them here.</p>
          <Link href="/" className="bg-blue-primary text-white px-12 py-3 rounded-sm font-bold shadow-md hover:bg-blue-dark transition-all">Continue Shopping</Link>
        </div>
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
      await fetchCart(); // Clear cart in UI
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 md:py-8 font-sans">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-primary/10 rounded-full shrink-0">
            <MapPin size={18} className="text-blue-primary" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Checkout</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Form Section */}
          <div className="flex-1 bg-white shadow-sm rounded-sm p-6 md:p-8 w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
              Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Field address={address} setAddress={setAddress} errors={errors} name="full_name" label="Full Name *" placeholder="Enter full name" half />
              <Field address={address} setAddress={setAddress} errors={errors} name="phone" label="Phone Number *" placeholder="10-digit mobile number" type="tel" half />
              <Field address={address} setAddress={setAddress} errors={errors} name="email" label="Email Address (Optional)" placeholder="you@example.com" type="email" />
              <Field address={address} setAddress={setAddress} errors={errors} name="address_line1" label="House No., Street, Area *" placeholder="House/Flat No., Street, Landmark" />
              <Field address={address} setAddress={setAddress} errors={errors} name="address_line2" label="Locality / Sector (Optional)" placeholder="Additional location details" />
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <Field address={address} setAddress={setAddress} errors={errors} name="city" label="City *" placeholder="Enter city" />
                <Field address={address} setAddress={setAddress} errors={errors} name="pincode" label="Pincode *" placeholder="6-digit pincode" />
              </div>
              <Field address={address} setAddress={setAddress} errors={errors} name="state" label="State *" as="select" />
            </div>
          </div>

          {/* Order Review Section */}
          <div className="lg:w-[400px] w-full shrink-0 h-fit sticky top-24">
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
              <div className="bg-gray-50/50 p-4 px-6 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Order Summary</h3>
              </div>
              <div className="p-6">
                <div className="max-h-[300px] overflow-y-auto mb-6 pr-1 space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 group">
                      <div className="w-14 h-14 bg-white border border-gray-100 p-1 flex items-center justify-center rounded-sm shrink-0">
                        <img src={item.image || '/placeholder.png'} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <span className="text-sm text-gray-800 line-clamp-1 font-medium mb-1 group-hover:text-blue-primary transition-colors">{item.name}</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Qty: {item.quantity}</span>
                          <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price ({items.length} items)</span>
                    <span className="font-medium text-gray-900">₹{totalMrp.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount</span>
                    <span className="text-green font-bold">- ₹{saving.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charges</span>
                    <span className="text-green font-bold uppercase text-[12px]">Free</span>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-black text-gray-900 tracking-tight">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  className="w-full mt-8 bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-md hover:bg-[#f4511e] transition-all uppercase tracking-wide disabled:bg-gray-300 disabled:shadow-none"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  id="place-order-btn"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                       <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       PLACING ORDER...
                    </span>
                  ) : `PLACE ORDER`}
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-gray-400 font-medium">
                  <Shield size={14} />
                  <span>SAFE AND SECURE PAYMENTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
