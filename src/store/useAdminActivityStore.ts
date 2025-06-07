// src/store/useAdminActivityStore.ts
import { AdminActivity } from "@/types";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminActivityStore = {
  activities: AdminActivity[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  fetchActivities: (page?: number, search?: string) => Promise<void>;
  clearActivities: () => void;
  setSearchQuery: (query: string) => void;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.ADMIN_ACTIVITIES,
  withCredentials: true,
});

export const useAdminActivityStore = create<AdminActivityStore>()(
  persist(
    (set) => ({
      activities: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      searchQuery: "",
      fetchActivities: async (page = 1, search = "") => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/recent-activities", {
            params: {
              page,
              search,
            },
          });
          if (response.data.success) {
            set({
              activities: response.data.activities,
              currentPage: response.data.currentPage,
              totalPages: response.data.totalPages,
              isLoading: false,
            });
          } else {
            set({ isLoading: false, error: "Failed to fetch activities" });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to fetch activities"
              : "Failed to fetch activities",
          });
        }
      },
      clearActivities: () => {
        set({ activities: [], error: null });
      },
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
    }),
    {
      name: "admin-activity-storage",
    }
  )
);
