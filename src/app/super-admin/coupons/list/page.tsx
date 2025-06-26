"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function SuperAdminCouponsListingPage() {
  const { isLoading, couponList, fetchCoupons, deleteCoupon, pagination, setPagination } = useCouponStore();
  const router = useRouter();
  const fetchCouponRef = useRef(false);
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!fetchCouponRef.current) {
      fetchCoupons(pagination.currentPage, pagination.itemsPerPage);
      fetchCouponRef.current = true;
    }
  }, [fetchCoupons, pagination.currentPage, pagination.itemsPerPage]);

  async function handleDeleteCoupon(id: string) {
    setCouponToDelete(id);
    setShowDeleteModal(true);
  }

  async function confirmDeleteCoupon() {
    if (couponToDelete) {
      const result = await deleteCoupon(couponToDelete);
      if (result) {
        toast({
          title: "Coupon deleted successfully",
        });
      }
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  }

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

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (pagination.totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = pagination.totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (pagination.currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (pagination.currentPage + maxPagesAfterCurrent >= pagination.totalPages) {
        startPage = pagination.totalPages - maxVisiblePages + 1;
        endPage = pagination.totalPages;
      } else {
        startPage = pagination.currentPage - maxPagesBeforeCurrent;
        endPage = pagination.currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={pagination.currentPage === i ? "default" : "outline"}
          size="sm"
          className={`
            w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm
            ${
              pagination.currentPage === i
                ? "text-white dark:text-gray-900 bg-blue-600 dark:bg-blue-300"
                : "text-gray-800 dark:text-gray-100"
            }
            border-gray-200 dark:border-gray-600
            hover:bg-indigo-100 dark:hover:bg-indigo-800
          `}
          onClick={() => handlePageChange(i)}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  if (isLoading && couponList.length === 0) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
      <div className="flex flex-col gap-4 sm:gap-6 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">All Coupons</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex justify-end items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Items per page</span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) => handleItemsPerPageChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px] sm:w-[80px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-xs sm:text-sm">
                  <SelectValue placeholder={pagination.itemsPerPage} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-800 focus:bg-indigo-100 dark:focus:bg-indigo-800"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => router.push("/super-admin/coupons/add")}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 dark:hover:from-purple-600 hover:to-indigo-700 dark:hover:to-indigo-600 text-white text-xs sm:text-sm py-1.5 sm:py-2"
              aria-label="Add new coupon"
            >
              Add New Coupon
            </Button>
          </div>
        </header>

        <div className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 shadow-sm sm:shadow-md backdrop-blur-sm overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  Code
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  Discount
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  Usage
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  Start Date
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  End Date
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  Status
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold px-3 sm:px-4 py-2 sm:py-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-[200px] sm:h-[300px] text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                  >
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                couponList.map((coupon) => (
                  <TableRow key={coupon.id} className="hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors">
                    <TableCell className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 sm:py-3">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3">
                      {coupon.discountPercent}%
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3">
                      {coupon.usageCount}/{coupon.usageLimit}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3">
                      {format(new Date(coupon.startDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3">
                      {format(new Date(coupon.endDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-2 sm:py-3">
                      <Badge
                        variant={new Date() < new Date(coupon.endDate) ? "default" : "destructive"}
                        className="text-xs sm:text-sm"
                      >
                        {new Date() < new Date(coupon.endDate) ? "Active" : "Expired"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-2 sm:py-3">
                      <Button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-transparent h-6 w-6 sm:h-8 sm:w-8 p-0"
                        aria-label={`Delete coupon ${coupon.code}`}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-100">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems} coupons
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800 h-8 w-8 sm:h-9 sm:w-9 p-0"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              {renderPaginationButtons()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800 h-8 w-8 sm:h-9 sm:w-9 p-0"
                aria-label="Next page"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <>
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowDeleteModal(false)}
              />
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Delete</h2>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete this coupon? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(false)}
                      className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDeleteCoupon}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                    >
                      Delete Coupon
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SuperAdminCouponsListingPage;
