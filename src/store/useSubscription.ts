import { Subscription } from "@/types";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

type SubscriptionStore = {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  currentSubscription: Subscription | null;

  // Subscribe with email or notification token
  subscribe: (
    email?: string,
    notificationToken?: string
  ) => Promise<{
    success: boolean;
    message?: string;
    subscription?: Subscription;
    error?: string;
  }>;

  // Unsubscribe with email or notification token
  unsubscribe: (
    email?: string,
    notificationToken?: string
  ) => Promise<{
    success: boolean;
    message?: string;
    subscription?: Subscription;
    error?: string;
  }>;

  // Get all active subscriptions
  getAllSubscriptions: () => Promise<{
    success: boolean;
    subscriptions?: Subscription[];
    error?: string;
  }>;

  // Get subscription by email or token
  getSubscription: (
    email?: string,
    notificationToken?: string
  ) => Promise<{
    success: boolean;
    subscription?: Subscription;
    error?: string;
  }>;

  clearError: () => void;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.SUBSCRIPTIONS,
  withCredentials: true,
});

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  currentSubscription: null,

  subscribe: async (email, notificationToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/subscribe", {
        email,
        notificationToken,
      });

      set({
        isLoading: false,
        currentSubscription: response.data.subscription,
      });
      return {
        success: true,
        message: response.data.message,
        subscription: response.data.subscription,
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error?.response?.data?.error || "Subscription failed"
        : "Subscription failed";

      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  unsubscribe: async (email, notificationToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/unsubscribe", {
        email,
        notificationToken,
      });

      set({
        isLoading: false,
        currentSubscription: response.data.subscription,
      });
      return {
        success: true,
        message: response.data.message,
        subscription: response.data.subscription,
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error?.response?.data?.error || "Unsubscription failed"
        : "Unsubscription failed";

      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  getAllSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/");

      set({
        isLoading: false,
        subscriptions: response.data,
      });
      return { success: true, subscriptions: response.data };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error?.response?.data?.error || "Failed to fetch subscriptions"
        : "Failed to fetch subscriptions";

      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  getSubscription: async (email, notificationToken) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (notificationToken) params.append("notificationToken", notificationToken);

      const response = await axiosInstance.get("/subscription", { params });

      set({
        isLoading: false,
        currentSubscription: response.data,
      });
      return { success: true, subscription: response.data };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error?.response?.data?.error || "Failed to fetch subscription"
        : "Failed to fetch subscription";

      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));
