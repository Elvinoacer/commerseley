"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SuperAdminCouponsListingPage() {
  const { isLoading, couponList, fetchCoupons, deleteCoupon, pagination, setPagination } = useCouponStore();
  const router = useRouter();
  const fetchCouponRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!fetchCouponRef.current) {
      fetchCoupons(pagination.currentPage, pagination.itemsPerPage);
      fetchCouponRef.current = true;
    }
  }, [fetchCoupons, pagination.currentPage, pagination.itemsPerPage]);

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const result = await deleteCoupon(id);
      if (result) {
        toast({
          title: "Coupon deleted successfully",
        });
      }
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
      currentPage: 1, // Reset to first page when changing items per page
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
          className="w-10 h-10 p-0 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800"
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
      <div className="p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">All Coupons</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Items per page</span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) => handleItemsPerPageChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[80px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                  <SelectValue placeholder={pagination.itemsPerPage} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-800 focus:bg-indigo-100 dark:focus:bg-indigo-800"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => router.push("/super-admin/coupons/add")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 dark:hover:from-purple-600 hover:to-indigo-700 dark:hover:to-indigo-600 text-white"
              aria-label="Add new coupon"
            >
              Add New Coupon
            </Button>
          </div>
        </header>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 shadow-md backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">Code</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">Discount</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">Usage</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">Start Date</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">End Date</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">Status</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-[300px] text-gray-600 dark:text-gray-300">
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                couponList.map((coupon) => (
                  <TableRow key={coupon.id} className="hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors">
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{coupon.code}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{coupon.discountPercent}%</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {coupon.usageCount}/{coupon.usageLimit}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {format(new Date(coupon.startDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {format(new Date(coupon.endDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        // This conditional styling was incorrect.
                        // It tried to put a ternary operator inside a template literal for the className.
                        // The `variant` prop of the Badge component is a better place for conditional styling based on status.
                        variant={new Date() < new Date(coupon.endDate) ? "default" : "destructive"}
                        className={
                          new Date() < new Date(coupon.endDate) // Check if the coupon is active
                            ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-400 text-red-800 dark:text-red-200"
                        }
                      >
                        {new Date() < new Date(coupon.endDate) ? "Active" : "Expired"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-transparent"
                        aria-label={`Delete coupon ${coupon.code}`}
                      >
                        <Trash2 className="h-4 w-4" />
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems} coupons
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              {renderPaginationButtons()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminCouponsListingPage;
