"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/useProductStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Color {
  hex: string;
  name: string;
}

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
      duration: 0.3,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

function SuperAdminCouponsPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { products, fetchAllProductsForAdmin } = useProductStore();
  const [sortedProducts, setSortedProducts] = useState<any[]>([]);
  const {
    featuredProducts,
    banners,
    isLoading,
    error,
    fetchBanners,
    fetchFeaturedProducts,
    addBanners,
    updateFeaturedProducts,
    deleteBanner,
    updateBanner,
  } = useSettingsStore();
  const pageLoadRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!pageLoadRef.current) {
      fetchBanners();
      fetchAllProductsForAdmin();
      fetchFeaturedProducts();
      pageLoadRef.current = true;
    }
  }, [fetchAllProductsForAdmin, fetchFeaturedProducts, fetchBanners]);

  const handleBannerUpdate = async (bannerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await updateBanner(bannerId, file);
    if (result) {
      toast({
        title: "Banner updated successfully",
      });
      fetchBanners();
    } else {
      toast({
        title: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const handleBannerDelete = async (bannerId: string) => {
    const result = await deleteBanner(bannerId);
    if (result) {
      toast({
        title: "Banner deleted successfully",
      });
      fetchBanners();
    } else {
      toast({
        title: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const sortedProducts = products.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
    setSortedProducts(sortedProducts);
  }, [products]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const removeImage = (getCurrentIndex: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== getCurrentIndex));
  };

  const handleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      if (prev.length >= 8) {
        toast({
          title: "You can select up to 8 products as featured",
          variant: "destructive",
        });
        return prev;
      }

      return [...prev, productId];
    });
  };

  const handleSaveChanges = async () => {
    if (uploadedFiles.length > 0) {
      const result = await addBanners(uploadedFiles);
      if (result) {
        setUploadedFiles([]);
        fetchBanners();
      } else {
        toast({
          title: "Uploading files failed",
          variant: "destructive",
        });
      }
    }

    const result = await updateFeaturedProducts(selectedProducts);
    if (result) {
      toast({
        title: "Featured products updated successfully",
      });
      fetchFeaturedProducts();
    } else {
      toast({
        title: "Failed to update featured products",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setSelectedProducts(featuredProducts.map((pro) => pro.id));
  }, [featuredProducts]);

  const parseColors = (colors: string | Color[]): Color[] => {
    if (Array.isArray(colors)) return colors;
    try {
      const parsed = JSON.parse(colors);
      if (Array.isArray(parsed) && parsed.every((c: any) => c.hex && c.name)) {
        return parsed;
      }
      return [];
    } catch (e) {
      console.error("Failed to parse colors:", e);
      return [];
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
        >
          <header className="flex items-center justify-between">
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent"
            >
              Settings & Features
            </motion.h1>
          </header>

          <div className="space-y-10">
            {/* Banner Management Section */}
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Banner Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload and manage homepage banners (recommended size: 1200x400px)
                </p>
              </div>

              {/* Upload New Banners */}
              <div className="space-y-4">
                <Label htmlFor="image-upload" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Upload New Banners
                </Label>
                <div className="flex items-center space-x-4">
                  <Label
                    htmlFor="image-upload"
                    className={cn(
                      "flex items-center justify-center w-full h-40 px-4 transition border-2 border-dashed rounded-xl cursor-pointer",
                      "border-indigo-200 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/50 hover:bg-indigo-100/50 dark:hover:bg-indigo-800/50"
                    )}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Drag & drop images or click to browse
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB each</span>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      aria-label="Upload banner images"
                    />
                  </Label>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Banners to Upload</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          variants={cardHoverVariants}
                          className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-40 object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 dark:bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove banner ${index + 1}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Existing Banners */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Current Banners</h3>
                {banners.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {banners.map((banner) => (
                      <motion.div
                        key={banner.id}
                        variants={cardHoverVariants}
                        className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <img src={banner.imageUrl} alt={`Banner ${banner.id}`} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Label htmlFor={`update-banner-${banner.id}`} className="cursor-pointer">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="backdrop-blur-sm bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                              aria-label={`Replace banner ${banner.id}`}
                            >
                              <Upload className="h-4 w-4 mr-1" /> Replace
                            </Button>
                          </Label>
                          <Input
                            id={`update-banner-${banner.id}`}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleBannerUpdate(banner.id, e)}
                            aria-label={`Update banner ${banner.id}`}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="backdrop-blur-sm bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 text-red-600 dark:text-red-400"
                            onClick={() => handleBannerDelete(banner.id)}
                            aria-label={`Delete banner ${banner.id}`}
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No banners currently uploaded</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Featured Products Section */}
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Featured Products</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select up to 8 products to feature on the homepage (currently selected: {selectedProducts.length}/8)
                </p>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sortedProducts.map((product) => {
                    const colors = parseColors(product.colors);
                    const isSelected = selectedProducts.includes(product.id);

                    return (
                      <motion.div
                        key={product.id}
                        variants={cardHoverVariants}
                        className={cn(
                          "relative p-4 border rounded-xl transition-all shadow-sm",
                          isSelected
                            ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/50 shadow-md"
                            : "border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700"
                        )}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <div className="absolute top-3 right-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleProductSelection(product.id)}
                            className={cn(
                              "h-5 w-5 border-2",
                              isSelected
                                ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400"
                                : "border-gray-400 dark:border-gray-500"
                            )}
                            aria-label={`Select product ${product.name}`}
                          />
                        </div>

                        <div className="space-y-3">
                          {/* Product Image */}
                          <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{product.category.name}</p>
                          </div>

                          {/* Colors */}
                          {colors.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Available Colors:</p>
                              <div className="flex flex-wrap gap-1">
                                {colors.slice(0, 4).map((color) => (
                                  <div
                                    key={color.name}
                                    className="h-5 w-5 rounded-full border border-gray-200 dark:border-gray-600 shadow-xs"
                                    style={{
                                      backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}`,
                                    }}
                                    title={color.name}
                                  />
                                ))}
                                {colors.length > 4 && (
                                  <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                                    +{colors.length - 4}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Price */}
                          <div className="mt-2">
                            {product.isOnOffer && product.offerPrice !== undefined ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  Kes {product.offerPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-red-400 dark:text-red-300 line-through">
                                  Kes {product.price.toFixed(2)}
                                </span>
                                <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded">
                                  Sale
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                Kes {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No products available to feature</p>
                </div>
              )}
            </motion.section>

            {/* Save Button */}
            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                disabled={isLoading}
                onClick={handleSaveChanges}
                size="lg"
                className="w-full py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white rounded-lg shadow-lg"
                aria-label="Save all changes"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving Changes...
                  </span>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SuperAdminCouponsPage;
