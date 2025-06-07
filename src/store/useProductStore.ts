import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface Color {
  hex: string;
  name: string;
}

interface Sku {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string;
  category: { id: string; name: string };
  gender: string;
  sizes: string[];
  colors: Color[];
  skus?: Sku[];
  price: number;
  stock: number;
  soldCount: number;
  rating?: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  isOnOffer?: boolean;
  offerPrice?: number;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: { id: string; name: string };
  }>;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasMore: boolean;
  fetchProductsForClient: (params: {
    page?: number;
    limit?: number;
    categories?: string[];
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    append?: boolean;
  }) => Promise<void>;
  setCurrentPage: (page: number) => void;
  resetProducts: () => void;
  fetchAllProductsForAdmin: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  createProduct: (productData: FormData) => Promise<any>;
  updateProduct: (id: string, productData: FormData) => Promise<any>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Promise<any>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  hasMore: true,
  fetchProductsForClient: async ({
    page = 1,
    limit = 10,
    categories = [],
    sizes = [],
    colors = [],
    brands = [],
    minPrice = 0,
    maxPrice = 100000,
    sortBy = "createdAt",
    sortOrder = "desc",
    append = false,
  }) => {
    if (get().isLoading || (append && !get().hasMore)) return;

    set({ isLoading: true, error: null });

    try {
      const queryParams = {
        page,
        limit,
        categoryIds: categories.length > 0 ? categories.join(",") : undefined,
        sizes: sizes.length > 0 ? sizes.join(",") : undefined,
        colors: colors.length > 0 ? colors.join(",") : undefined,
        brands: brands.length > 0 ? brands.join(",") : undefined,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      };

      const response = await axios.get(`${API_ROUTES.PRODUCTS}/fetch-client-products`, {
        params: queryParams,
        withCredentials: true,
      });

      const newProducts = response.data.products || [];
      const total = response.data.totalProducts || 0;
      const totalPages = response.data.totalPages || 1;
      const currentPage = response.data.currentPage || page;

      set((state) => ({
        products: append ? [...state.products, ...newProducts] : newProducts,
        currentPage,
        totalPages,
        totalProducts: total,
        hasMore: currentPage < totalPages && newProducts.length > 0,
        isLoading: false,
      }));
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || "Failed to fetch products";
      console.error("Fetch error:", errorMessage);
      set({
        error: errorMessage,
        isLoading: false,
        hasMore: false,
      });
    }
  },
  resetProducts: () => {
    set({
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      hasMore: true,
      error: null,
    });
  },
  setCurrentPage: (page: number) => set({ currentPage: page }),
  fetchAllProductsForAdmin: async ({ page = 1, limit = 10, search = "" } = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.PRODUCTS}/fetch-admin-products`, {
        params: { page, limit, search },
        withCredentials: true,
      });

      const { products, totalPages, totalProducts, currentPage } = response.data;

      set({
        products,
        currentPage,
        totalPages,
        totalProducts,
        hasMore: currentPage < totalPages,
        isLoading: false,
      });
    } catch (e) {
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },
  createProduct: async (productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_ROUTES.PRODUCTS}/create-new-product`, productData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isLoading: false });
      return response.data;
    } catch (e) {
      set({ error: "Failed to create product", isLoading: false });
    }
  },
  updateProduct: async (id: string, productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_ROUTES.PRODUCTS}/${id}`, productData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return response.data;
    } catch (e) {
      set({ error: "Failed to update product", isLoading: false });
    }
  },
  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (e) {
      set({ error: "Failed to delete product", isLoading: false });
    }
  },
  getProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data;
    } catch (e) {
      set({ error: "Failed to fetch product", isLoading: false });
      return null;
    }
  },
}));

// Helper to access the current state inside store actions
function get() {
  // @ts-ignore
  return useProductStore.getState();
}
