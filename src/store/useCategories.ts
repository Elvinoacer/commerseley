import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { Category, CategoryResponse, CategoriesResponse } from "@/types";
import { useAuthStore } from "./useAuthStore";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  searchTerm: string;
  fetchCategories: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<Category | null>;
  createCategory: (name: string, description?: string) => Promise<string | null>;
  updateCategory: (id: string, name: string, description?: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  setPagination: (pagination: Partial<Pagination>) => void;
  setSearchTerm: (term: string) => void;
}

const axiosInstance = axios.create({
  baseURL: API_ROUTES.CATEGORIES,
  withCredentials: true,
});

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
      searchTerm: "",

      fetchCategories: async (page = 1, limit = 10, search = "") => {
        const { pagination } = get();
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<CategoriesResponse>(
            `/?page=${page}&limit=${limit}&search=${search}`
          );
          set({
            categories: response.data.data || [],
            isLoading: false,
            pagination: {
              ...pagination,
              ...response.data.pagination,
              currentPage: page,
              itemsPerPage: limit,
            },
          });
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to fetch categories"
              : "Failed to fetch categories",
          });
        }
      },

      fetchCategoryById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<CategoryResponse>(`/${id}`);
          const category = response.data.data || null;
          if (category) {
            set({
              categories: [...get().categories.filter((c) => c.id !== id), category],
              isLoading: false,
            });
          } else {
            set({ isLoading: false, error: "Category not found" });
          }
          return category;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to fetch category"
              : "Failed to fetch category",
          });
          return null;
        }
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
        get().fetchCategories(1, get().pagination.itemsPerPage, term);
      },

      setPagination: (pagination) => {
        set({ pagination: { ...get().pagination, ...pagination } });
      },

      createCategory: async (name: string, description?: string, userRole?: string) => {
        const { pagination, searchTerm } = get();
        if (userRole !== "SUPER_ADMIN") {
          set({ error: "Unauthorized request" });
          return null;
        }
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post<CategoryResponse>("/", {
            name,
            description,
          });
          const category = response.data.data;
          if (category) {
            await get().fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm);
            return category.id;
          }
          set({ isLoading: false, error: "Failed to create category" });
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to create category"
              : "Failed to create category",
          });
          return null;
        }
      },

      updateCategory: async (id: string, name: string, description?: string) => {
        const { user } = useAuthStore.getState();
        const { pagination, searchTerm } = get();
        if (user?.role !== "SUPER_ADMIN") {
          set({ error: "Unauthorized request" });
          return false;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put<CategoryResponse>(`/${id}`, {
            name,
            description,
          });
          const updatedCategory = response.data.data;
          if (updatedCategory) {
            await get().fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm);
            return true;
          }
          set({ isLoading: false, error: "Failed to update category" });
          return false;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to update category"
              : "Failed to update category",
          });
          return false;
        }
      },

      deleteCategory: async (id: string) => {
        const { user } = useAuthStore.getState();
        const { pagination, searchTerm } = get();
        if (user?.role !== "SUPER_ADMIN") {
          set({ error: "Unauthorized request" });
          return false;
        }

        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete<CategoryResponse>(`/${id}`);
          await get().fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm);
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to delete category"
              : "Failed to delete category",
          });
          return false;
        }
      },
    }),
    {
      name: "category-storage",
      partialize: (state) => ({
        categories: state.categories,
        pagination: state.pagination,
        searchTerm: state.searchTerm,
      }),
    }
  )
);
