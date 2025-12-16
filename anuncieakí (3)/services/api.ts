import { Product } from '../types';

// Simulação de latência de rede para testes de carga de UI (opcional, setado baixo para UX)
const LATENCY = 300; 

const STORAGE_KEYS = {
  PRODUCTS: 'anuncieaki_products_v2',
  CREDITS: 'anuncieaki_credits'
};

// Simulando um banco de dados
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  products: {
    list: async (): Promise<Product[]> => {
      // Em produção, isso seria um fetch('/api/products') com cache CDN
      await delay(LATENCY); 
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    },
    
    save: async (products: Product[]): Promise<void> => {
      // Em produção, isso seria um POST/PUT
      await delay(LATENCY);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    },

    create: async (product: Product): Promise<Product> => {
      await delay(LATENCY);
      const current = await api.products.list();
      const updated = [product, ...current];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return product;
    }
  },

  credits: {
    get: async (): Promise<number> => {
      const data = localStorage.getItem(STORAGE_KEYS.CREDITS);
      return data ? parseInt(data, 10) : 0;
    },
    
    update: async (amount: number): Promise<number> => {
      localStorage.setItem(STORAGE_KEYS.CREDITS, amount.toString());
      return amount;
    }
  }
};