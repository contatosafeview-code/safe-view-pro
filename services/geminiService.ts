
import { GoogleGenAI } from "@google/genai";
import { Work, Client } from "../types";

export const generateBudgetProposal = async (work: Work, client: Client): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Gere uma proposta comercial formal para a SafeView Pro.
    Cliente: ${client.name}
    Projeto: ${work.projectName}
    
    DETALHAMENTO DOS ITENS:
    ${work.measurements.map(m => `- ${m.type}: ${m.width}m x ${m.height}m (${m.area.toFixed(2)}m²) - R$ ${m.price.toLocaleString('pt-BR')}`).join('\n')}
    
    RESUMO FINANCEIRO:
    Valor Total Bruto: R$ ${work.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    Desconto: ${work.discount}%
    VALOR LÍQUIDO FINAL: R$ ${work.netValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    
    Observações: ${work.observations}
    
    Gere um texto profissional, persuasivo, focado em segurança e qualidade. 
    Se houver vários itens do mesmo tipo, agrupe-os no resumo para facilitar a leitura do cliente (ex: "Total Sacadas: R$ X").
    Use tom executivo mas amigável.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Erro ao gerar proposta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, ocorreu um erro ao gerar a proposta automática.";
  }
};

export const generateInvoice = async (work: Work, client: Client): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Gere uma Nota Fiscal de Serviço (Recibo Profissional) detalhada para a SafeView Pro.
    
    DADOS DO EMISSOR:
    SafeView Pro - Soluções em Vidros e Segurança
    CNPJ: 00.000.000/0001-00 (Simulado)
    Contato: (11) 99999-9999
    
    DADOS DO CLIENTE:
    Nome: ${client.name}
    Endereço: ${client.address}, ${client.city}
    
    DETALHES DO SERVIÇO:
    Projeto: ${work.projectName}
    Data de Conclusão: ${work.scheduleDate}
    
    ITENS EXECUTADOS (Detalhamento Item por Item):
    ${work.measurements.map(m => `- ${m.type}: ${m.area.toFixed(2)}m² (Larg: ${m.width}m x Alt: ${m.height}m) - R$ ${m.price.toLocaleString('pt-BR')}`).join('\n')}
    
    RESUMO POR CATEGORIA:
    (Agrupe os itens acima por tipo e mostre a soma parcial de cada tipo)
    
    RESUMO FINANCEIRO:
    Subtotal: R$ ${work.totalValue.toLocaleString('pt-BR')}
    Desconto Aplicado: ${work.discount}%
    TOTAL PAGO: R$ ${work.netValue.toLocaleString('pt-BR')}
    
    Gere um documento com aparência de nota fiscal/recibo oficial. 
    Inclua uma seção de "Termos de Garantia" de 1 ano para os serviços executados e uma mensagem de agradecimento.
    O texto deve ser organizado com linhas divisórias e cabeçalhos claros.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Erro ao gerar nota fiscal.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao processar a nota fiscal digital.";
  }
};
