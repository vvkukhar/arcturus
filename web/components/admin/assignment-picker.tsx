'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

export function AssignmentPicker() {
  const [users, setUsers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([
      apiFetch<any[]>('/api/collaboration/users'),
      apiFetch<any[]>('/api/admin/inventory')
    ]).then(([usersData, inventoryData]) => {
      if (mounted) {
        setUsers(Array.isArray(usersData) ? usersData : []);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      }
    }).catch(() => {
      if (mounted) {
        setUsers([]);
        setInventory([]);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border p-5 bg-white space-y-3">
      <div className="font-black text-lg">Assign (Smart)</div>

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full border rounded-xl px-3 py-2"
      >
        <option value="">User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)}
        className="w-full border rounded-xl px-3 py-2"
      >
        <option value="">Inventory</option>
        {inventory.map((i) => (
          <option key={i.id} value={i.id}>
            {i.titleSnapshot}
          </option>
        ))}
      </select>

      <button
        className="w-full bg-black text-white rounded-xl py-2 disabled:opacity-50"
        disabled={!selectedItem || !selectedUser}
        onClick={async () => {
          try {
            await apiFetch('/api/collaboration/assign/inventory', {
              method: 'PATCH',
              body: JSON.stringify({
                inventoryItemId: selectedItem,
                userId: selectedUser,
              }),
            });
            setSelectedItem('');
          } catch (e) {
            console.error('Assignment failed', e);
          }
        }}
      >
        Assign
      </button>
    </div>
  );
}