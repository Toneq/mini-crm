import React from 'react';

export default function Summary({ summary }) {
  return (
    <div className="mt-4 p-3 border rounded">
      <h3 className="font-medium">Podsumowanie wszystkich klientów</h3>
      <div className="mt-2">
        Łączna liczba projektów (wszystkich klientów): <strong>{summary.totalProjects}</strong>
      </div>
      <div>
        Łączna wartość w PLN (wszystkich klientów): <strong>{summary.totalValue} PLN</strong>
      </div>
    </div>
  );
}