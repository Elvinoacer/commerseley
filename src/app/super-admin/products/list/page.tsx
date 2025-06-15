"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/useProductStore";
import { Pencil, Trash2, Search, X, Star, BadgePercent, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

function SuperAdminProductListingPage() {
  const {
    products,
    isLoading,
    fetchAllProductsForAdmin,
    deleteProduct,
    currentPage,
    totalPages,
    setCurrentPage,
    totalProducts,
  } = useProductStore();

  const { toast } = useToast();
  const router = useRouter();
  const productFetchRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin({ page: currentPage, search: searchQuery });
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin, currentPage, searchQuery]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  async function handleDeleteProduct(getId: string) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(getId);
      if (result) {
        toast({
          title: "Product deleted successfully",
        });
        fetchAllProductsForAdmin({ page: currentPage, search: searchQuery });
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      productFetchRef.current = false;
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    productFetchRef.current = false;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    productFetchRef.current = false;
  };

  // Helper function to parse colors
  const parseColors = (colors: string | { hex: string; name: string }[]) => {
    if (Array.isArray(colors)) return colors;
    try {
      const parsed = JSON.parse(colors);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Helper function to parse SKUs
  const parseSkus = (skus: string | { key: string; value: string }[]) => {
    if (Array.isArray(skus)) return skus;
    try {
      const parsed = JSON.parse(skus);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
              <motion.div variants={itemVariants}>
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {totalProducts} products found {searchQuery && `matching "${searchQuery}"`}
                </p>
              </motion.div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <motion.div variants={itemVariants} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-8 md:pl-10 pr-8 md:pr-10 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm md:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  )}
                </motion.div>
                <motion.div variants={itemVariants} className="flex-shrink-0">
                  <Button
                    onClick={() => router.push("/super-admin/products/add")}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white rounded-lg text-sm md:text-base py-2 px-4"
                  >
                    Add New Product
                  </Button>
                </motion.div>
              </div>
            </header>

            <motion.div
              variants={itemVariants}
              className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <Table className="min-w-[600px] md:min-w-full">
                  <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                    <TableRow>
                      <TableHead className="min-w-[150px] md:min-w-[250px] text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm">
                        Product
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm">
                        Price & Stock
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm">
                        Category
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm">
                        Attributes
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="space-y-3 p-3 md:space-y-4 md:p-4">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="flex items-center space-x-3 md:space-x-4">
                                <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-3 md:h-4 w-[120px] md:w-[200px]" />
                                  <Skeleton className="h-3 md:h-4 w-[80px] md:w-[150px]" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence mode="wait">
                        {products.length === 0 ? (
                          <motion.tr
                            key="no-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <TableCell colSpan={6} className="text-center py-8 md:py-12">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Search className="h-6 w-6 md:h-8 md:w-8 text-gray-500 dark:text-gray-400" />
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                  {searchQuery ? "No products match your search" : "No products found"}
                                </p>
                                {searchQuery && (
                                  <Button
                                    variant="ghost"
                                    onClick={clearSearch}
                                    className="mt-1 md:mt-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs md:text-sm"
                                  >
                                    Clear search
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        ) : (
                          products.map((product) => {
                            const colors = parseColors(product.colors);
                            const skus = parseSkus(product.skus || []);
                            const isFeatured = product.isFeatured;
                            const isOnOffer = product.isOnOffer;

                            return (
                              <motion.tr
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                layout
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2 md:gap-3">
                                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                      {product.images[0] ? (
                                        <Image
                                          src={product.images[0]}
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                          <ImageIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 text-xs md:text-sm">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center">
                                    {isOnOffer ? (
                                      <>
                                        <span className="font-bold text-red-600 dark:text-red-400 text-xs md:text-sm">
                                          Kes {product.offerPrice?.toFixed(2)}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                          Kes {product.price.toFixed(2)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="font-medium text-gray-900 dark:text-gray-100 text-xs md:text-sm">
                                        Kes {product.price.toFixed(2)}
                                      </span>
                                    )}
                                    <span
                                      className={`text-xs mt-0.5 ${
                                        product.stock > 0
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {product.stock} in stock
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                    >
                                      {product.category.name}
                                    </Badge>
                                    {product.gender && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                      >
                                        {product.gender}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1 max-w-[120px] md:max-w-[200px]">
                                    {colors.slice(0, 3).map((color, i) => (
                                      <div
                                        key={i}
                                        className="h-3 w-3 md:h-4 md:w-4 rounded-full border border-gray-200 dark:border-gray-600 shadow-xs"
                                        style={{
                                          backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}`,
                                        }}
                                        title={color.name}
                                      />
                                    ))}
                                    {colors.length > 3 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        +{colors.length - 3}
                                      </span>
                                    )}
                                    {product.sizes && product.sizes.length > 0 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {product.sizes.slice(0, 2).join(", ")}
                                        {product.sizes.length > 2 && "..."}
                                      </span>
                                    )}
                                  </div>
                                  {skus.length > 0 && (
                                    <div className="mt-0.5">
                                      {skus.slice(0, 1).map((sku, i) => (
                                        <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
                                          {sku.key}: {sku.value}
                                          {i < skus.length - 1 && ", "}
                                        </span>
                                      ))}
                                      {skus.length > 1 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          , +{skus.length - 1}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-0.5 md:gap-1">
                                    {isFeatured && (
                                      <Badge className="text-xs flex items-center gap-0.5 md:gap-1 bg-indigo-600 dark:bg-indigo-500 text-white">
                                        <Star className="h-2.5 w-2.5 md:h-3 md:w-3" /> Featured
                                      </Badge>
                                    )}
                                    {isOnOffer && (
                                      <Badge className="text-xs flex items-center gap-0.5 md:gap-1 bg-purple-600 dark:bg-purple-500 text-white">
                                        <BadgePercent className="h-2.5 w-2.5 md:h-3 md:w-3" /> On Sale
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-1 md:gap-2">
                                    <Button
                                      onClick={() => router.push(`/super-admin/products/add?id=${product.id}`)}
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7 md:h-8 md:w-8 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                                    >
                                      <Pencil className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteProduct(product.id)}
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7 md:h-8 md:w-8 border-gray-200 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                                    >
                                      <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            );
                          })
                        )}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>

            {!isLoading && totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3 md:mt-4"
              >
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <Pagination className="w-full sm:w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={cn(
                          "text-xs md:text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 md:h-9 md:w-9",
                          currentPage === 1 && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage <= 2) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 1) {
                        pageNum = totalPages - 2 + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className={cn(
                              "text-xs md:text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 md:h-9 md:w-9",
                              currentPage === pageNum &&
                                "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                            )}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={cn(
                          "text-xs md:text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 h-8 w-8 md:h-9 md:w-9",
                          currentPage === totalPages && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SuperAdminProductListingPage;
