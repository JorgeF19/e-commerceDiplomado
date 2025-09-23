// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://192.168.1.8:8000",
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/auth/login",
    ME: "/auth/me",

    // Products endpoints
    PRODUCTS: "/products/products/",
    CATEGORIES: "/products/categories/",

    // Orders endpoints
    ORDERS: "/orders",

    // Cart endpoints
    CART: "/cart",
  },
};

// Default axios config
export const axiosConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};
