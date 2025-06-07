"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import {
  FiBell,
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiUserPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAdminNotificationStore } from "@/store/useAdminNotificationStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { debounce } from "lodash";

interface NotificationDetails {
  userId: string;
  userName: string;
  userEmail: string;
  productId?: string;
  productName?: string;
  orderId?: string;
}

const notificationIcons = {
  NEW_ORDER_PLACED: <FiPackage className="text-blue-500" />,
  CART_ITEM_ADDED: <FiShoppingCart className="text-green-500" />,
  CART_ITEM_REMOVED: <FiShoppingCart className="text-red-500" />,
  WISHLIST_ITEM_ADDED: <FiHeart className="text-pink-500" />,
  NEW_USER_REGISTERED: <FiUserPlus className="text-purple-500" />,
};

const notificationMessages = {
  NEW_ORDER_PLACED: (details: NotificationDetails) => (
    <>
      New order placed{" "}
      <Link href={"/super-admin/orders"} className="font-semibold">
        #{details?.orderId}
      </Link>{" "}
      by
      <Link href={`/super-admin/customers/${details.userId}`} className="font-semibold hover:underline">
        {details?.userName || "customer"}
      </Link>
    </>
  ),
  CART_ITEM_ADDED: (details: NotificationDetails) => (
    <>
      <Link href={`/super-admin/customers/${details.userId}`} className="font-semibold hover:underline">
        {details?.userName || "User"}
      </Link>{" "}
      added <span className="font-semibold">{details?.productName || "an item"}</span> to cart
    </>
  ),
  CART_ITEM_REMOVED: (details: NotificationDetails) => (
    <>
      <Link href={`/super-admin/customers/${details.userId}`} className="font-semibold hover:underline">
        {details?.userName || "User"}
      </Link>{" "}
      removed <span className="font-semibold">{details?.productName || "an item"}</span> from cart
    </>
  ),
  WISHLIST_ITEM_ADDED: (details: NotificationDetails) => (
    <>
      <Link href={`/super-admin/customers/${details.userId}`} className="font-semibold hover:underline">
        {details?.userName || "User"}
      </Link>{" "}
      added <span className="font-semibold">{details?.productName || "an item"}</span> to wishlist
    </>
  ),
  NEW_USER_REGISTERED: (details: NotificationDetails) => (
    <>
      New user registered:{" "}
      <Link href={`/super-admin/customers/${details.userId}`} className="font-semibold hover:underline">
        {details?.userName || "Unknown User"}
      </Link>{" "}
      ({details?.userEmail})
    </>
  ),
};

const parseNotificationDetails = (details: string | object): NotificationDetails => {
  try {
    const parsed = typeof details === "string" ? JSON.parse(details) : details;
    return {
      userId: parsed.userId || "",
      userName: parsed.userName || "Unknown User",
      userEmail: parsed.userEmail || "",
      productId: parsed.productId,
      productName: parsed.productName,
      orderId: parsed.orderId,
    };
  } catch (error) {
    console.error("Error parsing notification details:", error);
    return {
      userId: "",
      userName: "Unknown User",
      userEmail: "",
    };
  }
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    pagination,
    searchTerm,
    setPagination,
    setSearchTerm,
  } = useAdminNotificationStore();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Memoize fetch function
  const fetchData = useCallback(() => {
    fetchNotifications(pagination.currentPage, pagination.itemsPerPage, searchTerm);
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, fetchNotifications]);

  // Fetch notifications when pagination or search term changes

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications(pagination.currentPage, pagination.itemsPerPage, searchTerm);
    };

    const debouncedFetch = debounce(fetchData, 300);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, fetchNotifications]);
  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredNotifications =
    activeTab === "unread" ? notifications.filter((notification) => !notification.isRead) : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllNotificationsAsRead();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleClearAllNotifications = async () => {
    setIsClearingAll(true);
    try {
      await clearAllNotifications();
      toast({
        title: "Success",
        description: "All notifications cleared",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
      });
    } finally {
      setIsClearingAll(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ currentPage: newPage });
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination({
      itemsPerPage: newLimit,
      currentPage: 1,
    });
  };

  const handleSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = pagination.totalPages;

    if (pagination.totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      if (pagination.currentPage <= half) {
        endPage = maxVisiblePages;
      } else if (pagination.currentPage >= pagination.totalPages - half) {
        startPage = pagination.totalPages - maxVisiblePages + 1;
      } else {
        startPage = pagination.currentPage - half;
        endPage = pagination.currentPage + half;
      }
    }

    if (startPage > 1) {
      buttons.push(
        <Button key={1} variant="outline" size="sm" className="w-10 h-10 p-0" onClick={() => handlePageChange(1)}>
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="flex items-center px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={pagination.currentPage === i ? "default" : "outline"}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="flex items-center px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={pagination.totalPages}
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => handlePageChange(pagination.totalPages)}
        >
          {pagination.totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <FiBell className="text-blue-500 text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isMarkingAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                unreadCount === 0 || isMarkingAll
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              {isMarkingAll ? (
                "Processing..."
              ) : (
                <>
                  <FiCheckCircle /> Mark all as read
                </>
              )}
            </button>
            <button
              onClick={handleClearAllNotifications}
              disabled={notifications.length === 0 || isClearingAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                notifications.length === 0 || isClearingAll
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
              {isClearingAll ? (
                "Clearing..."
              ) : (
                <>
                  <FiTrash2 /> Clear all
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Input
            placeholder="Search notifications..."
            defaultValue={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            // disabled={}
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="hidden sm:block text-sm text-gray-500">Items per page</span>
            <Select
              value={pagination.itemsPerPage.toString()}
              onValueChange={(value) => handleItemsPerPageChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue placeholder={pagination.itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === "all" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-3 text-center font-medium transition-colors relative ${
                activeTab === "unread"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="absolute top-1 right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isLoading && filteredNotifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
              >
                <p>{error}</p>
              </motion.div>
            )}

            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm"
                  >
                    No {activeTab === "unread" ? "unread" : ""} notifications found
                  </motion.div>
                )}

                {filteredNotifications.map((notification) => {
                  const details = parseNotificationDetails(notification.details);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                        notification.isRead ? "border-transparent" : "border-blue-500"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                            {notificationIcons[notification.type]}
                          </div>
                          <div className="flex-1">
                            <div className={`text-gray-700 ${notification.isRead ? "opacity-80" : "font-medium"}`}>
                              {notificationMessages[notification.type](details)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-500 transition-colors"
                                title="Mark as read"
                              >
                                <FiCheck className="text-sm" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}

        {pagination.totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-500">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems} notifications
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || isLoading}
              >
                <FiChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>

              {renderPaginationButtons()}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || isLoading}
              >
                <FiChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
