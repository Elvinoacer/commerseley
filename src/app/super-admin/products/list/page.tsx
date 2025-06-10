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
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col gap-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <p className="text-sm text-gray-500">
                  {totalProducts} products found {searchQuery && `matching "${searchQuery}"`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full sm:w-64 pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Button onClick={() => router.push("/super-admin/products/add")} className="whitespace-nowrap">
                    Add New Product
                  </Button>
                </motion.div>
              </div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border overflow-hidden"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="min-w-[250px]">Product</TableHead>
                      <TableHead className="text-center">Price & Stock</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Attributes</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="space-y-4 p-4">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-[200px]" />
                                  <Skeleton className="h-4 w-[150px]" />
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
                            <TableCell colSpan={6} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Search className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                  {searchQuery ? "No products match your search" : "No products found"}
                                </p>
                                {searchQuery && (
                                  <Button variant="ghost" onClick={clearSearch} className="mt-2">
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
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                      {product.images[0] ? (
                                        <Image
                                          src={product.images[0]}
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                          <ImageIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium line-clamp-1">{product.name}</p>
                                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center">
                                    {isOnOffer ? (
                                      <>
                                        <span className="font-bold text-red-600">
                                          Kes {product.offerPrice?.toFixed(2)}
                                        </span>
                                        <span className="text-xs text-gray-500 line-through">
                                          Kes {product.price.toFixed(2)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="font-medium">Kes {product.price.toFixed(2)}</span>
                                    )}
                                    <span
                                      className={`text-xs mt-1 ${
                                        product.stock > 0 ? "text-green-600" : "text-red-600"
                                      }`}
                                    >
                                      {product.stock} in stock
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {product.category.name}
                                  </Badge>
                                  {product.gender && (
                                    <Badge variant="secondary" className="text-xs ml-1">
                                      {product.gender}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {colors.slice(0, 3).map((color, i) => (
                                      <div
                                        key={i}
                                        className="h-4 w-4 rounded-full border border-gray-200 shadow-xs"
                                        style={{
                                          backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}`,
                                        }}
                                        title={color.name}
                                      />
                                    ))}
                                    {colors.length > 3 && (
                                      <span className="text-xs text-gray-500">+{colors.length - 3}</span>
                                    )}
                                    {product.sizes && product.sizes.length > 0 && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        {product.sizes.slice(0, 2).join(", ")}
                                        {product.sizes.length > 2 && "..."}
                                      </span>
                                    )}
                                  </div>
                                  {skus.length > 0 && (
                                    <div className="mt-1">
                                      {skus.slice(0, 2).map((sku, i) => (
                                        <span key={i} className="text-xs text-gray-500">
                                          {sku.key}: {sku.value}
                                          {i < skus.length - 1 && ", "}
                                        </span>
                                      ))}
                                      {skus.length > 2 && (
                                        <span className="text-xs text-gray-500">, +{skus.length - 2}</span>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    {isFeatured && (
                                      <Badge variant="default" className="text-xs flex items-center gap-1">
                                        <Star className="h-3 w-3" /> Featured
                                      </Badge>
                                    )}
                                    {isOnOffer && (
                                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                        <BadgePercent className="h-3 w-3" /> On Sale
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      onClick={() => router.push(`/super-admin/products/add?id=${product.id}`)}
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteProduct(product.id)}
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center"
              >
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
