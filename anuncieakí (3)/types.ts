export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
  sellerName: string;
  phoneNumber?: string;
  isPromoted?: boolean;
  status: 'active' | 'sold';
}

export enum ViewState {
  HOME = 'HOME',
  PRODUCT_DETAILS = 'PRODUCT_DETAILS',
  SELL = 'SELL'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}