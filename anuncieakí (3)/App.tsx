import React, { useState, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
// SellForm removido da importação estática para Lazy Loading
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { PaymentModal } from './components/PaymentModal';
import { AdBanner } from './components/AdBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Product, ViewState, Category } from './types';
import { useAnuncieAki } from './hooks/useAnuncieAki';

// Lazy Load do componente pesado de formulário
// Simulamos um pequeno delay na importação dinâmica para evitar flash em conexões muito rápidas durante testes
const SellFormLazy = React.lazy(() => import('./components/SellForm').then(module => ({ default: module.SellForm })));

// --- CONSTANTES ---
const CATEGORIES: Category[] = [
  { id: '1', name: 'Eletrônicos', icon: '💻' },
  { id: '2', name: 'Veículos', icon: '🚗' },
  { id: '3', name: 'Imóveis', icon: '🏡' },
  { id: '4', name: 'Moda e Beleza', icon: '👕' },
  { id: '5', name: 'Para sua Casa', icon: '🛋️' },
  { id: '6', name: 'Esportes e Lazer', icon: '⚽' },
  { id: '7', name: 'Música e Hobbies', icon: '🎸' },
  { id: '8', name: 'Serviços', icon: '🛠️' },
];

const BOOST_PLANS = [
  { id: '1d', label: '1 Dia', price: 3.50, popular: false },
  { id: '3d', label: '3 Dias', price: 4.99, popular: false },
  { id: '7d', label: '7 Dias', price: 9.99, popular: true },
  { id: '15d', label: '15 Dias', price: 17.99, popular: false },
  { id: '30d', label: '30 Dias', price: 29.99, popular: false },
];

export default function App() {
  const {
    view,
    isLoading,
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
    boostProduct
  } = useAnuncieAki();

  // Estado local apenas para UI efêmera (Modal de Pagamento)
  const [payModal, setPayModal] = useState<{
    show: boolean, 
    amount: number, 
    desc: string, 
    type: 'sell'|'boost', 
    tempProduct?: Product, 
    boostId?: string,
    isSubscriptionPurchase?: boolean
  }>({ show: false, amount: 0, desc: '', type: 'sell' });

  // Handlers de UI para Pagamento
  const initiateSell = (product: Product, amount: number, desc: string, isSubscriptionPurchase: boolean) => {
    if (amount === 0) {
      addProduct(product, false, false);
      alert("✅ Anúncio publicado com sucesso! 1 crédito utilizado.");
    } else {
      setPayModal({ show: true, amount, desc, type: 'sell', tempProduct: product, isSubscriptionPurchase });
    }
  };

  const initiateBoost = (product: Product, plan: typeof BOOST_PLANS[0]) => {
    setPayModal({ 
      show: true, 
      amount: plan.price, 
      desc: `Impulsionar: ${product.title} (${plan.label})`, 
      type: 'boost', 
      tempProduct: product, 
      boostId: plan.id 
    });
  };

  const handlePaymentSuccess = () => {
    if (payModal.type === 'sell' && payModal.tempProduct) {
      addProduct(payModal.tempProduct, true, !!payModal.isSubscriptionPurchase);
      if (payModal.isSubscriptionPurchase) {
        alert("🎉 Pagamento confirmado! Você publicou seu anúncio e agora tem mais 9 créditos gratuitos.");
      }
    } else if (payModal.type === 'boost' && payModal.tempProduct) {
      boostProduct(payModal.tempProduct.id);
      alert("🚀 Anúncio impulsionado com sucesso! Agora ele aparecerá no topo.");
    }
    setPayModal(prev => ({ ...prev, show: false }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        <Navbar 
          onNavigateHome={navigateHome} 
          onNavigateSell={navigateSell} 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          adCredits={adCredits}
        />

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* VIEW: HOME */}
              {view === ViewState.HOME && (
                <div className="animate-fade-in">
                  {!searchTerm && !activeCategory && (
                    <HeroBanner onCtaClick={navigateSell} />
                  )}

                  {/* Categorias */}
                  <section className="mb-10">
                    <div className="flex justify-between items-end mb-4 px-1">
                      <h3 className="font-bold text-gray-800 text-xl">Navegue por Categorias</h3>
                      {activeCategory && (
                        <button onClick={() => setActiveCategory(null)} className="text-sm text-brand-purple hover:underline font-medium">Limpar filtros</button>
                      )}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide snap-x">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                          className={`
                            snap-start min-w-[100px] flex flex-col items-center group transition-all duration-200 p-2 rounded-xl
                            ${activeCategory === cat.name ? 'bg-purple-50 ring-2 ring-brand-purple' : 'hover:bg-white hover:shadow-sm'}
                          `}
                        >
                          <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all duration-300
                            ${activeCategory === cat.name ? 'bg-brand-purple text-white shadow-md scale-110' : 'bg-white text-gray-700 border border-gray-100 group-hover:border-purple-200'}
                          `}>
                            {cat.icon}
                          </div>
                          <span className={`text-xs mt-3 font-medium text-center ${activeCategory === cat.name ? 'text-brand-purple font-bold' : 'text-gray-600'}`}>
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Banner Publicidade */}
                  <div className="mb-10 rounded-lg overflow-hidden shadow-sm">
                    <AdBanner variant="horizontal" />
                  </div>

                  {/* Grid de Produtos */}
                  <section>
                    <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
                      {activeCategory ? activeCategory : 'Destaques Recentes'}
                      <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filteredProducts.length}</span>
                    </h3>
                    
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map(p => (
                          <ProductCard key={p.id} product={p} onClick={selectProduct} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
                        <span className="text-6xl block mb-4 opacity-30">🔍</span>
                        <p className="text-gray-500 font-medium">Nenhum anúncio encontrado.</p>
                        <p className="text-sm text-gray-400">Tente buscar por outro termo.</p>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* VIEW: SELL (Lazy Loaded) */}
              {view === ViewState.SELL && (
                <div className="max-w-2xl mx-auto animate-slide-up">
                  <button onClick={navigateHome} className="mb-6 text-sm text-gray-500 hover:text-brand-purple flex items-center gap-1 transition-colors pl-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Voltar para o início
                  </button>
                  
                  <div className="bg-white rounded-2xl shadow-hover border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-purple to-indigo-800 p-8 text-white relative overflow-hidden">
                      <div className="relative z-10">
                          <h2 className="text-2xl font-bold mb-1">Vamos vender?</h2>
                          <p className="opacity-90 text-purple-100 text-sm">Preencha os dados e anuncie para milhares de pessoas.</p>
                      </div>
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                      <Suspense fallback={
                        <div className="flex justify-center items-center py-20">
                           <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }>
                        <SellFormLazy 
                          onSubmit={initiateSell} 
                          categories={CATEGORIES} 
                          boostPlans={BOOST_PLANS} 
                          adCredits={adCredits}
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: DETAILS */}
              {view === ViewState.PRODUCT_DETAILS && selectedProduct && (
                <div className="max-w-6xl mx-auto animate-fade-in">
                  <button onClick={navigateHome} className="mb-6 text-sm text-gray-500 hover:text-brand-purple flex items-center gap-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Voltar
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 group">
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            <img src={selectedProduct.image} className="w-full h-full object-contain" alt={selectedProduct.title} loading="eager" />
                          </div>
                      </div>

                      <div className="bg-white p-8 rounded-2xl shadow-card border border-gray-100">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Detalhes do Produto</h3>
                          <p className="text-gray-700 leading-8 whitespace-pre-line text-base">{selectedProduct.description}</p>
                      </div>

                      {/* Área de Impulsionar */}
                      {selectedProduct.sellerName === 'Eu' && (
                        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl shadow-sm border border-orange-100">
                            <h3 className="font-bold text-lg mb-2 text-orange-900 flex items-center gap-2">
                              🚀 Venda mais rápido
                            </h3>
                            <p className="text-orange-700/80 text-sm mb-6">Seu anúncio está ativo. Quer destacar ele no topo das buscas?</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                              {BOOST_PLANS.map(plan => (
                                <button 
                                    key={plan.id} 
                                    onClick={() => initiateBoost(selectedProduct, plan)} 
                                    className={`
                                      relative bg-white border p-3 rounded-xl text-left transition-all duration-200 group flex flex-col justify-between h-full
                                      ${plan.popular ? 'border-orange-400 ring-1 ring-orange-200 shadow-md' : 'border-orange-100 hover:border-orange-300 hover:shadow-sm'}
                                    `}
                                >
                                    {plan.popular && <span className="absolute -top-2.5 right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Melhor</span>}
                                    <span className="block font-bold text-gray-800 text-xs md:text-sm mb-1">{plan.label}</span>
                                    <span className="text-orange-600 font-bold text-base md:text-lg">
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}
                                    </span>
                                </button>
                              ))}
                            </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-white p-6 rounded-2xl shadow-hover border border-gray-100 sticky top-24">
                          <div className="mb-6">
                            <span className="inline-block bg-purple-50 text-brand-purple px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                              {selectedProduct.category}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{selectedProduct.title}</h1>
                            <div className="flex items-center text-sm text-gray-500 gap-2 mb-6">
                                <span>Publicado em {selectedProduct.date}</span>
                                <span>•</span>
                                <span>{selectedProduct.location}</span>
                            </div>
                            <p className="text-5xl font-extrabold text-brand-purple tracking-tight">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProduct.price)}
                            </p>
                          </div>

                          <div className="space-y-4 pt-6 border-t border-gray-50">
                            <a 
                              href={`https://wa.me/55${selectedProduct.phoneNumber?.replace(/\D/g,'') || ''}?text=Olá! Vi seu anúncio "${selectedProduct.title}" no AnuncieAKÍ.`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="block w-full"
                            >
                              <Button variant="success" fullWidth className="h-14 text-lg shadow-green-200">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                Chamar no WhatsApp
                              </Button>
                            </a>
                          </div>

                          <div className="mt-6 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-100">👤</div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{selectedProduct.sellerName}</p>
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  <p className="text-xs text-gray-500">Identidade verificada</p>
                                </div>
                            </div>
                            <div className="text-yellow-400 text-sm font-bold">★★★★★</div>
                          </div>
                          
                          <div className="mt-8">
                            <AdBanner variant="square" />
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />

        {/* Modal de Pagamento Global */}
        {payModal.show && (
          <PaymentModal 
            amount={payModal.amount} 
            description={payModal.desc} 
            onSuccess={handlePaymentSuccess} 
            onCancel={() => setPayModal(prev => ({...prev, show: false}))} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
};