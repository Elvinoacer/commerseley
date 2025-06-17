import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod: "CREDIT_CARD" | "CASH_ON_DELIVERY" | "MPESA";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod: "CREDIT_CARD" | "CASH_ON_DELIVERY" | "MPESA";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateOrderData {
  userId: string;
  addressId: string;
  items: Omit<OrderItem, "id">[];
  couponId?: string;
  total: number;
  paymentMethod: "CREDIT_CARD" | "CASH_ON_DELIVERY" | "MPESA";
  paymentStatus?: "PENDING" | "COMPLETED";
  paymentId?: string;
  email?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface CODStats {
  totalCODOrders: number;
  codUsageRate: number;
  avgCODOrderValue: number;
}

interface OrderStore {
  currentOrder: Order | null;
  isLoading: boolean;
  isPaymentProcessing: boolean;
  userOrders: Order[];
  adminOrders: AdminOrder[];
  error: string | null;
  isCashOnDeliveryEnabled: boolean;
  pagination: Pagination;
  codStats: CODStats | null;
  fetchCashOnDeliverySetting: () => Promise<boolean>;
  updateCashOnDeliverySetting: (enabled: boolean) => Promise<boolean>;
  fetchCODStats: () => Promise<CODStats | null>;
  createFinalOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  getOrder: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<boolean>;
  getAllOrders: (page?: number, limit?: number) => Promise<AdminOrder[] | null>;
  getOrdersByUserId: () => Promise<Order[] | null>;
  setCurrentOrder: (order: Order | null) => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  initiatePayment: (paymentData: {
    orderId: string;
    email: string;
    amount: number;
    firstName: string;
    lastName: string;
    redirectUrl: string;
  }) => Promise<string | null>;
}

const axiosInstance = axios.create({
  baseURL: API_ROUTES.ORDER,
  withCredentials: true,
});

export const useOrderStore = create<OrderStore>((set, get) => ({
  currentOrder: null,
  isLoading: true,
  error: null,
  isPaymentProcessing: false,
  userOrders: [],
  adminOrders: [],
  isCashOnDeliveryEnabled: true,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  codStats: null,

  fetchCashOnDeliverySetting: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ADMIN_SETTINGS}/cash-on-delivery`, {
        withCredentials: true,
      });
      set({
        isLoading: false,
        isCashOnDeliveryEnabled: response.data.data.isCashOnDelivery,
      });
      return response.data.data.isCashOnDelivery;
    } catch (error) {
      set({ error: "Failed to fetch COD setting", isLoading: false });
      return false;
    }
  },

  updateCashOnDeliverySetting: async (enabled: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.ADMIN_SETTINGS}/cash-on-delivery`,
        { isCashOnDelivery: enabled },
        { withCredentials: true }
      );
      set({
        isLoading: false,
        isCashOnDeliveryEnabled: response.data.data.isCashOnDelivery,
      });
      return response.data.success;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update COD setting",
        isLoading: false,
      });
      return false;
    }
  },

  fetchCODStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<{ success: boolean; data: CODStats }>("/cod-stats");
      if (!response.data.success) {
        throw new Error("Failed to fetch COD statistics");
      }
      set({ isLoading: false, codStats: response.data.data });
      return response.data.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch COD statistics",
        isLoading: false,
      });
      return null;
    }
  },

  initiatePayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_ROUTES.ORDER}/initiate-payment`, paymentData, { withCredentials: true });
      set({ isLoading: false });
      return response.data.paymentUrl;
    } catch (error) {
      set({ error: "Failed to initiate payment", isLoading: false });
      return null;
    }
  },

  createFinalOrder: async (orderData) => {
    set({ isLoading: true, error: null, isPaymentProcessing: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/create-final-order`,
        {
          ...orderData,
          paymentStatus: orderData.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "COMPLETED",
        },
        { withCredentials: true }
      );
      set({
        isLoading: false,
        currentOrder: response.data,
        isPaymentProcessing: false,
      });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create order",
        isLoading: false,
        isPaymentProcessing: false,
      });
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    const { pagination } = get();
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_ROUTES.ORDER}/${orderId}/status`, { status }, { withCredentials: true });
      set((state) => ({
        currentOrder:
          state.currentOrder && state.currentOrder.id === orderId
            ? { ...state.currentOrder, status }
            : state.currentOrder,
        isLoading: false,
        adminOrders: state.adminOrders.map((item) => (item.id === orderId ? { ...item, status } : item)),
      }));
      await get().getAllOrders(pagination.currentPage, pagination.itemsPerPage);
      return true;
    } catch (error) {
      set({ error: "Failed to update order status", isLoading: false });
      return false;
    }
  },

  getAllOrders: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ORDER}/get-all-orders-for-admin?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      set({
        isLoading: false,
        adminOrders: response.data.data,
        pagination: {
          currentPage: page,
          totalPages: response.data.pagination?.totalPages || 1,
          totalItems: response.data.pagination?.totalItems || 0,
          itemsPerPage: limit,
        },
      });
      return response.data.data;
    } catch (error) {
      set({ error: "Failed to fetch all orders for admin", isLoading: false });
      return null;
    }
  },

  getOrdersByUserId: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ORDER}/get-order-by-user-id`, { withCredentials: true });
      set({ isLoading: false, userOrders: response.data });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch user orders", isLoading: false });
      return null;
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),

  getOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ORDER}/get-single-order/${orderId}`, { withCredentials: true });
      set({ isLoading: false, currentOrder: response.data });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch order", isLoading: false });
      return null;
    }
  },

  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
}));
