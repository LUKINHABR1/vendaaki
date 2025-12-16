import React from 'react';

export const AdBanner: React.FC<{ variant?: 'horizontal' | 'square' }> = ({ variant = 'horizontal' }) => {
  return (
    <div className={`bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden ${variant === 'horizontal' ? 'h-28 w-full' : 'h-64 w-full'}`}>
      <span className="absolute top-0 right-0 bg-gray-200 text-[9px] text-gray-500 px-2 rounded-bl">Publicidade</span>
      <p className="text-gray-400 text-sm font-medium">Espaço para Google Ads</p>
    </div>
  );
};