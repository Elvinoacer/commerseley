import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface CouponStore {
  couponList: Coupon[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchCoupons: (page?: number, limit?: number) => Promise<void>;
  createCoupon: (coupon: Omit<Coupon, "id" | "usageCount">) => Promise<Coupon | null>;
  deleteCoupon: (id: string) => Promise<boolean>;
  setPagination: (pagination: Partial<Pagination>) => void;
}

export const useCouponStore = create<CouponStore>((set, get) => ({
  couponList: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },

  fetchCoupons: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.COUPON}/fetch-all-coupons?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      set({
        couponList: response.data.couponList,
        isLoading: false,
        pagination: response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
      });
    } catch (e) {
      set({ isLoading: false, error: "Failed to fetch coupons" });
    }
  },

  createCoupon: async (coupon) => {
    const { pagination } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_ROUTES.COUPON}/create-coupon`, coupon, { withCredentials: true });
      // Refresh current page after creation
      await get().fetchCoupons(pagination.currentPage, pagination.itemsPerPage);
      return response.data.coupon;
    } catch (e) {
      set({ isLoading: false, error: "Failed to create coupon" });
      return null;
    }
  },

  deleteCoupon: async (id: string) => {
    const { pagination } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.COUPON}/${id}`, {
        withCredentials: true,
      });
      // Refresh current page after deletion
      await get().fetchCoupons(pagination.currentPage, pagination.itemsPerPage);
      return response.data.success;
    } catch (error) {
      set({ isLoading: false, error: "Failed to delete coupon" });
      return false;
    }
  },

  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
}));
