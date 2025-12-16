import React from 'react';
import { Button } from './Button';

interface HeroBannerProps {
  onCtaClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onCtaClick }) => {
  return (
    <div className="relative bg-gradient-to-br from-brand-purple to-indigo-900 rounded-2xl p-6 md:p-12 text-white shadow-soft overflow-hidden mb-8 isolate">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-brand-orange opacity-10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-white/10">
            Oferta Especial de Lançamento
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
            Desapegue do que <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">está parado.</span>
          </h2>
          <p className="text-purple-100 text-lg mb-8 leading-relaxed">
            Assine o plano ilimitado por apenas <strong className="text-white">R$ 9,99/mês</strong> e venda para milhares de pessoas na sua região.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button variant="secondary" onClick={onCtaClick} className="text-lg px-8 py-4 shadow-lg shadow-orange-900/20">
              Anunciar Agora
            </Button>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              Como funciona?
            </Button>
          </div>
        </div>
        
        {/* Ilustração 3D Simulada */}
        <div className="hidden md:block relative w-80 h-64">
           <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl transform rotate-3 border border-white/10 backdrop-blur-sm"></div>
           <div className="absolute inset-0 bg-white/5 rounded-xl transform -rotate-3 border border-white/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-6xl filter drop-shadow-lg">📦 🚀 💸</span>
           </div>
        </div>
      </div>
    </div>
  );
};