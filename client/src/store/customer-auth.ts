import { create } from 'zustand';
import { setCustomerAuthToken } from '@/lib/api';
import type { Customer } from '@/types';

const TOKEN_KEY = 'slice_customer_token';
const CUSTOMER_KEY = 'slice_customer';

interface CustomerAuthState {
  token: string | null;
  customer: Customer | null;
  setAuth: (token: string, customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>((set) => ({
  token: null,
  customer: null,

  setAuth: (token, customer) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    setCustomerAuthToken(token);
    set({ token, customer });
  },

  updateCustomer: (customer) => {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    set({ customer });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
    setCustomerAuthToken(null);
    set({ token: null, customer: null });
  },

  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(CUSTOMER_KEY);
    const customer = raw ? (JSON.parse(raw) as Customer) : null;
    if (token) setCustomerAuthToken(token);
    set({ token, customer });
  },
}));
