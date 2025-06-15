"use client";

import CustomerTable from "@/components/super-admin/CustomerTable";
import SearchFilter from "@/components/super-admin/SearchFilter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomersStore } from "@/store/useCustomerStore";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function CustomersPage() {
  const {
    customers: storeCustomers,
    getAllCustomers,
    isLoading,
    error: storeError,
    pagination,
    setPagination,
  } = useCustomersStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        await getAllCustomers(pagination.currentPage, pagination.itemsPerPage);
        setLocalError(null);
      } catch (err) {
        setLocalError("Failed to fetch customers");
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchCustomers();
  }, [getAllCustomers, pagination.currentPage, pagination.itemsPerPage]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return storeCustomers;

    const searchTermLower = searchTerm.toLowerCase();
    return storeCustomers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTermLower) || customer.email.toLowerCase().includes(searchTermLower)
    );
  }, [storeCustomers, searchTerm]);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

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
    const maxVisiblePages = 3; // Reduced for mobile
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
          className={`w-8 h-8 md:w-10 md:h-10 p-0 ${
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

    return buttons;
  };

  const error = storeError || localError;

  if (isInitialLoad || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-400 text-red-700 dark:text-red-200 rounded-lg max-w-md mx-auto mt-8">
        <p className="text-sm md:text-base">Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-500 dark:bg-red-400 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 text-sm md:text-base"
          aria-label="Retry loading customers"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
              Customers
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
              Manage your e-commerce customers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-full sm:w-auto">
              <SearchFilter onSearch={handleSearch} />
            </div>
            <div className="flex justify-end items-center gap-2 w-full sm:w-auto">
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Items per page
              </span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) => handleItemsPerPageChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px] md:w-[80px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                  <SelectValue placeholder={pagination.itemsPerPage} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-xs md:text-sm">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="hover:bg-indigo-50 dark:hover:bg-indigo-900"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <CustomerTable customers={filteredCustomers} />
          </div>

          {/* Pagination Controls */}
          {pagination.totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 mt-4 md:mt-6">
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} customers
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 p-0"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 p-0"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
