import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base";
  
  const variants = {
    primary: "bg-brand-purple text-white hover:bg-purple-800 shadow-md",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md", // Laranja estilo OLX
    outline: "border-2 border-brand-purple text-brand-purple hover:bg-purple-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
};