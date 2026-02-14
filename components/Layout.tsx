
import React from 'react';
import { Home, Users, ClipboardList, BarChart3, PlusCircle, LogOut, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userName }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-200">S</div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">SafeView <span className="text-blue-600">Pro</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarButton 
            icon={<Home size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarButton 
            icon={<Users size={20} />} 
            label="Clientes" 
            active={activeTab === 'clients'} 
            onClick={() => setActiveTab('clients')} 
          />
          <SidebarButton 
            icon={<PlusCircle size={20} />} 
            label="Novo Orçamento" 
            active={activeTab === 'new-quote'} 
            onClick={() => setActiveTab('new-quote')} 
          />
          <SidebarButton 
            icon={<ClipboardList size={20} />} 
            label="Obras & Projetos" 
            active={activeTab === 'works'} 
            onClick={() => setActiveTab('works')} 
          />
          <SidebarButton 
            icon={<BarChart3 size={20} />} 
            label="Relatórios" 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-3 space-x-3 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER (MOBILE ONLY) */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
              <h1 className="text-lg font-bold text-slate-900">SafeView <span className="text-blue-600">Pro</span></h1>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Settings size={18} />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>

        {/* BOTTOM NAV (MOBILE ONLY) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-bottom z-40">
          <div className="flex justify-around items-center h-16">
            <NavButton 
              icon={<Home size={22} />} 
              label="Home" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <NavButton 
              icon={<Users size={22} />} 
              label="Clientes" 
              active={activeTab === 'clients'} 
              onClick={() => setActiveTab('clients')} 
            />
            <button 
              onClick={() => setActiveTab('new-quote')}
              className="flex flex-col items-center justify-center -mt-8"
            >
              <div className="bg-blue-600 text-white p-3.5 rounded-full shadow-xl shadow-blue-200 active:scale-95 transition-all border-4 border-slate-50">
                <PlusCircle size={24} />
              </div>
            </button>
            <NavButton 
              icon={<ClipboardList size={22} />} 
              label="Obras" 
              active={activeTab === 'works'} 
              onClick={() => setActiveTab('works')} 
            />
            <NavButton 
              icon={<BarChart3 size={22} />} 
              label="Relatórios" 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')} 
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
      active 
        ? 'bg-blue-50 text-blue-600 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const NavButton = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-bold">{label}</span>
  </button>
);

export default Layout;
