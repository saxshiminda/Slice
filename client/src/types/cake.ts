export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryWithCount extends Category {
  _count?: { cakes: number };
}

export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: Category;
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

export interface Order {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  servings: string;
  categoryId: string | null;
  category: Category | null;
  details: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
  };
}

export interface LoginResponse {
  token: string;
  username: string;
}
