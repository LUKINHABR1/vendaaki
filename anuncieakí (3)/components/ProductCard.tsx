import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

// Instância única do formatador para evitar overhead no render
const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={() => onClick(product)}
      className={`
        group bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer overflow-hidden border
        ${product.isPromoted ? 'border-purple-200 ring-2 ring-purple-100/50' : 'border-gray-100 hover:border-gray-200'}
      `}
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {product.isPromoted && (
          <div className="absolute top-2 right-2 z-10">
             <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
               Destaque
             </span>
          </div>
        )}
        
        {!imgError ? (
          <img 
            src={product.image} 
            alt={product.title} 
            className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${product.isPromoted ? 'animate-breathe' : 'transform group-hover:scale-105'}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
             <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <span className="text-xs font-medium">Imagem indisponível</span>
          </div>
        )}
        
        {/* Overlay de localização */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 pt-8 opacity-90">
            <p className="text-white text-xs font-semibold drop-shadow-md truncate flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              {product.location}
            </p>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-gray-700 text-sm font-medium line-clamp-2 h-10 mb-2 leading-snug group-hover:text-brand-purple transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-900 font-extrabold text-xl tracking-tight">
          {priceFormatter.format(product.price)}
        </p>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
           <span>{product.date}</span>
           <span className="font-medium text-gray-500">{product.category}</span>
        </div>
      </div>
    </div>
  );
});