import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { Review, ReviewResponse, ReviewsResponse } from "@/types";
import { useAuthStore } from "./useAuthStore";

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchReviewsByProduct: (productId: string) => Promise<void>;
  fetchReviewById: (id: string) => Promise<Review | null>;
  createReview: (productId: string, rating: number, comment?: string) => Promise<string | null>;
  updateReview: (id: string, rating: number, comment?: string) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
}

const axiosInstance = axios.create({
  baseURL: API_ROUTES.REVIEWS,
  withCredentials: true,
});

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      isLoading: false,
      error: null,
      fetchReviewsByProduct: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<ReviewsResponse>(`/product/${productId}`);
          set({ reviews: response.data || [], isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to fetch reviews"
              : "Failed to fetch reviews",
          });
        }
      },
      fetchReviewById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<ReviewResponse>(`/${id}`);
          const review = response.data.data || null;
          if (review) {
            set({
              reviews: [...get().reviews.filter((r) => r.id !== id), review],
              isLoading: false,
            });
            return review;
          }
          set({ isLoading: false, error: "Review not found" });
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to fetch review"
              : "Failed to fetch review",
          });
          return null;
        }
      },
      createReview: async (productId: string, rating: number, comment?: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "Unauthorized request" });
          return null;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post<ReviewResponse>("/", {
            productId,
            rating,
            comment,
          });
          const review = response.data;
          if (review) {
            set({
              reviews: [...get().reviews, review],
              isLoading: false,
            });
            return review.id;
          }
          set({ isLoading: false, error: "Failed to create review" });
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to create review"
              : "Failed to create review",
          });
          return null;
        }
      },
      updateReview: async (id: string, rating: number, comment?: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "Unauthorized request" });
          return false;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put<ReviewResponse>(`/${id}`, {
            rating,
            comment,
          });
          const updatedReview = response.data;
          if (updatedReview) {
            set({
              reviews: get().reviews.map((r) => (r.id === id ? updatedReview : r)),
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false, error: "Failed to update review" });
          return false;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to update review"
              : "Failed to update review",
          });
          return false;
        }
      },
      deleteReview: async (id: string) => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ error: "Unauthorized request" });
          return false;
        }

        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete<ReviewResponse>(`/${id}`);
          set({
            reviews: get().reviews.filter((r) => r.id !== id),
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to delete review"
              : "Failed to delete review",
          });
          return false;
        }
      },
    }),
    {
      name: "review-storage",
      partialize: (state) => ({ reviews: state.reviews }),
    }
  )
);
