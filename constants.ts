
import { Client, Work } from './types';

export const COLORS = {
  primary: '#2563eb', // Blue 600
  secondary: '#64748b', // Slate 500
  success: '#22c55e', // Green 500
  danger: '#ef4444', // Red 500
  warning: '#f59e0b', // Amber 500
};

export const AREA_TYPES = [
  "Sacada",
  "Janela Quarto",
  "Cozinha",
  "Vão Escada",
  "Outro"
];

// Valores base para cálculos
export const DEFAULT_PRICE_PER_M2 = 350;
export const DEFAULT_COST_PER_M2 = 150;

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Marcelo Silva',
    phone: '11988887777',
    email: 'marcelo@example.com',
    address: 'Rua das Flores, 123',
    city: 'São Paulo'
  },
  {
    id: 'c2',
    name: 'André Santos',
    phone: '11977776666',
    email: 'andre@example.com',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo'
  }
];

export const INITIAL_WORKS: Work[] = [
  {
    id: 'w1',
    clientId: 'c1',
    projectName: 'Reforma Sacada Apto 42',
    scheduleDate: '2024-05-20',
    status: 'Agendado',
    observations: 'Instalação de vidros temperados 10mm.',
    measurements: [
      { id: 'm1', type: 'Sacada', width: 4.5, height: 2.1, area: 9.45, cost: 1417.5, price: 3307.5 }
    ],
    totalValue: 3307.5,
    discount: 0,
    netValue: 3307.5,
    photos: [],
    payments: []
  },
  {
    id: 'w2',
    clientId: 'c2',
    projectName: 'Janelas Quarto Suite',
    scheduleDate: '2024-05-22',
    status: 'Em Orçamento',
    observations: 'Orçamento urgente.',
    measurements: [
      { id: 'm2', type: 'Janela Quarto', width: 1.5, height: 1.2, area: 1.8, cost: 270, price: 630 }
    ],
    totalValue: 630,
    discount: 10,
    netValue: 567,
    photos: [],
    payments: []
  }
];
