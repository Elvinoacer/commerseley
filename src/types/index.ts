// src/types/user.ts
export type User = {
  id: string;
  name?: string | null;
  email: string;
  password: string;
  role: "USER" | "SUPER_ADMIN";
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string | null;
};

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  couponId: string | null;
  email: string | null;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod: "CREDIT_CARD" | "CASH_ON_DELIVERY";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  size: string | null;
  orderImages: string[];
  color: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  size: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
}

export type WishlistResponse = {
  id: string;
  userId: string;
  // Since 'product' is included, it will be an array of product objects
  product: {
    id: string;
    name: string;
    brand: string;
    description: string;
    categoryId: string;
    gender: string;
    sizes: string[];
    colors: string[];
    price: number;
    stock: number;
    soldCount: number;
    rating: number | null;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    isFeatured: boolean;
  }[];
};

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types for responses
export interface UserWithRelations extends User {
  orders: (Order & {
    items: OrderItem[];
    address: Address;
    coupon?: Coupon;
  })[];
  addresses: Address[];
  cart?: Cart & {
    items: (CartItem & {
      product: Product;
    })[];
  };
  wishlist?: (Wishlist & {
    product: Product;
  })[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type UserWithOrders = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  createdAt: string; // Using string as per your JSON data format for dates
  updatedAt: string; // Using string as per your JSON data format for dates
  refreshToken: string | null;
  orders: Order[];
};

// Types for Category responses
export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  products?: { id: string; name: string; images: string[] }[]; // Included in getCategories and getCategoryById
}

export interface CategoryResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: Category;
}

export interface CategoriesResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: Category[];
}

// Types for Review responses
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string | null }; // Included in responses
  product?: { id: string; name: string }; // Included in responses
}

export interface ReviewResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: Review;
}

export interface ReviewsResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: Review[];
}

// Type for Product (used in getProductsForClient response)
export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string;
  category: { id: string; name: string };
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  soldCount: number;
  rating: number | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  reviews?: Review[];
}

// Type for getProductsForClient response
export interface ProductsResponse {
  success: boolean;
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export type AdminActivity = {
  id: string;
  adminId: string;
  admin: { id: string; name: string | null };
  action:
    | "ADDED_PRODUCT"
    | "ADDED_COLLECTION"
    | "REMOVED_CATEGORY"
    | "UPDATED_CATEGORY"
    | "DELETED_PRODUCTS"
    | "OUT_OF_STOCK";
  details: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
};

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
