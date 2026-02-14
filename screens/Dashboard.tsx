
import React from 'react';
import { Work, Client } from '../types';
// Fix: Added BarChart3 to the imports from lucide-react
import { ClipboardCheck, Calendar, CheckCircle2, DollarSign, ArrowRight, UserPlus, FilePlus, Eye, BarChart3 } from 'lucide-react';

interface DashboardProps {
  works: Work[];
  clients: Client[];
  onAction: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ works, clients, onAction }) => {
  const pendingQuotes = works.filter(w => w.status === 'Em Orçamento').length;
  const scheduledWorks = works.filter(w => w.status === 'Agendado' || w.status === 'Em Execução').length;
  const completedWorks = works.filter(w => w.status === 'Concluído').length;
  
  const monthlyRevenue = works
    .filter(w => w.status === 'Concluído')
    .reduce((acc, curr) => acc + curr.netValue, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Painel SafeView</h2>
          <p className="text-slate-500 font-medium">Bom trabalho hoje, equipe!</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onAction('new-quote')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
            <FilePlus size={20} /> <span className="hidden sm:inline">Novo Orçamento</span>
          </button>
        </div>
      </header>

      {/* STATS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<ClipboardCheck className="text-amber-500" />} 
          label="Em Orçamento" 
          value={pendingQuotes} 
          bg="bg-amber-50"
        />
        <StatCard 
          icon={<Calendar className="text-blue-500" />} 
          label="Obras Ativas" 
          value={scheduledWorks} 
          bg="bg-blue-50"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          label="Concluídas" 
          value={completedWorks} 
          bg="bg-emerald-50"
        />
        <StatCard 
          icon={<DollarSign className="text-blue-600" />} 
          label="Receita Mensal" 
          value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} 
          bg="bg-slate-100"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* RECENT WORKS - 2/3 space on Desktop */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Obras Recentes</h3>
            <button onClick={() => onAction('works')} className="text-sm text-blue-600 font-bold hover:underline">Ver tudo</button>
          </div>
          <div className="space-y-3">
            {works.slice(0, 5).map(work => (
              <div key={work.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    work.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <ClipboardCheck size={24} />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-slate-900 truncate">{work.projectName}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{work.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-slate-900">R$ {work.netValue.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{work.scheduleDate}</p>
                  </div>
                  <ArrowRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS - 1/3 space on Desktop */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Atalhos</h3>
          <div className="grid grid-cols-1 gap-3">
            <ShortcutButton 
              label="Gestão de Clientes" 
              onClick={() => onAction('clients')}
              icon={<UsersIcon />}
              color="blue"
            />
            <ShortcutButton 
              label="Analisar Relatórios" 
              onClick={() => onAction('reports')}
              icon={<BarChart3 size={24} />}
              color="indigo"
            />
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
               <h4 className="font-black text-lg mb-1">Dica Pro</h4>
               <p className="text-blue-100 text-sm leading-relaxed mb-4">Lembre-se de registrar fotos do "Antes" e "Depois" para aumentar a confiança dos seus clientes.</p>
               <button onClick={() => onAction('works')} className="bg-white text-blue-600 w-full py-2 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">Ver Minhas Obras</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }: any) => (
  <div className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between`}>
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
    <div>
      <div className="text-xl md:text-2xl font-black text-slate-900 truncate">{value}</div>
      <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">{label}</div>
    </div>
  </div>
);

const ShortcutButton = ({ label, onClick, icon, color }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md active:bg-slate-50 transition-all w-full group"
  >
    <div className={`bg-${color}-50 text-${color}-600 p-3 rounded-xl transition-colors group-hover:bg-${color}-100`}>
      {icon}
    </div>
    <span className="flex-1 font-bold text-slate-700">{label}</span>
    <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
  </button>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default Dashboard;
