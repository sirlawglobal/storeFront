import axios from 'axios';

// The Next.js rewrite redirects this to the real backend URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (inject auth & guest tokens)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vita_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const guestId = localStorage.getItem('vita_guest_id');
      if (guestId) {
        config.headers['X-Guest-Session-ID'] = guestId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vita_token');
      localStorage.removeItem('vita_user');
      // Only redirect if not already on login page or home
      const path = window.location.pathname;
      if (!path.startsWith('/login') && path.startsWith('/account')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message || 'An error occurred' });
  }
);

// API Service Object
export const api = {
  // --- Auth ---
  auth: {
    login: (data: any) => apiClient.post('/auth/login', data),
    register: (data: any) => apiClient.post('/auth/register', data),
    verifyPhone: (data: any) => apiClient.post('/auth/verify-phone', data),
    verifyEmail: (data: any) => apiClient.post('/auth/verify-email', data),
    forgotPassword: (data: any) => apiClient.post('/auth/forgot-password', data),
    resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),
    logout: () => apiClient.post('/auth/logout'),
  },

  // --- Users ---
  users: {
    getProfile: () => apiClient.get('/users/me'),
    updateProfile: (data: any) => apiClient.patch('/users/me', data),
  },

  // --- Catalog ---
  products: {
    list: (params?: any) => apiClient.get('/products', { params }),
    getBySlug: (slug: string) => apiClient.get(`/products/${slug}`),
    getRelated: (id: string) => apiClient.get(`/products/${id}/related`),
  },
  
  categories: {
    list: () => apiClient.get('/categories/tree'),
  },

  // --- Cart ---
  cart: {
    get: () => apiClient.get('/cart'),
    addItem: (data: any) => apiClient.post('/cart/items', data),
    updateItem: (sku: string, data: any) => apiClient.patch(`/cart/items/${sku}`, data),
    removeItem: (sku: string) => apiClient.delete(`/cart/items/${sku}`),
    clear: () => apiClient.delete('/cart'),
    applyCoupon: (couponCode: string) => apiClient.post('/cart/apply-coupon', { couponCode }),
    removeCoupon: () => apiClient.delete('/cart/coupon'),
    mergeGuestCart: (guestSessionId: string) => apiClient.post('/cart/merge', { guestSessionId }),
  },
};
