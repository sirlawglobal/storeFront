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
        // Backend accepts both X-Session-Token and Authorization: Bearer
        config.headers['X-Session-Token'] = token;
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

// Response Interceptor — unwraps response.data once
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

// ─────────────────────────────────────────────────────────────────────────────
// API Service Object
// NOTE: The axios response interceptor already unwraps `response.data`, so all
// calls below resolve directly to the data payload (not an AxiosResponse).
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    login: (data: { identifier: string; password: string }) =>
      apiClient.post('/auth/login', data),
    register: (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
    }) => apiClient.post('/auth/register', data),
    verifyPhone: (data: { identifier: string; otp: string }) =>
      apiClient.post('/auth/verify-phone', data),
    verifyEmail: (data: { identifier: string; otp: string }) =>
      apiClient.post('/auth/verify-email', data),
    resendOtp: (data: { identifier: string }) =>
      apiClient.post('/auth/resend-otp', data),
    forgotPassword: (data: { email: string }) =>
      apiClient.post('/auth/forgot-password', data),
    resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
      apiClient.post('/auth/reset-password', data),
    logout: () => apiClient.post('/auth/logout'),
    logoutAll: () => apiClient.post('/auth/logout-all'),
    listSessions: () => apiClient.get('/auth/sessions'),
  },

  // ── Users / Profile ───────────────────────────────────────────────────────
  users: {
    getProfile: () => apiClient.get('/users/me'),
    updateProfile: (data: { firstName?: string; lastName?: string; avatarUrl?: string }) =>
      apiClient.patch('/users/me', data),
    deleteAccount: () => apiClient.delete('/users/me'),
    // Address book
    getAddresses: () => apiClient.get('/users/me/addresses'),
    addAddress: (data: {
      label: string;
      street: string;
      city: string;
      state: string;
      postalCode?: string;
      country?: string;
      isDefault?: boolean;
      coordinates?: [number, number];
    }) => apiClient.post('/users/me/addresses', data),
    updateAddress: (addressId: string, data: Record<string, any>) =>
      apiClient.patch(`/users/me/addresses/${addressId}`, data),
    deleteAddress: (addressId: string) =>
      apiClient.delete(`/users/me/addresses/${addressId}`),
    // Preferences
    updatePreferences: (data: {
      newsletter?: boolean;
      smsAlerts?: boolean;
      pushNotifications?: boolean;
      sleepPosition?: 'side' | 'back' | 'stomach';
      bodyWeightKg?: number;
      mattressPreference?: 'soft' | 'medium' | 'firm' | 'extra-firm';
    }) => apiClient.patch('/users/me/preferences', data),
  },

  // ── Catalog ───────────────────────────────────────────────────────────────
  products: {
    list: (params?: Record<string, any>) =>
      apiClient.get('/products', { params }),
    getBySlug: (slug: string) => apiClient.get(`/products/${slug}`),
    getRelated: (id: string) => apiClient.get(`/products/${id}/related`),
  },

  categories: {
    list: () => apiClient.get('/categories/tree'),
  },

  // ── Cart ──────────────────────────────────────────────────────────────────
  cart: {
    get: () => apiClient.get('/cart'),
    addItem: (data: {
      sku: string;
      quantity: number;
      options?: Record<string, any>;
    }) => apiClient.post('/cart/items', data),
    updateItem: (sku: string, data: { quantity: number }) =>
      apiClient.patch(`/cart/items/${sku}`, data),
    removeItem: (sku: string) => apiClient.delete(`/cart/items/${sku}`),
    clear: () => apiClient.delete('/cart'),
    applyCoupon: (couponCode: string) =>
      apiClient.post('/cart/apply-coupon', { couponCode }),
    removeCoupon: () => apiClient.delete('/cart/coupon'),
    mergeGuestCart: (guestSessionId: string) =>
      apiClient.post('/cart/merge', { guestSessionId }),
  },

  // ── Checkout ──────────────────────────────────────────────────────────────
  checkout: {
    calculateFees: (data: { shippingAddressId: string }) =>
      apiClient.post('/checkout/calculate-fees', data),
    validateAddress: (addressId: string) =>
      apiClient.get(`/checkout/validate-address/${addressId}`),
    initiate: (data: {
      shippingAddressId: string;
      billingAddressId?: string;
      paymentMethod: 'paystack' | 'flutterwave' | 'moniepoint' | 'opay';
      notes?: string;
    }) => apiClient.post('/checkout/initiate', data),
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  orders: {
    list: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/orders', { params }),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    getTracking: (id: string) => apiClient.get(`/orders/${id}/tracking`),
    cancel: (id: string, data: { reason: string }) =>
      apiClient.post(`/orders/${id}/cancel`, data),
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────
  wishlist: {
    get: () => apiClient.get('/wishlist'),
    addItem: (productId: string) => apiClient.post('/wishlist', { productId }),
    removeItem: (productId: string) => apiClient.delete(`/wishlist/${productId}`),
    moveToCart: (productId: string, variantId?: string) =>
      apiClient.post(`/wishlist/${productId}/move-to-cart`, { variantId }),
  },

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviews: {
    getByProduct: (productId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/reviews/products/${productId}`, { params }),
    submit: (productId: string, data: { rating: number; title?: string; comment: string }) =>
      apiClient.post(`/reviews/products/${productId}`, data),
    markHelpful: (id: string) => apiClient.post(`/reviews/${id}/helpful`),
  },

  // ── Recommendations ───────────────────────────────────────────────────────
  recommendations: {
    getTrending: (limit?: number) =>
      apiClient.get('/recommendations/trending', { params: { limit } }),
    getPopular: (limit?: number) =>
      apiClient.get('/recommendations/popular', { params: { limit } }),
    getPersonalized: () => apiClient.get('/recommendations/me'),
  },

  // ── Articles / Blog ───────────────────────────────────────────────────────
  articles: {
    list: (params?: { tag?: string; page?: number; limit?: number }) =>
      apiClient.get('/articles', { params }),
    getBySlug: (slug: string) => apiClient.get(`/articles/${slug}`),
  },

  // ── Dealers Locator ───────────────────────────────────────────────────────
  dealers: {
    getNearby: (lat: number, lng: number, radius = 20) =>
      apiClient.get('/dealers/nearby', { params: { lat, lng, radius } }),
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: {
    list: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/notifications', { params }),
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
    markAllRead: () => apiClient.patch('/notifications/read-all'),
    markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  },
};
