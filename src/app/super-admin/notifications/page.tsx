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
  NEW_ORDER_PLACED: <FiPackage className="text-blue-500 dark:text-blue-400" />,
  CART_ITEM_ADDED: <FiShoppingCart className="text-green-500 dark:text-green-400" />,
  CART_ITEM_REMOVED: <FiShoppingCart className="text-red-500 dark:text-red-400" />,
  WISHLIST_ITEM_ADDED: <FiHeart className="text-pink-500 dark:text-pink-400" />,
  NEW_USER_REGISTERED: <FiUserPlus className="text-purple-500 dark:text-purple-400" />,
};

const notificationMessages = {
  NEW_ORDER_PLACED: (details: NotificationDetails) => (
    <>
      New order placed{" "}
      <Link href={"/super-admin/orders"} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
        #{details?.orderId}
      </Link>{" "}
      by
      <Link
        href={`/super-admin/customers/${details.userId}`}
        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        {details?.userName || "customer"}
      </Link>
    </>
  ),
  CART_ITEM_ADDED: (details: NotificationDetails) => (
    <>
      <Link
        href={`/super-admin/customers/${details.userId}`}
        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        {details?.userName || "User"}
      </Link>{" "}
      added <span className="font-semibold text-gray-900 dark:text-gray-100">{details?.productName || "an item"}</span>{" "}
      to cart
    </>
  ),
  CART_ITEM_REMOVED: (details: NotificationDetails) => (
    <>
      <Link
        href={`/super-admin/customers/${details.userId}`}
        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        {details?.userName || "User"}
      </Link>{" "}
      removed{" "}
      <span className="font-semibold text-gray-900 dark:text-gray-100">{details?.productName || "an item"}</span> from
      cart
    </>
  ),
  WISHLIST_ITEM_ADDED: (details: NotificationDetails) => (
    <>
      <Link
        href={`/super-admin/customers/${details.userId}`}
        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        {details?.userName || "User"}
      </Link>{" "}
      added <span className="font-semibold text-gray-900 dark:text-gray-100">{details?.productName || "an item"}</span>{" "}
      to wishlist
    </>
  ),
  NEW_USER_REGISTERED: (details: NotificationDetails) => (
    <>
      New user registered:{" "}
      <Link
        href={`/super-admin/customers/${details.userId}`}
        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
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
        <Button
          key={1}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 text-xs sm:w-10 sm:h-10 sm:text-sm text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
          onClick={() => handlePageChange(1)}
          aria-label="Page 1"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span
            key="start-ellipsis"
            className="flex items-center px-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
          >
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
          className={`w-8 h-8 p-0 text-xs sm:w-10 sm:h-10 sm:text-sm ${
            pagination.currentPage === i
              ? "bg-indigo-600 dark:bg-indigo-500 text-white"
              : "text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
          }`}
          onClick={() => handlePageChange(i)}
          aria-label={`Page ${i}`}
        >
          {i}
        </Button>
      );
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(
          <span
            key="end-ellipsis"
            className="flex items-center px-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
          >
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={pagination.totalPages}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 text-xs sm:w-10 sm:h-10 sm:text-sm text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
          onClick={() => handlePageChange(pagination.totalPages)}
          aria-label={`Page ${pagination.totalPages}`}
        >
          {pagination.totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/50 dark:to-purple-900/50">
                <FiBell className="text-indigo-500 dark:text-indigo-400 text-lg sm:text-xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 dark:bg-red-400 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || isMarkingAll}
                className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  unreadCount === 0 || isMarkingAll
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                }`}
                aria-label="Mark all notifications as read"
              >
                {isMarkingAll ? (
                  "Processing..."
                ) : (
                  <>
                    <FiCheckCircle className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Mark all as read</span>
                    <span className="sm:hidden">Mark all</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleClearAllNotifications}
                disabled={notifications.length === 0 || isClearingAll}
                className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  notifications.length === 0 || isClearingAll
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                }`}
                aria-label="Clear all notifications"
              >
                {isClearingAll ? (
                  "Clearing..."
                ) : (
                  <>
                    <FiTrash2 className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">Clear all</span>
                    <span className="sm:hidden">Clear</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Input
              placeholder="Search notifications..."
              defaultValue={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-64 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base h-9 sm:h-10"
              aria-label="Search notifications"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">Items per page</span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) => handleItemsPerPageChange(Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger className="h-8 w-[70px] sm:w-[80px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                  <SelectValue placeholder={pagination.itemsPerPage} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  {[10, 20, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-xs sm:text-sm"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm overflow-hidden mb-4 sm:mb-6 border border-gray-200 dark:border-gray-600">
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base ${
                  activeTab === "all"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 dark:border-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                aria-label="View all notifications"
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`flex-1 py-2 sm:py-3 text-center font-medium transition-colors relative text-sm sm:text-base ${
                  activeTab === "unread"
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 dark:border-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                aria-label="View unread notifications"
              >
                Unread
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-2 sm:right-4 bg-red-500 dark:bg-red-400 text-white text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {isLoading && filteredNotifications.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200 p-3 sm:p-4 mb-4 sm:mb-6 rounded text-sm sm:text-base"
                >
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="space-y-2 sm:space-y-3">
                <AnimatePresence>
                  {filteredNotifications.length === 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 sm:py-12 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 text-sm sm:text-base"
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
                        className={`bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm overflow-hidden border-l-4 ${
                          notification.isRead ? "border-transparent" : "border-indigo-500 dark:border-indigo-400"
                        } border border-gray-200 dark:border-gray-600`}
                      >
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/50 dark:to-purple-900/50">
                              {notificationIcons[notification.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-gray-900 dark:text-gray-100 text-sm sm:text-base ${
                                  notification.isRead ? "opacity-80" : "font-medium"
                                }`}
                              >
                                {notificationMessages[notification.type](details)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                })}
                              </div>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                                  title="Mark as read"
                                  aria-label="Mark notification as read"
                                >
                                  <FiCheck className="text-xs sm:text-sm" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                title="Delete"
                                aria-label="Delete notification"
                              >
                                <FiTrash2 className="text-xs sm:text-sm" />
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} notifications
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || isLoading}
                  className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 p-0 sm:h-9 sm:w-9"
                  aria-label="Previous page"
                >
                  <FiChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">Previous</span>
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                  className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 p-0 sm:h-9 sm:w-9"
                  aria-label="Next page"
                >
                  <FiChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
