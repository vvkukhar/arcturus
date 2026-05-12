'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/client-api';
import type { User, InventoryItem } from '@/lib/types';
import { Loader2, UserPlus } from 'lucide-react';

export function AssignmentPicker() {
  const { data: rawUsers } = useSWR<User[]>('/api/collaboration/users', swrFetcher);
  const { data: rawInventory, mutate } = useSWR<InventoryItem[]>('/api/admin/inventory', swrFetcher);

  const users = Array.isArray(rawUsers) ? rawUsers : [];
  const inventory = Array.isArray(rawInventory) ? rawInventory : [];

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedItem || !selectedUser || loading) return;
    try {
      setLoading(true);
      await apiFetch('/api/collaboration/assign/inventory', {
        method: 'PATCH',
        body: JSON.stringify({
          inventoryItemId: selectedItem,
          userId: selectedUser,
        }),
      });
      setSelectedItem('');
      await mutate();
    } catch (e) {
      console.error('Assignment failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-[var(--border)] p-6 bg-[var(--card)] shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus size={20} className="text-blue-600" />
        <h3 className="font-black text-xl text-[var(--foreground)]">Smart Assign</h3>
      </div>

      <div className="space-y-3">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--background)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 text-[var(--foreground)] cursor-pointer"
        >
          <option value="" disabled>Select Operator</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--background)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 text-[var(--foreground)] cursor-pointer"
        >
          <option value="" disabled>Select Inventory Item</option>
          {inventory.map((i) => (
            <option key={i.id} value={i.id}>
              {i.titleSnapshot}
            </option>
          ))}
        </select>

        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold rounded-xl py-3.5 disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
          disabled={!selectedItem || !selectedUser || loading}
          onClick={handleAssign}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Assign Task
        </button>
      </div>
    </div>
  );
}