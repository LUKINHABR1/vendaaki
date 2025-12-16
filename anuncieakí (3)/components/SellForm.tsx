import React, { useState, useCallback, useEffect } from 'react';
import { Button } from './Button';
import { Product, Category } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface BoostPlan {
  id: string;
  label: string;
  price: number;
  popular: boolean;
}

interface SellFormProps {
  onSubmit: (product: Product, amount: number, desc: string, isSubscriptionPurchase: boolean) => void;
  categories: Category[];
  boostPlans: BoostPlan[];
  adCredits: number;
}

const labelStyle = "block text-sm font-semibold text-gray-700 mb-1.5";
const inputStyle = "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all placeholder-gray-400 text-gray-900";

export const SellForm: React.FC<SellFormProps> = ({ onSubmit, categories, boostPlans, adCredits }) => {
  const [data, setData] = useState({ 
    title: '', 
    price: '', 
    category: '', 
    condition: 'Usado', 
    description: '', 
    location: '', 
    phone: '' 
  });
  
  // Estado separado para o arquivo e o preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedBoostId, setSelectedBoostId] = useState<string | null>(null);

  const hasCredits = adCredits > 0;
  const subscriptionPrice = hasCredits ? 0 : 9.99;

  // Cleanup do object URL para evitar memory leak
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem é muito grande! Tente uma menor que 5MB.");
        return;
      }
      
      // Uso de URL.createObjectURL para preview instantâneo (mais rápido que FileReader)
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(objectUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview('');
  };

  const handleAI = async () => {
    if (!data.title || !data.category) return alert("Preencha o título e categoria primeiro!");
    setLoadingAI(true);
    try {
      const desc = await generateProductDescription(data.title, data.category, data.condition);
      setData(prev => ({ ...prev, description: desc }));
    } catch(e) {
      alert("Erro ao gerar descrição. Tente novamente.");
    } finally {
      setLoadingAI(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(data.price.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (!data.title || isNaN(priceValue)) return alert("Verifique os dados preenchidos.");
    if (!imageFile && !imagePreview) return alert("Por favor, adicione uma foto do produto.");

    // Converte a imagem para Base64 apenas no momento do submit (para salvar no localStorage/API)
    let finalImage = imagePreview;
    if (imageFile) {
        try {
            finalImage = await convertFileToBase64(imageFile);
        } catch (error) {
            console.error("Erro ao processar imagem", error);
            return alert("Erro ao processar a imagem.");
        }
    }

    const selectedPlan = boostPlans.find(p => p.id === selectedBoostId);
    const boostPrice = selectedPlan ? selectedPlan.price : 0;
    const totalAmount = subscriptionPrice + boostPrice;
    
    let descriptionText = "";
    if (!hasCredits) {
      descriptionText = "Pacote Anunciante (10 Anúncios)";
      if (selectedPlan) descriptionText += ` + Impulsionamento (${selectedPlan.label})`;
    } else {
      descriptionText = "Utilização de Crédito de Anúncio";
      if (selectedPlan) descriptionText += ` + Impulsionamento (${selectedPlan.label})`;
      else descriptionText = "Publicação Gratuita (Crédito utilizado)";
    }

    const product: Product = {
      id: crypto.randomUUID(),
      title: data.title,
      price: priceValue,
      description: data.description,
      category: data.category,
      image: finalImage,
      location: data.location,
      phoneNumber: data.phone,
      date: 'Agora',
      sellerName: 'Eu',
      status: 'active',
      isPromoted: !!selectedPlan
    };

    onSubmit(product, totalAmount, descriptionText, !hasCredits);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={`p-4 rounded-xl border flex items-center justify-between ${hasCredits ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
        <div>
          <p className="text-sm font-bold text-gray-700">Seu saldo de anúncios:</p>
          <p className={`text-2xl font-extrabold ${hasCredits ? 'text-brand-purple' : 'text-gray-400'}`}>{adCredits}</p>
        </div>
        {!hasCredits && (
          <div className="text-right">
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Sem créditos</span>
            <p className="text-xs text-gray-500 mt-1 max-w-[150px]">Pague a taxa agora e ganhe 10 anúncios!</p>
          </div>
        )}
      </div>

      <div>
        <label className={labelStyle}>O que você vai vender?</label>
        <input name="title" className={inputStyle} placeholder="Ex: iPhone 13, Sofá 3 lugares..." value={data.title} onChange={handleChange} required />
      </div>

      <div>
        <label className={labelStyle}>Fotos do Produto</label>
        {!imagePreview ? (
          <div className="mt-1 flex justify-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 hover:border-brand-purple transition-all relative cursor-pointer group">
            <input id="file-upload" name="image-upload" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageUpload} />
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-brand-purple transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative rounded-md font-medium text-brand-purple">Enviar uma foto</span>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
            </div>
          </div>
        ) : (
          <div className="relative mt-2 h-64 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
             <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={removeImage} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Remover Foto
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className={labelStyle}>Preço (R$)</label>
           <input name="price" type="text" className={inputStyle} placeholder="0,00" value={data.price} onChange={handleChange} required />
        </div>
        <div>
           <label className={labelStyle}>Categoria</label>
           <select name="category" className={`${inputStyle} appearance-none bg-no-repeat bg-[right_1rem_center]`} value={data.category} onChange={handleChange} required>
             <option value="">Selecione...</option>
             {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
           </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className={labelStyle}>Descrição</label>
          <button type="button" onClick={handleAI} disabled={loadingAI} className="text-xs font-bold text-brand-purple bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 transition-colors flex items-center gap-1 disabled:opacity-50">
            {loadingAI ? <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Gerando...</span> : <>✨ IA Mágica</>}
          </button>
        </div>
        <textarea name="description" className={inputStyle} rows={4} placeholder="Conte detalhes do produto, tempo de uso, etc." value={data.description} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Localização</label>
          <input name="location" className={inputStyle} placeholder="Cidade - UF" value={data.location} onChange={handleChange} required />
        </div>
        <div>
          <label className={labelStyle}>WhatsApp</label>
          <input name="phone" type="tel" className={inputStyle} placeholder="11 99999-9999" value={data.phone} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-100">
         <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">🚀 Quer vender mais rápido? <span className="text-xs font-normal text-gray-500">(Opcional)</span></h3>
         
         <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
            {boostPlans.map(plan => {
              const isSelected = selectedBoostId === plan.id;
              return (
                <div key={plan.id} onClick={() => setSelectedBoostId(isSelected ? null : plan.id)} className={`cursor-pointer relative border rounded-xl p-2 text-center transition-all duration-200 ${isSelected ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300'}`}>
                   {plan.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] px-1.5 rounded-full whitespace-nowrap z-10">Mais Vendido</span>}
                   <p className={`text-xs font-bold ${isSelected ? 'text-orange-900' : 'text-gray-700'}`}>{plan.label}</p>
                   <p className={`text-sm font-bold ${isSelected ? 'text-orange-600' : 'text-gray-900'}`}>{formatCurrency(plan.price)}</p>
                </div>
              );
            })}
         </div>

         <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
               <span>Taxa de Publicação {hasCredits ? '(Crédito)' : '(Mensalidade)'}</span>
               <span className={hasCredits ? 'text-green-600 font-bold' : ''}>{hasCredits ? 'GRÁTIS' : formatCurrency(subscriptionPrice)}</span>
            </div>
            {!hasCredits && <div className="text-xs text-green-600 mb-3 bg-green-50 p-2 rounded border border-green-100">✨ Inclui pacote com 10 anúncios gratuitos!</div>}
            {selectedBoostId && (
               <div className="flex justify-between items-center mb-2 text-sm text-orange-600 font-medium animate-fade-in">
                  <span>Impulsionamento ({boostPlans.find(p => p.id === selectedBoostId)?.label})</span>
                  <span>+ {formatCurrency(boostPlans.find(p => p.id === selectedBoostId)?.price || 0)}</span>
               </div>
            )}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center text-lg font-bold text-gray-900">
               <span>Total a Pagar</span>
               <span>{formatCurrency(subscriptionPrice + (boostPlans.find(p => p.id === selectedBoostId)?.price || 0))}</span>
            </div>
         </div>

         <Button type="submit" variant="secondary" fullWidth className="h-14 text-lg shadow-orange-200">
           {subscriptionPrice + (boostPlans.find(p => p.id === selectedBoostId)?.price || 0) > 0 ? 'Pagar e Publicar' : 'Publicar Agora'}
         </Button>
      </div>
    </form>
  );
};