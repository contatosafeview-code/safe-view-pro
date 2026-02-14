
import React, { useState } from 'react';
import { Client, Work } from '../types';
import { Search, Plus, Phone, MessageCircle, MapPin, ChevronRight, User } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  works: Work[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onSelectClient: (client: Client) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, works, onAddClient, onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Clientes</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white p-2 rounded-lg flex items-center gap-1 text-sm font-semibold active:scale-95 transition-transform"
        >
          <Plus size={18} /> Novo
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou telefone..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredClients.map(client => {
          const clientWorks = works.filter(w => w.clientId === client.id).length;
          return (
            <button 
              key={client.id}
              onClick={() => onSelectClient(client)}
              className="w-full text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 active:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {client.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{client.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Phone size={12} /> {client.phone}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin size={12} /> {client.city}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                  {clientWorks} {clientWorks === 1 ? 'Obra' : 'Obras'}
                </div>
                <ChevronRight size={18} className="text-gray-300 ml-auto mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-lg font-bold mb-4">Adicionar Novo Cliente</h3>
            <AddClientForm 
              onSave={(c) => { onAddClient(c); setIsAdding(false); }} 
              onCancel={() => setIsAdding(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AddClientForm = ({ onSave, onCancel }: { onSave: (c: any) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: ''
  });

  return (
    <div className="space-y-4">
      <Input label="Nome Completo" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
      <Input label="WhatsApp" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
      <Input label="E-mail" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
      <Input label="Endereço" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
      <Input label="Cidade" value={formData.city} onChange={v => setFormData({...formData, city: v})} />
      
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 active:bg-gray-50">Cancelar</button>
        <button 
          onClick={() => onSave(formData)} 
          className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Clients;
