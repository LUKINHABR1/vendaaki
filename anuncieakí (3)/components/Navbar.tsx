import React from 'react';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateSell: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  adCredits: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateSell, searchTerm, onSearchChange, adCredits }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={onNavigateHome}>
            <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center mr-2 shadow-sm">
              <span className="text-white font-extrabold text-xl">A</span>
            </div>
            <h1 className="hidden md:block text-2xl font-bold text-brand-purple tracking-tight">
              AnuncieAKÍ
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos, carros e imóveis..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-brand-purple transition-all outline-none"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Credits Badge */}
            {adCredits > 0 && (
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-gray-500 font-medium">Seus Créditos</span>
                <span className="text-sm font-bold text-brand-purple bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {adCredits} anúncios
                </span>
              </div>
            )}

            <button className="hidden md:flex items-center text-gray-600 hover:text-brand-purple font-medium transition-colors">
              <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              Favoritos
            </button>
            
            {/* CTA Button - Laranja Vibrante */}
            <button 
              onClick={onNavigateSell}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-lg hover:shadow-orange-200 transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm md:text-base flex items-center gap-1"
            >
              Anunciar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};