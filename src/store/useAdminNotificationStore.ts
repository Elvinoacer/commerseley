import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";

interface AdminNotification {
  id: string;
  adminId: string;
  type:
    | "NEW_ORDER_PLACED"
    | "CART_ITEM_ADDED"
    | "CART_ITEM_REMOVED"
    | "WISHLIST_ITEM_ADDED"
    | "NEW_USER_REGISTERED";
  details: {
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  admin: {
    name: string | null;
    email: string;
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface AdminNotificationState {
  notifications: AdminNotification[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  searchTerm: string;
  fetchNotifications: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  clearAllNotifications: () => Promise<boolean>;
  setPagination: (pagination: Partial<Pagination>) => void;
  setSearchTerm: (term: string) => void;
}

export const useAdminNotificationStore = create<AdminNotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
      searchTerm: "",

      fetchNotifications: async (page = 1, limit = 10, search = "") => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(
            `${API_ROUTES.ADMIN}/notifications`,
            {
              params: { page, limit, search },
              withCredentials: true,
            }
          );
          set({
            notifications: response.data.data,
            pagination: response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalItems: 0,
              itemsPerPage: limit,
            },
            isLoading: false,
          });
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message || "Failed to fetch notifications";
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      markNotificationAsRead: async (notificationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(
            `${API_ROUTES.ADMIN}/notifications/${notificationId}/read`,
            {},
            { withCredentials: true }
          );
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, isRead: true }
                : notification
            ),
            isLoading: false,
          }));
          return response.data.success;
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message || "Failed to mark notification as read";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      markAllNotificationsAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(
            `${API_ROUTES.ADMIN}/notifications/read-all`,
            {},
            { withCredentials: true }
          );
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              isRead: true,
            })),
            isLoading: false,
          }));
          return response.data.success;
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message ||
            "Failed to mark all notifications as read";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      deleteNotification: async (notificationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.delete(
            `${API_ROUTES.ADMIN}/notifications/${notificationId}/read`,
            {
              withCredentials: true,
            }
          );
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== notificationId
            ),
            isLoading: false,
          }));
          return response.data.success;
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message || "Failed to delete notification";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      clearAllNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.delete(
            `${API_ROUTES.ADMIN}/clear-notifications`,
            { withCredentials: true }
          );
          set({
            notifications: [],
            isLoading: false,
          });
          return response.data.success;
        } catch (e: any) {
          const errorMessage =
            e.response?.data?.message || "Failed to clear all notifications";
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      setPagination: (pagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        }));
      },

      setSearchTerm: (term) => {
        set({
          searchTerm: term,
          pagination: { ...get().pagination, currentPage: 1 },
        });
      },
    }),
    {
      name: "admin-notification-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        pagination: state.pagination,
        searchTerm: state.searchTerm,
      }),
    }
  )
);
