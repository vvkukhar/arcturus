'use client';

import { useEffect, useState } from 'react';

export function AssignmentPicker() {
  const [users, setUsers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    fetch('/api/collaboration/users').then((r) => r.json()).then(setUsers);
    fetch('/api/admin/inventory').then((r) => r.json()).then(setInventory);
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
        className="w-full bg-black text-white rounded-xl py-2"
        onClick={async () => {
          await fetch('/api/collaboration/assign/inventory', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inventoryItemId: selectedItem,
              userId: selectedUser,
            }),
          });
        }}
      >
        Assign
      </button>
    </div>
  );
}