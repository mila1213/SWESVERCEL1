import { useEffect, useState } from 'react';
import { FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const rawBackend = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').trim().replace(/\/+$/, '');
const BACKEND = rawBackend.endsWith('/api') ? rawBackend : `${rawBackend}/api`;

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND}/admin/stats`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error cargando estadísticas');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Cargando métricas...</div>;
  if (!stats) return <div className="p-6">No hay métricas disponibles.</div>;

  const cards = [
    { id: 'users', title: 'Total usuarios', value: stats.totalUsers, icon: <FiUsers className="w-6 h-6 text-[#00665c]" /> },
    { id: 'products', title: 'Emprendimientos activos', value: stats.totalProducts, icon: <FiPackage className="w-6 h-6 text-[#ff7a59]" /> },
    { id: 'value', title: 'Valor del catálogo', value: `$${stats.totalValue}`, icon: <FiDollarSign className="w-6 h-6 text-[#6b8cff]" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Estadísticas Administrativas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.id} className="p-4 bg-white rounded-2xl shadow-sm border flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-50">{c.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{c.title}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-3">Resumen</h3>
        <div className="max-w-sm mx-auto">
          <Pie
            data={{
              labels: ['Usuarios', 'Emprendimientos', 'Valor'],
              datasets: [
                {
                  label: 'Valores',
                  data: [stats.totalUsers || 0, stats.totalProducts || 0, parseFloat(stats.totalValue) || 0],
                  backgroundColor: ['#00665c', '#ff7a59', '#6b8cff'],
                  borderColor: '#ffffff',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.formattedValue}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}