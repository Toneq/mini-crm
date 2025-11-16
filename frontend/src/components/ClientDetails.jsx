import React, { useState, useEffect } from 'react';
import API from '../api';

export default function ClientDetails({ client, onUpdated, onSummaryUpdated  }) {
  const [projName, setProjName] = useState('');
  const [status, setStatus] = useState('open');
  const [value, setValue] = useState('0');
  const [projects, setProjects] = useState([]);

  async function loadProjects(id) {
    const res = await API.get(`/clients/${id}/projects`);
    setProjects(res.data);
  }

  useEffect(() => {
    if (client?.id) {
      loadProjects(client.id);
    }
  }, [client]);

  async function addProject(e) {
    e.preventDefault();
    const v = Number(value);
    if (!projName || isNaN(v)) return;
    await API.post(`/clients/${client.id}/projects`, { name: projName, status, value: v });
    setProjName(''); setValue('0'); setStatus('open');
    await onUpdated(client.id);
    onSummaryUpdated();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">{client.name}</h2>
      <div className="text-sm text-slate-600">
        {client.email} · Pozyskany: {client.acquiredAt}
      </div>

      <h3 className="mt-4 font-medium">Projekty</h3>
      <ul className="mt-2 space-y-2">
        {projects.map(p => (
          <li key={p.id} className="p-2 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-slate-500">{p.status}</div>
              </div>
              <div className="font-semibold">{p.value} PLN</div>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addProject} className="mt-4">
        <h4 className="font-medium">Dodaj projekt</h4>
        <input
          value={projName}
          onChange={e => setProjName(e.target.value)}
          placeholder="Nazwa projektu"
          className="w-full p-2 border rounded mt-2"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        >
          <option value="open">open</option>
          <option value="in progress">in progress</option>
          <option value="done">done</option>
        </select>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Wartość (PLN)"
          type="number"
          className="w-full p-2 border rounded mt-2"
        />
        <button className="mt-2 px-3 py-2 bg-green-600 text-white rounded">
          Dodaj projekt
        </button>
      </form>
    </div>
  );
}
