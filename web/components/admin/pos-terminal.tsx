'use client';

import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, CreditCard, Banknote, Bitcoin, Trash2, Loader2, ScanBarcode } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useToast } from '@/components/ui/toast-provider';
import Image from 'next/image';

interface PosCartItem {
  inventoryItemId: string;
  title: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
  setNumber?: string;
}

export function PosTerminal() {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const handleCheckout = async (method: 'cash' | 'card' | 'crypto') => {
    if (cart.length === 0 || isProcessing) return;

    try {
      setIsProcessing(true);
      await apiFetch('/api/proxy/pos/checkout', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(i => ({ inventoryItemId: i.inventoryItemId, quantity: i.quantity, price: i.price })),
          paymentMethod: method
        })
      });
      
      push({ title: 'Success', message: 'Transaction completed successfully.' });
      setCart([]);
    } catch (err: any) {
      push({ title: 'Checkout Failed', message: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.target !== barcodeInputRef.current) return;
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        handleCheckout('card');
      }
      
      if (e.altKey && e.code === 'KeyM') {
        e.preventDefault();
        handleCheckout('cash');
      }

      if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
        if (barcodeInputRef.current && document.activeElement !== barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [cart, isProcessing]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcode.trim();
    if (!code || isScanning) return;

    try {
      setIsScanning(true);
      const item = await apiFetch<any>('/api/proxy/pos/scan', {
        method: 'POST',
        body: JSON.stringify({ barcode: code })
      });

      setCart(prev => {
        const existing = prev.find(i => i.inventoryItemId === item.id);
        if (existing) {
          if (existing.quantity >= item.quantity) {
            push({ title: 'Stock Limit', message: `Only ${item.quantity} available in stock.` });
            return prev;
          }
          return prev.map(i => i.inventoryItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, {
          inventoryItemId: item.id,
          title: item.titleSnapshot,
          price: item.expectedSalePriceManual ?? item.totalCost,
          quantity: 1,
          maxQuantity: item.quantity,
          imageUrl: item.images?.[0]?.imageUrl,
          setNumber: item.item?.setNumber,
        }];
      });
      setBarcode('');
    } catch (err: any) {
      push({ title: 'Scan Error', message: err.message || 'Item not found in active inventory.' });
    } finally {
      setIsScanning(false);
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.inventoryItemId === id) {
        const newQty = Math.max(1, Math.min(i.maxQuantity, i.quantity + delta));
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.inventoryItemId !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
          <form onSubmit={handleScan} className="relative">
            <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
            <input
              ref={barcodeInputRef}
              autoFocus
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              placeholder="Scan barcode or enter set number..."
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-xl font-black outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--foreground)]"
              disabled={isScanning}
            />
            {isScanning && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 animate-spin text-blue-500" />}
          </form>
        </div>

        <div className="flex-1 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--background)]/50">
            <h2 className="font-black text-lg text-[var(--foreground)]">Current Order</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <ShoppingCart size={48} className="mb-4 opacity-50" />
                <p className="font-bold">Cart is empty</p>
                <p className="text-sm">Scan an item to begin</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.inventoryItemId} className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] group">
                  <div className="h-16 w-16 relative rounded-xl overflow-hidden bg-white border border-[var(--border)] shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="" fill className="object-contain p-1 mix-blend-multiply" />
                    ) : (
                      <div className="w-full h-full bg-slate-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[var(--foreground)] truncate text-lg">{item.title}</div>
                    <div className="text-sm font-bold text-slate-500">#{item.setNumber || item.inventoryItemId.slice(0,6)}</div>
                  </div>
                  <div className="flex items-center gap-3 bg-[var(--card)] rounded-xl border border-[var(--border)] p-1">
                    <button onClick={() => updateQty(item.inventoryItemId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background)] rounded-lg font-black text-slate-600">-</button>
                    <span className="w-6 text-center font-black">{item.quantity}</span>
                    <button onClick={() => updateQty(item.inventoryItemId, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background)] rounded-lg font-black text-slate-600">+</button>
                  </div>
                  <div className="w-32 text-right">
                    <div className="font-black text-xl text-[var(--foreground)]">{formatMoney(item.price * item.quantity)}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.inventoryItemId)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-96 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm flex flex-col p-6">
        <h2 className="font-black text-2xl mb-6">Summary</h2>
        
        <div className="space-y-4 mb-8 flex-1">
          <div className="flex justify-between items-center text-slate-500 font-bold">
            <span>Items</span>
            <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="w-full h-px bg-[var(--border)]" />
          <div className="flex justify-between items-end">
            <span className="text-sm font-black uppercase tracking-widest text-slate-400">Total Due</span>
            <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{formatMoney(total)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => handleCheckout('card')}
            className="w-full h-16 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard />} 
            Terminal (Card)
            <kbd className="hidden sm:inline-block ml-2 px-2 py-1 bg-black/20 rounded text-[10px] font-mono group-hover:bg-black/30">Alt + C</kbd>
          </button>
          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => handleCheckout('cash')}
            className="w-full h-16 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Banknote />} 
            Cash
            <kbd className="hidden sm:inline-block ml-2 px-2 py-1 bg-black/20 rounded text-[10px] font-mono group-hover:bg-black/30">Alt + M</kbd>
          </button>
          <button 
            disabled={cart.length === 0 || isProcessing}
            onClick={() => handleCheckout('crypto')}
            className="w-full h-16 flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-2xl font-black text-lg disabled:opacity-50 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Bitcoin />} Crypto Pay
          </button>
        </div>
      </div>
    </div>
  );
}