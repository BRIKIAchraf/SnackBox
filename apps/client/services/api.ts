import axios from 'axios';

import { API_BASE } from '../lib/api-config';

const API_URL = API_BASE;

export const api = axios.create({
  baseURL: API_URL,
});

export const productApi = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getToppings: async () => {
    const response = await api.get('/products/toppings');
    return response.data;
  },
};

export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export const orderApi = {
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};
