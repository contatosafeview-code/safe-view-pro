
import React, { useState, useMemo } from 'react';
import { Client, Measurement } from '../types';
import { AREA_TYPES, DEFAULT_PRICE_PER_M2, DEFAULT_COST_PER_M2 } from '../constants';
import { ChevronLeft, Plus, Trash2, Check, Calculator, Info, Ruler, DollarSign, Search, UserPlus, X, Layers } from 'lucide-react';

interface NewQuoteProps {
  clients: Client[];
  onSave: (quoteData: any) => void;
  onCancel: () => void;
  onAddClient: (client: Omit<Client, 'id'>) => Client;
}

const NewQuote: React.FC<NewQuoteProps> = ({ clients, onSave, onCancel, onAddClient }) => {
  const [step, setStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);
  
  const [newClientData, setNewClientData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    email: ''
  });

  const [pricePerM2, setPricePerM2] = useState(DEFAULT_PRICE_PER_M2);
  const [projectData, setProjectData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    obs: ''
  });
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [discount, setDiscount] = useState(0);

  const filteredClients = useMemo(() => 
    clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)),
    [clients, searchTerm]
  );

  const totalValue = useMemo(() => measurements.reduce((acc, m) => acc + m.price, 0), [measurements]);
  const totalArea = useMemo(() => measurements.reduce((acc, m) => acc + m.area, 0), [measurements]);
  const netValue = useMemo(() => totalValue * (1 - (discount / 100)), [totalValue, discount]);

  // Agrupamento por categoria (soma de item por item)
  const categorySummary = useMemo(() => {
    const summary: Record<string, { area: number, price: number, count: number }> = {};
    measurements.forEach(m => {
      if (!summary[m.type]) {
        summary[m.type] = { area: 0, price: 0, count: 0 };
      }
      summary[m.type].area += m.area;
      summary[m.type].price += m.price;
      summary[m.type].count += 1;
    });
    return summary;
  }, [measurements]);

  const handleQuickAddClient = () => {
    if (!newClientData.name || !newClientData.phone) {
      alert("Nome e Telefone são obrigatórios.");
      return;
    }
    const created = onAddClient(newClientData);
    setSelectedClientId(created.id);
    setIsAddingNewClient(false);
    setStep(2);
  };

  const addMeasurement = () => {
    const newM: Measurement = {
      id: Math.random().toString(36).substr(2, 9),
      type: AREA_TYPES[0],
      width: 0,
      height: 0,
      area: 0,
      cost: 0,
      price: 0
    };
    setMeasurements([...measurements, newM]);
  };

  const updateMeasurement = (id: string, field: keyof Measurement, value: any) => {
    setMeasurements(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, [field]: value };
      
      if (field === 'width' || field === 'height' || field === 'type') {
        const w = field === 'width' ? parseFloat(value) : updated.width;
        const h = field === 'height' ? parseFloat(value) : updated.height;
        updated.area = (w || 0) * (h || 0);
        updated.cost = updated.area * DEFAULT_COST_PER_M2;
        updated.price = updated.area * pricePerM2;
      }
      
      return updated;
    }));
  };

  const handlePricePerM2Change = (newPrice: number) => {
    setPricePerM2(newPrice);
    setMeasurements(prev => prev.map(m => ({
      ...m,
      price: m.area * newPrice
    })));
  };

  const removeMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const handleSave = () => {
    if (!selectedClientId || !projectData.name) {
      alert("Por favor preencha todos os campos obrigatórios");
      return;
    }
    if (measurements.length === 0) {
      alert("Adicione pelo menos uma medição ao orçamento");
      return;
    }
    onSave({
      clientId: selectedClientId,
      projectName: projectData.name,
      scheduleDate: projectData.date,
      observations: projectData.obs,
      measurements,
      totalValue,
      discount,
      netValue
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="p-2 text-gray-500"><ChevronLeft /></button>
        <h2 className="text-xl font-bold">Novo Orçamento</h2>
        <div className="w-10"></div>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 px-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > s ? <Check size={16} /> : s}
            </div>
            <div className="h-1 w-full mt-2 relative">
               <div className={`absolute inset-0 rounded-full bg-gray-200`}></div>
               {step >= s && <div className={`absolute inset-0 rounded-full bg-blue-600 transition-all duration-300`} style={{ width: step > s ? '100%' : '50%' }}></div>}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">1. Selecionar Cliente</h3>
            {!isAddingNewClient && (
              <button 
                onClick={() => setIsAddingNewClient(true)}
                className="text-blue-600 text-sm font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
              >
                <UserPlus size={16} /> Novo Cliente
              </button>
            )}
          </div>

          {isAddingNewClient ? (
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-blue-900 uppercase">Dados do Novo Cliente</h4>
                <button onClick={() => setIsAddingNewClient(false)} className="text-slate-400"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Nome do Cliente" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClientData.name}
                  onChange={e => setNewClientData({...newClientData, name: e.target.value})}
                />
                <input 
                  type="text" placeholder="WhatsApp" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClientData.phone}
                  onChange={e => setNewClientData({...newClientData, phone: e.target.value})}
                />
                <input 
                  type="text" placeholder="Cidade" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newClientData.city}
                  onChange={e => setNewClientData({...newClientData, city: e.target.value})}
                />
              </div>
              <button 
                onClick={handleQuickAddClient}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
              >
                Cadastrar e Continuar
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredClients.length > 0 ? filteredClients.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedClientId(c.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedClientId === c.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}
                  >
                    <div className="font-bold">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.city} • {c.phone}</div>
                  </button>
                )) : (
                  <p className="text-center py-10 text-gray-400">Nenhum cliente encontrado.</p>
                )}
              </div>
              
              <button 
                disabled={!selectedClientId}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 disabled:opacity-50 mt-4 active:scale-95 transition-transform"
              >
                Continuar
              </button>
            </>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right">
          <h3 className="text-lg font-bold">2. Configuração do Projeto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Nome da Obra</label>
              <input 
                type="text" 
                placeholder="Ex: Sacada e Janelas - Marcelo"
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={projectData.name}
                onChange={e => setProjectData({...projectData, name: e.target.value})}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
               <div className="flex items-center gap-2 mb-2">
                 <Info size={16} className="text-blue-600" />
                 <label className="text-xs font-bold text-blue-900 uppercase">Preço p/ m² Base</label>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-lg font-bold text-blue-600">R$</span>
                 <input 
                  type="number" 
                  className="flex-1 p-2 bg-white border border-blue-200 rounded-lg font-bold text-lg text-blue-700 outline-none focus:ring-2 focus:ring-blue-500"
                  value={pricePerM2}
                  onChange={e => handlePricePerM2Change(parseFloat(e.target.value) || 0)}
                />
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Data do Orçamento</label>
              <input 
                type="date" 
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none"
                value={projectData.date}
                onChange={e => setProjectData({...projectData, date: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setStep(1)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 active:bg-gray-50">Voltar</button>
            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold active:bg-blue-700">Adicionar Itens</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in slide-in-from-right relative">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">3. Calcular Itens (Medições)</h3>
            <button onClick={addMeasurement} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-transform">
              <Plus size={18} /> Novo Item
            </button>
          </div>

          <div className="space-y-4">
            {measurements.map((m, idx) => (
              <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Item {idx + 1}</span>
                  <button onClick={() => removeMeasurement(m.id)} className="text-red-500 p-1 active:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Local da Instalação</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold"
                      value={m.type}
                      onChange={e => updateMeasurement(m.id, 'type', e.target.value)}
                    >
                      {AREA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Largura (m)</label>
                    <input 
                      type="number" step="0.01"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-bold"
                      value={m.width || ''}
                      placeholder="0,00"
                      onChange={e => updateMeasurement(m.id, 'width', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Altura (m)</label>
                    <input 
                      type="number" step="0.01"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-bold"
                      value={m.height || ''}
                      placeholder="0,00"
                      onChange={e => updateMeasurement(m.id, 'height', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100">
                    <div className="flex items-center gap-2">
                       <Ruler size={14} className="text-gray-400" />
                       <span className="text-sm font-bold text-gray-700">{m.area.toFixed(2)} m²</span>
                    </div>
                    <div className="font-bold text-green-600">R$ {m.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
              </div>
            ))}

            {measurements.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 bg-white">
                <Calculator size={48} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">Toque em "Novo Item" para<br/>começar os cálculos da obra.</p>
              </div>
            )}
          </div>

          {/* Running Total Bar */}
          {measurements.length > 0 && (
            <div className="fixed bottom-20 left-4 right-4 bg-white border border-gray-200 p-4 rounded-2xl shadow-2xl flex justify-between items-center z-40 max-w-lg mx-auto">
               <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Total Parcial ({measurements.length} itens)</div>
                  <div className="text-lg font-bold text-gray-900">{totalArea.toFixed(2)} m²</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Valor Total</div>
                  <div className="text-xl font-black text-blue-600">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
               </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={() => setStep(2)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 active:bg-gray-50">Voltar</button>
            <button onClick={() => setStep(4)} disabled={measurements.length === 0} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-blue-200">Ver Resumo Final</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 animate-in slide-in-from-right">
          <h3 className="text-lg font-bold">4. Resumo Final do Orçamento</h3>
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-medium">Quantidade de Itens:</span>
                <span className="font-bold text-gray-900">{measurements.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-medium">Área Total da Obra:</span>
                <span className="font-bold text-gray-900">{totalArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-medium">Valor Bruto:</span>
                <span className="font-bold text-gray-900">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* SOMA ITEM POR ITEM - POR CATEGORIA */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2">
                 <Layers size={16} className="text-blue-600" />
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo por Categoria</h4>
               </div>
               {/* Fixed type error by explicitly casting Object.entries to have typed values */}
               {(Object.entries(categorySummary) as [string, { area: number; price: number; count: number }][]).map(([type, data]) => (
                 <div key={type} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{type} ({data.count}x):</span>
                    <span className="font-black text-slate-900">R$ {data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                 </div>
               ))}
            </div>

            <div className="flex justify-between items-center text-sm bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="text-blue-700 font-bold">Desconto (%):</span>
              <input 
                type="number" 
                className="w-20 p-2 bg-white border border-blue-200 rounded-lg text-right font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                value={discount}
                onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <div className="text-lg font-black text-gray-900 uppercase tracking-tighter">Preço Final:</div>
              <div className="text-2xl font-black text-green-600">R$ {netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="space-y-2">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Detalhamento para Conferência</h4>
             <div className="space-y-2">
                {measurements.map(m => (
                  <div key={m.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100 text-xs shadow-sm">
                    <div>
                      <span className="font-bold text-gray-800">{m.type}</span>
                      <p className="text-gray-500 mt-1">{m.width}m x {m.height}m • {m.area.toFixed(2)} m²</p>
                    </div>
                    <span className="font-black text-blue-600">R$ {m.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button onClick={() => setStep(3)} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 active:bg-gray-50">Ajustar Itens</button>
            <button 
              onClick={handleSave} 
              className="flex-2 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-200 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Check size={24} /> SALVAR ORÇAMENTO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewQuote;
