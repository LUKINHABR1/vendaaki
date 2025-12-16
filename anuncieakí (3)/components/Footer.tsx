import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center text-white font-bold">A</div>
               <span className="font-bold text-xl text-gray-800">AnuncieAKÍ</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              A plataforma de classificados que conecta compradores e vendedores de forma simples, rápida e segura.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-purple">Sobre nós</a></li>
              <li><a href="#" className="hover:text-brand-purple">Carreiras</a></li>
              <li><a href="#" className="hover:text-brand-purple">Blog</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-gray-900 mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-purple">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-brand-purple">Regras de Segurança</a></li>
              <li><a href="#" className="hover:text-brand-purple">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-gray-900 mb-4">Redes Sociais</h4>
             <div className="flex gap-4">
               {['Instagram', 'Facebook', 'Twitter'].map(social => (
                 <div key={social} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-brand-purple hover:text-white cursor-pointer transition-colors">
                    {/* Placeholder icon */}
                    <span className="text-xs">{social[0]}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-sm text-gray-400">
           &copy; {new Date().getFullYear()} AnuncieAKÍ Ltda. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};