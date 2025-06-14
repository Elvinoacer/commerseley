"use client";

import CategoriesTable from "@/components/super-admin/categories/CategoriesTable";
import CreateCategoryModal from "@/components/super-admin/categories/CreateCategoryModal";
import SearchFilter from "@/components/super-admin/SearchFilter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryStore } from "@/store/useCategories";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const { categories, isLoading, error, fetchCategories, pagination, setPagination, searchTerm, setSearchTerm } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm);
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ currentPage: newPage });
    }
  };

  const handleItemsPerPageChange = useCallback((newLimit: number) => {
    setPagination({
      itemsPerPage: newLimit,
      currentPage: 1,
    });
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

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

    // Button styling classes
    const baseButtonClass = "w-10 h-10 p-0";
    const activeButtonClass = "bg-primary text-primary-foreground hover:bg-primary/90";
    const inactiveButtonClass = cn(
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      "text-foreground" // Using semantic foreground color
    );
    const ellipsisClass = "flex items-center px-2 text-muted-foreground";

    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          className={cn(baseButtonClass, inactiveButtonClass)}
          onClick={() => handlePageChange(1)}
          aria-label="Go to first page"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className={ellipsisClass}>
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
          className={cn(baseButtonClass, pagination.currentPage === i ? activeButtonClass : inactiveButtonClass)}
          onClick={() => handlePageChange(i)}
          aria-label={`Go to page ${i}`}
          aria-current={pagination.currentPage === i ? "page" : undefined}
        >
          {i}
        </Button>
      );
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className={ellipsisClass}>
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={pagination.totalPages}
          variant="outline"
          size="sm"
          className={cn(baseButtonClass, inactiveButtonClass)}
          onClick={() => handlePageChange(pagination.totalPages)}
          aria-label="Go to last page"
        >
          {pagination.totalPages}
        </Button>
      );
    }

    return buttons;
  };
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col gap-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage your product categories</p>
            </div>
            <CreateCategoryModal>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 dark:hover:from-purple-600 hover:to-indigo-700 dark:hover:to-indigo-600 text-white"
                aria-label="Add new category"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CreateCategoryModal>
          </header>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-[300px]">
              <SearchFilter
                onSearch={handleSearch}
                placeholder="Search categories..."
                defaultValue={searchTerm}
                isLoading={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Items per page</span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) => handleItemsPerPageChange(Number(value))}
                disabled={isLoading}
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
          </div>

          <AnimatePresence mode="wait">
            {isLoading && categories.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Skeleton className="h-10 w-full rounded-lg" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 shadow-md backdrop-blur-sm overflow-hidden"
              >
                <CategoriesTable
                  categories={categories}
                  isLoading={isLoading}
                  onCategoryUpdated={() => fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {pagination.totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} categories
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || isLoading}
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
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
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
      </motion.div>
    </div>
  );
}
