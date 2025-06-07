import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { persist } from "zustand/middleware";

export interface AnalyticsResponse {
  users: {
    total: number;
    newUsers: number;
    byRole: { role: string; count: number }[];
  };
  orders: {
    total: number;
    revenue: number;
    averageOrderValue: number;
    byStatus: { status: string; count: number }[];
    byPaymentMethod: { method: string; count: number }[];
  };
  products: {
    total: number;
    lowStock: number;
    topSelling: { id: string; name: string; soldCount: number }[];
  };
  categories: {
    total: number;
    byCategory: { id: string; name: string; productCount: number }[];
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
}

interface AnalyticsStore {
  analytics: AnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  lastFetched: number | null;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      analytics: null,
      isLoading: false,
      error: null,
      lastFetched: null,
      fetchAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(API_ROUTES.ANALYTICS, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          set({
            analytics: response.data,
            isLoading: false,
            lastFetched: Date.now(),
          });
        } catch (e) {
          set({
            isLoading: false,
            error: "Failed to fetch analytics data",
            lastFetched: null,
          });
        }
      },
    }),
    {
      name: "analytics-storage", // unique name for localStorage
      partialize: (state) => ({
        analytics: state.analytics,
        lastFetched: state.lastFetched,
      }), // only persist these values
    }
  )
);
