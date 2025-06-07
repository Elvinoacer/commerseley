"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import CategoriesTable from "@/components/super-admin/categories/CategoriesTable";
import CreateCategoryModal from "@/components/super-admin/categories/CreateCategoryModal";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useCategoryStore } from "@/store/useCategories";
import SearchFilter from "@/components/super-admin/SearchFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { categories, isLoading, error, fetchCategories, pagination, setPagination, searchTerm, setSearchTerm } =
    useCategoryStore();

  // Fetch data when pagination or searchTerm changes
  useEffect(() => {
    fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm);
    // We can safely exclude fetchCategories from dependencies because:
    // 1. It's from Zustand which maintains stable references
    // 2. The function itself uses the latest state via get()
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

  // Show error toast if there's an error
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
      currentPage: 1, // Reset to first page
    });
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    // No need to manually fetch here - the useEffect will handle it
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

    // Add first page and ellipsis if needed
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

    // Add page buttons
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

    // Add last page and ellipsis if needed
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-3 px-1 flex-1 overflow-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your product categories</p>
        </div>
        <CreateCategoryModal>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CreateCategoryModal>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <SearchFilter
            onSearch={handleSearch}
            placeholder="Search categories..."
            defaultValue={searchTerm}
            isLoading={isLoading}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="hidden sm:block text-sm text-muted-foreground">Items per page</div>
          <Select
            value={pagination.itemsPerPage.toString()}
            onValueChange={(value) => handleItemsPerPageChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder={pagination.itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && categories.length === 0 ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <CategoriesTable
            categories={categories}
            isLoading={isLoading}
            onCategoryUpdated={() => fetchCategories(pagination.currentPage, pagination.itemsPerPage, searchTerm)}
          />
        </div>
      )}

      {pagination.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
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
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
