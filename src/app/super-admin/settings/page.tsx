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
import { Product } from "@/types";

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
      // Featured products (true) come first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0; // Keep original order if both have same `isFeatured`
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
      className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="flex flex-col gap-6 bg-white rounded-xl shadow-lg p-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings & Features
            </h1>
          </header>

          <div className="space-y-8">
            {/* Banner Management Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Banner Management</h2>

              {/* Upload New Banners */}
              <div className="space-y-4">
                <Label htmlFor="image-upload" className="block mb-2 text-sm font-medium text-gray-700">
                  Upload New Banners
                </Label>
                <div className="flex items-center space-x-4">
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-40 px-4 transition border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 bg-gray-50 hover:bg-blue-50"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-8 w-8 text-blue-500" />
                      <span className="text-sm font-medium text-gray-600">Drag & drop images or click to browse</span>
                      <span className="text-xs text-gray-500">PNG, JPG up to 5MB each</span>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">New Banners to Upload</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="relative group rounded-lg overflow-hidden shadow-sm"
                          whileHover={{ scale: 1.02 }}
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
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Banners</h3>
                {banners.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {banners.map((banner) => (
                      <motion.div
                        key={banner.id}
                        variants={itemVariants}
                        className="relative group rounded-lg overflow-hidden shadow-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img src={banner.imageUrl} alt={`Banner ${banner.id}`} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Label htmlFor={`update-banner-${banner.id}`} className="cursor-pointer">
                            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                              <Upload className="h-4 w-4 mr-1" /> Replace
                            </Button>
                          </Label>
                          <Input
                            id={`update-banner-${banner.id}`}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleBannerUpdate(banner.id, e)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => handleBannerDelete(banner.id)}
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No banners currently uploaded</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Featured Products Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Featured Products</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select up to 8 products to feature on the homepage (currently selected: {selectedProducts.length}/8)
              </p>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {sortedProducts.map((product) => {
                    const colors = parseColors(product.colors);
                    const isSelected = selectedProducts.includes(product.id);

                    return (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        className={`relative p-4 border rounded-xl transition-all ${
                          isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300"
                        }`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute top-3 right-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleProductSelection(product.id)}
                            className={`h-5 w-5 border-2 ${
                              isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                            }`}
                          />
                        </div>

                        <div className="space-y-3">
                          {/* Product Image */}
                          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category.name}</p>
                          </div>

                          {/* Colors */}
                          {colors.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Available Colors:</p>
                              <div className="flex flex-wrap gap-1">
                                {colors.slice(0, 4).map((color) => (
                                  <div
                                    key={color.name}
                                    className="h-5 w-5 rounded-full border border-gray-200 shadow-xs"
                                    style={{
                                      backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}`,
                                    }}
                                    title={color.name}
                                  />
                                ))}
                                {colors.length > 4 && (
                                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
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
                                <span className="font-bold text-green-600">Kes {product.offerPrice.toFixed(2)}</span>
                                <span className="text-sm text-red-400 line-through">
                                  Kes {product.price.toFixed(2)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Sale</span>
                              </div>
                            ) : (
                              <span className="font-bold text-gray-900">Kes {product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No products available to feature</p>
                </div>
              )}
            </motion.div>

            {/* Save Button */}
            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200">
              <Button
                disabled={isLoading}
                onClick={handleSaveChanges}
                className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
