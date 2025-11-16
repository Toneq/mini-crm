import React, { useState } from 'react';
import API from '../api';

export default function ClientList({ clients, onCreate, onSelect }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    if (!name || !email) return;
    await API.post('/clients', { name, email });
    setName(''); setEmail('');
    onCreate();
  }

  return (
    <div>
      <h2 className="font-semibold mb-2">Klienci</h2>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {clients.map(c => (
          <li key={c.id} className="p-2 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(c)}>
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-slate-500">{c.email}</div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate} className="mt-4">
        <h3 className="font-medium">Dodaj klienta</h3>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nazwa" className="w-full p-2 border rounded mt-2" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mt-2" />
        <button className="mt-2 px-3 py-2 bg-sky-600 text-white rounded">Dodaj</button>
      </form>
    </div>
  );
}
