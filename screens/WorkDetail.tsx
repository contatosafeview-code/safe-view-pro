
import React, { useState, useMemo } from 'react';
import { Work, Client, WorkStatus } from '../types';
import { ChevronLeft, Phone, MessageCircle, MapPin, Camera, Image, FileText, CheckCircle2, DollarSign, Ruler, Receipt, Copy, Share2, Download } from 'lucide-react';
import { generateBudgetProposal, generateInvoice } from '../services/geminiService';

interface WorkDetailProps {
  work: Work;
  client: Client;
  onUpdateWork: (updatedWork: Work) => void;
  onBack: () => void;
}

const WorkDetail: React.FC<WorkDetailProps> = ({ work, client, onUpdateWork, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [resultType, setResultType] = useState<'proposal' | 'invoice' | null>(null);

  const totalArea = useMemo(() => work.measurements.reduce((acc, m) => acc + m.area, 0), [work.measurements]);
  const averagePricePerM2 = totalArea > 0 ? work.totalValue / totalArea : 0;

  const handleStatusChange = (newStatus: WorkStatus) => {
    onUpdateWork({ ...work, status: newStatus });
  };

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    setResultType('proposal');
    const text = await generateBudgetProposal(work, client);
    setResultText(text);
    setIsGenerating(false);
  };

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    setResultType('invoice');
    const text = await generateInvoice(work, client);
    setResultText(text);
    setIsGenerating(false);
  };

  const handleAddPhoto = () => {
    const newPhoto = {
      id: Math.random().toString(36),
      url: `https://picsum.photos/seed/${Math.random()}/400/300`,
      description: 'Foto da Instalação',
      timestamp: new Date().toISOString()
    };
    onUpdateWork({ ...work, photos: [...work.photos, newPhoto] });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    alert("Copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"><ChevronLeft /></button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black text-slate-900 truncate tracking-tight">{work.projectName}</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Detalhes da Obra</p>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 -mr-10 -mt-10 ${work.status === 'Concluído' ? 'text-green-600' : 'text-blue-600'}`}>
           <CheckCircle2 size={128} />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            work.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' :
            work.status === 'Agendado' ? 'bg-blue-100 text-blue-700' :
            work.status === 'Cancelado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {work.status}
          </div>
          <div className="text-right">
             <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Valor Final</div>
             <div className="text-2xl font-black text-emerald-600">R$ {work.netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-50 relative z-10">
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100"><Ruler size={18} /></div>
             <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Área Total</div>
               <div className="text-base font-bold text-slate-800">{totalArea.toFixed(2)} m²</div>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100"><DollarSign size={18} /></div>
             <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Preço p/ m²</div>
               <div className="text-base font-bold text-blue-600">R$ {averagePricePerM2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
             </div>
           </div>
        </div>

        <div className="pt-5 border-t border-slate-50 space-y-4 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100"><MapPin size={20} /></div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-slate-900 text-sm truncate">{client.name}</div>
              <div className="text-xs text-slate-500 font-medium truncate">{client.address}, {client.city}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <a href={`tel:${client.phone}`} className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 active:bg-slate-100 transition-all">
              <Phone size={16} /> LIGAR
            </a>
            <a href={`https://wa.me/${client.phone}`} className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-black text-emerald-600 active:bg-emerald-100 transition-all">
              <MessageCircle size={16} /> WHATSAPP
            </a>
          </div>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ActionButton 
          icon={<FileText size={24} />} 
          label="Proposta" 
          color="blue" 
          onClick={handleGenerateProposal} 
          disabled={isGenerating}
        />
        <ActionButton 
          icon={<Receipt size={24} />} 
          label="Nota Fiscal" 
          color="emerald" 
          onClick={handleGenerateInvoice} 
          disabled={isGenerating || work.status !== 'Concluído'}
          badge={work.status !== 'Concluído' ? "Fechar Obra" : undefined}
        />
        <ActionButton 
          icon={<Camera size={24} />} 
          label="Foto" 
          color="amber" 
          onClick={handleAddPhoto} 
        />
        <ActionButton 
          icon={<Share2 size={24} />} 
          label="Compartilhar" 
          color="indigo" 
          onClick={() => alert("Função de compartilhamento em desenvolvimento.")}
        />
      </div>

      {/* Result Display Section (Proposal or Invoice) */}
      {resultText && (
        <div className={`rounded-3xl border p-6 shadow-xl space-y-4 animate-in slide-in-from-top duration-500 bg-white ${resultType === 'invoice' ? 'border-emerald-200' : 'border-blue-200'}`}>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2">
               <div className={`p-2 rounded-xl ${resultType === 'invoice' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                 {resultType === 'invoice' ? <Receipt size={20} /> : <FileText size={20} />}
               </div>
               <h3 className={`font-black uppercase tracking-tight text-sm ${resultType === 'invoice' ? 'text-emerald-900' : 'text-blue-900'}`}>
                 {resultType === 'invoice' ? 'Nota Fiscal Digital' : 'Proposta Comercial IA'}
               </h3>
             </div>
             <button onClick={() => setResultText('')} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft className="rotate-90" size={20} /></button>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 font-mono text-[11px] leading-relaxed text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-blue-600 animate-pulse uppercase tracking-widest text-[10px]">Gerando documento profissional...</p>
              </div>
            ) : resultText}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs transition-all active:scale-95 ${resultType === 'invoice' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}
            >
              <Copy size={16} /> COPIAR TEXTO
            </button>
            <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Status Transition Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Gestão do Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {['Agendado', 'Em Execução', 'Concluído', 'Cancelado'].map((s) => (
            <button 
              key={s}
              onClick={() => handleStatusChange(s as WorkStatus)}
              className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                work.status === s 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-[1.02]' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Arquivo Fotográfico</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{work.photos.length} registros</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {work.photos.length > 0 ? (
            work.photos.map(p => (
              <div key={p.id} className="aspect-square bg-slate-200 rounded-3xl overflow-hidden relative shadow-sm border-2 border-white group cursor-pointer hover:shadow-md transition-all">
                <img src={p.url} alt={p.description} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                   <p className="text-[8px] text-white font-bold truncate">{p.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300">
              <Image size={48} strokeWidth={1} className="mb-4 opacity-30" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nenhuma imagem registrada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, color, onClick, disabled, badge }: any) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-50',
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center gap-3 p-5 border rounded-[2rem] shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:grayscale ${colorMap[color] || 'bg-slate-50'}`}
    >
      {badge && (
        <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md z-10 animate-bounce">
          {badge}
        </span>
      )}
      <div className="p-1 rounded-full">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
};

export default WorkDetail;
