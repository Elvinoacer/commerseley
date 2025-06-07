import { WishlistResponse } from "@/types";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.WISHLIST,
  withCredentials: true,
});

interface WishlistStore {
  wishlist: WishlistResponse | null; // Single wishlist object
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  getWishlist: (page?: number, limit?: number) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<{ success: boolean; message?: string }>;
  clearWishlist: () => Promise<{ success: boolean; message?: string }>;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: null,
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 8,
      totalItems: 0,

      getWishlist: async (page = 1, limit = 8) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get(`/get-wishlist?page=${page}&limit=${limit}`);
          set({
            wishlist: response.data.wishlist || null,
            isLoading: false,
            currentPage: response.data.currentPage || page,
            totalPages: response.data.totalPages || 1,
            itemsPerPage: response.data.itemsPerPage || limit,
            totalItems: response.data.totalItems || 0,
          });
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch wishlist"
            : "Failed to fetch wishlist";
          set({ isLoading: false, error: errorMessage });
        }
      },

      toggleWishlist: async (productId: string) => {
        const { currentPage, itemsPerPage } = get();
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/toggle-wishlist", { productId });
          await get().getWishlist(currentPage, itemsPerPage);
          return { success: true, message: response.data.message };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to update wishlist"
            : "Failed to update wishlist";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      clearWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.delete("/clear-wishlist");
          set({
            wishlist: response.data.wishlist || null,
            isLoading: false,
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
          });
          return { success: true, message: response.data.message };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to clear wishlist"
            : "Failed to clear wishlist";
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      setCurrentPage: (page: number) => set({ currentPage: page }),

      setItemsPerPage: (limit: number) => {
        set({ itemsPerPage: limit, currentPage: 1 });
        get().getWishlist(1, limit);
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({
        wishlist: state.wishlist,
        currentPage: state.currentPage,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);
