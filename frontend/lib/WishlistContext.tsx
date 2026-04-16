'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from './api';
import toast from 'react-hot-toast';

interface WishlistCtx {
  wishlistIds: Set<number>;
  toggle: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  items: any[];
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistCtx>({} as WishlistCtx);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());

  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await api.get('/wishlist');
      setItems(data.items || []);
      setWishlistIds(new Set((data.items || []).map((i: any) => i.product_id)));
    } catch {}
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (productId: number) => {
    if (wishlistIds.has(productId)) {
      try {
        await api.delete(`/wishlist/${productId}`);
        setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
        setItems(prev => prev.filter(i => i.product_id !== productId));
        toast.success('Removed from wishlist');
      } catch { toast.error('Failed'); }
    } else {
      try {
        await api.post('/wishlist', { product_id: productId });
        setWishlistIds(prev => new Set([...prev, productId]));
        await fetchWishlist();
        toast.success('Added to wishlist!');
      } catch { toast.error('Failed'); }
    }
  };

  const isWishlisted = (productId: number) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, isWishlisted, items, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
