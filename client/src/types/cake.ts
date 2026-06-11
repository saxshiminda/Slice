export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CakeCategory;
  imageUrl: string;
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export type CakeCategory = 'Wedding' | 'Birthday' | 'Seasonal' | 'Custom';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
  };
}
