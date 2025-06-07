import { UserWithOrders, UserWithRelations } from "@/types";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

type CustomerStore = {
  customers: UserWithOrders[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  getAllCustomers: (page?: number, limit?: number) => Promise<UserWithOrders[] | null>;
  getCustomerById: (
    customerId: string
  ) => Promise<{ success: boolean; message: string; data: UserWithRelations } | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>;
  setPagination: (pagination: Partial<Pagination>) => void;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.CUSTOMER,
  withCredentials: true,
});

export const useCustomersStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },

      getAllCustomers: async (page = 1, limit = 10) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get<{
            success: boolean;
            data: UserWithOrders[];
            pagination: Pagination;
          }>(`/get-customers?page=${page}&limit=${limit}`);

          if (!response.data.success) {
            throw new Error("Failed to fetch customers");
          }

          set({
            customers: response.data.data,
            isLoading: false,
            pagination: response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalItems: 0,
              itemsPerPage: limit,
            },
          });
          return response.data.data;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch customers"
            : error instanceof Error
            ? error.message
            : "Failed to fetch customers";

          set({ isLoading: false, error: errorMessage });
          return null;
        }
      },
      getCustomerById: async (customerId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get<{ success: boolean; message: string; data: UserWithRelations }>(
            `/${customerId}`
          );

          if (!response.data.success) {
            throw new Error("Failed to fetch customer");
          }

          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch customer"
            : error instanceof Error
            ? error.message
            : "Failed to fetch customer";

          set({ isLoading: false, error: errorMessage });
          return null;
        }
      },
      deleteCustomer: async (customerId: string) => {
        try {
          const { user } = useAuthStore.getState();
          if (!user || user.role !== "SUPER_ADMIN") {
            throw new Error("Unauthorized request");
          }

          set({ isLoading: true, error: null });
          const response = await axiosInstance.delete<{ success: boolean; message: string }>(`/${customerId}`);

          if (!response.data.success) {
            throw new Error("Failed to delete customer");
          }

          set({
            customers: get().customers.filter((customer) => customer.id !== customerId),
            isLoading: false,
          });
          return true;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to delete customer"
            : error instanceof Error
            ? error.message
            : "Failed to delete customer";

          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },
      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),
    }),
    {
      name: "customer-storage",
      partialize: (state) => ({
        customers: state.customers,
        pagination: state.pagination,
      }),
    }
  )
);
