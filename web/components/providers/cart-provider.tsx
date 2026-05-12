'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/lib/store/cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const _hasHydrated = useCart((state) => state._hasHydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !_hasHydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}