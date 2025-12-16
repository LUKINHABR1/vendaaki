import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, ViewState } from '../types';
import { api } from '../services/api';

const INITIAL_PRODUCTS_FALLBACK: Product[] = [
  { id: '1', title: 'iPhone 14 Pro Max 256GB - Impecável', price: 6500, description: 'Sem marcas de uso. Saúde bateria 100%. Acompanha caixa e carregador original. Aceito trocas por modelos inferiores + volta.', category: 'Eletrônicos', image: 'https://picsum.photos/seed/phone123/500/500', location: 'São Paulo, SP', date: 'Hoje', sellerName: 'João Tech', status: 'active', isPromoted: true },
  { id: '2', title: 'Honda Civic 2021 Touring Turbo', price: 120000, description: 'Único dono, todas revisões na concessionária. Baixa quilometragem. IPVA 2024 pago.', category: 'Veículos', image: 'https://picsum.photos/seed/car555/500/500', location: 'Curitiba, PR', date: 'Ontem', sellerName: 'Motors PR', status: 'active' },
  { id: '3', title: 'Sofá Retrátil 3 Lugares Suede', price: 1200, description: 'Confortável, tecido suede, cor cinza. Precisa retirar no local. Motivo da venda: mudança.', category: 'Para sua Casa', image: 'https://picsum.photos/seed/sofa99/500/500', location: 'Rio de Janeiro, RJ', date: 'Há 2 horas', sellerName: 'Maria Silva', status: 'active' },
  { id: '4', title: 'Macbook Air M1 8GB 256GB', price: 4800, description: 'Cinza espacial. Garantia Apple Care até Dezembro. Bateria com apenas 20 ciclos.', category: 'Eletrônicos', image: 'https://picsum.photos/seed/mac22/500/500', location: 'Belo Horizonte, MG', date: 'Hoje', sellerName: 'Pedro Info', status: 'active' },
  { id: '5', title: 'Guitarra Fender Stratocaster', price: 3500, description: 'Modelo mexicano, ano 2010. Regulada recentemente por luthier. Timbre clássico.', category: 'Música e Hobbies', image: 'https://picsum.photos/seed/guitar/500/500', location: 'Porto Alegre, RS', date: 'Ontem', sellerName: 'Rock Store', status: 'active' },
];

export const useAnuncieAki = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [adCredits, setAdCredits] = useState<number>(0);

  // Inicialização
  useEffect(() => {
    let mounted = true;
    const initData = async () => {
      try {
        const [fetchedProducts, fetchedCredits] = await Promise.all([
          api.products.list(),
          api.credits.get()
        ]);
        
        if (!mounted) return;

        if (fetchedProducts.length === 0) {
          setProducts(INITIAL_PRODUCTS_FALLBACK);
          // Não aguardamos o save para não bloquear a UI inicial
          api.products.save(INITIAL_PRODUCTS_FALLBACK).catch(console.error);
        } else {
          setProducts(fetchedProducts);
        }
        
        setAdCredits(fetchedCredits);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initData();
    return () => { mounted = false; };
  }, []);

  // Lógica de Filtragem (Memoizada)
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    // Otimização: Se não houver filtro, retorna a lista original diretamente
    if (!term && !activeCategory) return products;

    return products.filter(p => {
      if (p.status !== 'active') return false;
      if (activeCategory && p.category !== activeCategory) return false;
      if (term && !(p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))) return false;
      return true;
    });
  }, [products, searchTerm, activeCategory]);

  // Ações de Navegação
  const navigateHome = useCallback(() => {
    setView(ViewState.HOME);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateSell = useCallback(() => {
    setView(ViewState.SELL);
    window.scrollTo(0, 0);
  }, []);

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setView(ViewState.PRODUCT_DETAILS);
    window.scrollTo(0, 0);
  }, []);

  // Ações de Dados
  const addProduct = useCallback(async (product: Product, isPaid: boolean, isSubscription: boolean) => {
    // Optimistic UI Update
    setProducts(prev => [product, ...prev]);
    
    let newCredits = adCredits;
    if (isPaid && isSubscription) {
      newCredits += 9; // Comprou pacote
    } else if (!isPaid) {
      newCredits = Math.max(0, adCredits - 1); // Usou crédito
    }
    
    setAdCredits(newCredits);
    navigateHome();

    // Background Sync
    try {
      await Promise.all([
        api.products.create(product),
        api.credits.update(newCredits)
      ]);
    } catch (e) {
      console.error("Erro ao salvar dados em background", e);
      // Aqui poderíamos implementar um rollback se fosse crítico
    }
  }, [adCredits, navigateHome]);

  const boostProduct = useCallback(async (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? { ...p, isPromoted: true } : p);
      // Background save com a lista atualizada
      api.products.save(updated).catch(console.error); 
      return updated;
    });

    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => prev ? { ...prev, isPromoted: true } : null);
    }
  }, [selectedProduct]);

  return {
    view,
    isLoading,
    products,
    filteredProducts,
    selectedProduct,
    searchTerm,
    activeCategory,
    adCredits,
    setSearchTerm,
    setActiveCategory,
    navigateHome,
    navigateSell,
    selectProduct,
    addProduct,
    boostProduct,
    setAdCredits // Exposto caso precise de atualização manual fora do fluxo padrão
  };
};