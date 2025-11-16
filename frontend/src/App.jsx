import React, { useEffect, useState } from 'react';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails';
import Summary from './components/Summary';
import API from './api';

export default function App() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState({ totalProjects: 0, totalValue: 0 });

  async function loadClients() {
    const res = await API.get('/clients');
    setClients(res.data);
    if (selected) {
      const refreshed = await API.get(`/clients/${selected.id}`);
      setSelected(refreshed.data);
    }
  }

  async function loadSummary() {
    const res = await API.get('/summary');
    setSummary(res.data);
  }

  const refreshData = async () => {
    await loadClients();
    await loadSummary();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mini CRM</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <ClientList clients={clients} onCreate={refreshData} onSelect={c => setSelected(c)} />
        </div>
        <div className="col-span-2 bg-white p-4 rounded shadow">
          {selected ? (
            <ClientDetails
              client={selected}
              onUpdated={refreshData}
              onSummaryUpdated={loadSummary}
            />
          ) : (
            <div>Wybierz klienta, aby zobaczyć szczegóły.</div>
          )}
          <div className="mt-6">
            <Summary summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
