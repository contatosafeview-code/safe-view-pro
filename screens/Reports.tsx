
import React from 'react';
import { Work } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface ReportsProps {
  works: Work[];
}

const Reports: React.FC<ReportsProps> = ({ works }) => {
  // Data for Status Chart
  const statusData = [
    { name: 'Orçamento', count: works.filter(w => w.status === 'Em Orçamento').length, color: '#f59e0b' },
    { name: 'Agendado', count: works.filter(w => w.status === 'Agendado').length, color: '#3b82f6' },
    { name: 'Execução', count: works.filter(w => w.status === 'Em Execução').length, color: '#6366f1' },
    { name: 'Concluído', count: works.filter(w => w.status === 'Concluído').length, color: '#22c55e' },
  ];

  // Data for Monthly Faturamento (Simulated for Demo)
  const revenueData = [
    { month: 'Jan', value: 4500 },
    { month: 'Fev', value: 5200 },
    { month: 'Mar', value: 3800 },
    { month: 'Abr', value: 6100 },
    { month: 'Mai', value: works.filter(w => w.status === 'Concluído').reduce((acc, curr) => acc + curr.netValue, 0) },
  ];

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-xl font-bold">Relatórios</h2>

      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Faturamento Mensal (R$)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Total Acumulado:</span>
          <span className="text-xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString('pt-BR')}</span>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Obras por Status</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {statusData.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
              <span className="text-xs font-medium text-gray-600">{s.name}: <span className="font-bold text-gray-900">{s.count}</span></span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reports;
