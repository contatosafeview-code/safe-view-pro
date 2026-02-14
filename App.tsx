
import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Clients from './screens/Clients';
import NewQuote from './screens/NewQuote';
import WorkDetail from './screens/WorkDetail';
import Reports from './screens/Reports';
import { Client, Work } from './types';
import { INITIAL_CLIENTS, INITIAL_WORKS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName] = useState('Marcelo SafeView');
  
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('safeview_clients_v2');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  
  const [works, setWorks] = useState<Work[]>(() => {
    const saved = localStorage.getItem('safeview_works_v2');
    return saved ? JSON.parse(saved) : INITIAL_WORKS;
  });
  
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [workFilter, setWorkFilter] = useState('Todas');

  useEffect(() => {
    localStorage.setItem('safeview_clients_v2', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('safeview_works_v2', JSON.stringify(works));
  }, [works]);

  const handleAddClient = (newClient: Omit<Client, 'id'>): Client => {
    const c = { ...newClient, id: 'c' + Date.now() } as Client;
    setClients(prev => [...prev, c]);
    return c;
  };

  const handleSaveQuote = (data: any) => {
    const newWork: Work = {
      ...data,
      id: 'w' + Date.now(),
      status: 'Em Orçamento',
      photos: [],
      payments: []
    };
    setWorks(prev => [newWork, ...prev]);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateWork = (updated: Work) => {
    setWorks(prev => prev.map(w => w.id === updated.id ? updated : w));
  };

  const renderContent = () => {
    if (selectedWorkId) {
      const work = works.find(w => w.id === selectedWorkId);
      const client = clients.find(c => c.id === work?.clientId);
      if (work && client) {
        return (
          <WorkDetail 
            work={work} 
            client={client} 
            onUpdateWork={updateWork}
            onBack={() => setSelectedWorkId(null)}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard works={works} clients={clients} onAction={setActiveTab} />;
      case 'clients':
        return (
          <Clients 
            clients={clients} 
            works={works} 
            onAddClient={handleAddClient}
            onSelectClient={(c) => {
              setActiveTab('works');
              setWorkFilter(c.name);
            }}
          />
        );
      case 'new-quote':
        return (
          <NewQuote 
            clients={clients} 
            onSave={handleSaveQuote}
            onCancel={() => setActiveTab('dashboard')}
            onAddClient={handleAddClient}
          />
        );
      case 'works':
        const filteredWorks = works.filter(w => {
          if (workFilter === 'Todas') return true;
          if (['Em Orçamento', 'Agendado', 'Em Execução', 'Concluído', 'Cancelado'].includes(workFilter)) {
            return w.status === workFilter;
          }
          const client = clients.find(c => c.id === w.clientId);
          return client?.name === workFilter;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Obras & Projetos</h2>
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3 py-1 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase mr-3">Filtro:</span>
                <select 
                  value={workFilter}
                  onChange={(e) => setWorkFilter(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer p-2"
                >
                  <option value="Todas">Todas as Obras</option>
                  <option value="Em Orçamento">Em Orçamento</option>
                  <option value="Agendado">Agendados</option>
                  <option value="Em Execução">Em Execução</option>
                  <option value="Concluído">Concluídos</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {filteredWorks.map(work => {
                const client = clients.find(c => c.id === work.clientId);
                return (
                  <button 
                    key={work.id}
                    onClick={() => setSelectedWorkId(work.id)}
                    className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 text-left hover:shadow-md hover:border-blue-100 transition-all active:scale-95"
                  >
                    <div className={`p-4 rounded-2xl transition-colors ${
                      work.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600' : 
                      work.status === 'Em Orçamento' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <ClipboardList size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{work.projectName}</h3>
                      <p className="text-sm text-slate-500 font-medium truncate">{client?.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                          work.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 
                          work.status === 'Em Orçamento' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {work.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{work.scheduleDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">R$ {work.netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-slate-300 font-bold mt-1">Ver Detalhes</div>
                    </div>
                  </button>
                );
              })}
              {filteredWorks.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-400 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                  Nenhuma obra para exibir nesta categoria.
                </div>
              )}
            </div>
          </div>
        );
      case 'reports':
        return <Reports works={works} />;
      default:
        return <Dashboard works={works} clients={clients} onAction={setActiveTab} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(t) => { setSelectedWorkId(null); setActiveTab(t); }} 
      userName={userName}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
