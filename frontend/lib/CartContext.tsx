'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from './api';
import toast from 'react-hot-toast';

interface CartItem {
  id: number; product_id: number; name: string; price: number;
  mrp: number; quantity: number; stock: number; brand: string; image: string;
}
interface CartCtx {
  items: CartItem[];
  count: number;
  loading: boolean;
  addToCart: (productId: number, qty?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQty: (itemId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  subtotal: number;
  totalMrp: number;
  saving: number;
}

const CartContext = createContext<CartCtx>({} as CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.get('/cart');
      setItems(data.items || []);
    } catch {}
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId: number, qty = 1) => {
    try {
      await api.post('/cart', { product_id: productId, quantity: qty });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.success('Removed from cart');
    } catch { toast.error('Failed to remove item'); }
  };

  const updateQty = async (itemId: number, qty: number) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity: qty });
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
    } catch { toast.error('Failed to update quantity'); }
  };

  const clearCart = async () => {
    try { await api.delete('/cart'); setItems([]); } catch {}
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalMrp = items.reduce((s, i) => s + i.mrp * i.quantity, 0);
  const saving = totalMrp - subtotal;
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, loading, addToCart, removeFromCart, updateQty, clearCart, fetchCart, subtotal, totalMrp, saving }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
