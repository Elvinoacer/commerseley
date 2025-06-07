const SERVER_URLS = {
  local: "http://localhost:3001/api",
  ngrok: "https://45f9-102-210-56-246.ngrok-free.app/api",
};

export const API_BASE_URL = SERVER_URLS.local;

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/auth`,
  PRODUCTS: `${API_BASE_URL}/products`,
  COUPON: `${API_BASE_URL}/coupon`,
  SETTINGS: `${API_BASE_URL}/settings`,
  CART: `${API_BASE_URL}/cart`,
  ADDRESS: `${API_BASE_URL}/address`,
  ORDER: `${API_BASE_URL}/order`,
  CUSTOMER: `${API_BASE_URL}/customers`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  REVIEWS: `${API_BASE_URL}/reviews`,
  WISHLIST: `${API_BASE_URL}/wishlist`,
  EMAILS: `${API_BASE_URL}/emails`,
  ADMIN_ACTIVITIES: `${API_BASE_URL}/admin-activities`,
  ADMIN: `${API_BASE_URL}/admin`,
  ADMIN_SETTINGS: `${API_BASE_URL}/admin-settings`,
  ANALYTICS: `${API_BASE_URL}/admin-analytics`,
};
