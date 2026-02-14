
export type WorkStatus = 'Em Orçamento' | 'Agendado' | 'Em Execução' | 'Concluído' | 'Cancelado';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface Measurement {
  id: string;
  type: string; // "Sacada", "Janela Quarto", etc.
  width: number;
  height: number;
  area: number;
  cost: number;
  price: number;
}

export interface Photo {
  id: string;
  url: string;
  description: string;
  timestamp: string;
}

export interface Payment {
  amount: number;
  method: string;
  date: string;
}

export interface Work {
  id: string;
  clientId: string;
  projectName: string;
  scheduleDate: string;
  status: WorkStatus;
  observations: string;
  measurements: Measurement[];
  totalValue: number;
  discount: number;
  netValue: number;
  photos: Photo[];
  payments: Payment[];
}
