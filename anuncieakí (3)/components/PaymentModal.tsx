import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface PaymentModalProps {
  amount: number;
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ amount, description, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'scan' | 'processing' | 'approved'>('scan');
  
  // Simulador de aprovação automática
  useEffect(() => {
    if (step === 'scan') {
      const timer = setTimeout(() => setStep('processing'), 5000); // 5s para "pagar"
      return () => clearTimeout(timer);
    }
    if (step === 'processing') {
      const timer = setTimeout(() => setStep('approved'), 2000); // 2s processando
      return () => clearTimeout(timer);
    }
    if (step === 'approved') {
      const timer = setTimeout(onSuccess, 2000); // 2s para fechar
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="bg-brand-purple p-4 text-center">
          <h3 className="text-white font-bold text-lg">Pagamento Seguro Pix</h3>
        </div>

        <div className="p-6 text-center">
          {step === 'scan' && (
            <>
              <p className="text-gray-500 mb-2">{description}</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
              </h2>
              
              <div className="bg-gray-100 p-4 rounded-xl inline-block mb-4 border border-gray-200">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=pix-${amount}`} alt="QR Code" className="w-40 h-40 mix-blend-multiply" />
              </div>
              
              <p className="text-sm text-gray-500 mb-4 animate-pulse">Aguardando pagamento do banco...</p>
              
              <Button variant="ghost" onClick={onCancel} className="text-sm w-full">Cancelar</Button>
            </>
          )}

          {step === 'processing' && (
             <div className="py-10">
               <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="font-medium text-gray-700">Validando pagamento...</p>
             </div>
          )}

          {step === 'approved' && (
            <div className="py-10 animate-fade-in">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <h3 className="text-xl font-bold text-gray-900">Sucesso!</h3>
               <p className="text-gray-500 text-sm">Seu pedido foi confirmado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};