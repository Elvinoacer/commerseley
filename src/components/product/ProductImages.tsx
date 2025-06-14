import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Zap } from "lucide-react";
import { staggerItem } from "@/lib/utils";
import { Product } from "@/types";

interface ProductImagesProps {
  product: Product;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  isWishlistToggling: boolean;
  isWishlistedLocal: boolean;
  wishlistHighlight: boolean;
  handleToggleWishlist: (productId: string) => Promise<void>;
  theme: string;
  id: string;
}

function ProductImages({
  product,
  selectedImage,
  setSelectedImage,
  isWishlistToggling,
  isWishlistedLocal,
  wishlistHighlight,
  handleToggleWishlist,
  theme,
  id,
}: ProductImagesProps) {
  return (
    <motion.div variants={staggerItem} className="lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4 sm:gap-6">
      {/* Thumbnails */}
      <motion.div
        className="hidden lg:flex flex-col gap-3 w-16 sm:w-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {product.images.map((image: string, index: number) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(index)}
            key={index}
            className={`relative overflow-hidden rounded-lg aspect-square transition-all border ${
              selectedImage === index
                ? "ring-2 ring-indigo-600 shadow-md"
                : theme === "dark"
                ? "opacity-70 hover:opacity-100 border-gray-700"
                : "opacity-70 hover:opacity-100 border-gray-200"
            }`}
          >
            <img src={image} alt={`${product.name} - Image ${index + 1}`} className="w-full h-full object-cover" />
          </motion.button>
        ))}
      </motion.div>

      {/* Main Image */}
      {/* <motion.div
        className={`relative w-full aspect-[3/4] rounded-xl shadow-lg overflow-hidden border ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      > */}
      <motion.div
        className={`relative w-full aspect-[3/4] rounded-xl shadow-lg overflow-hidden border ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={product.images[selectedImage]}
          alt={product.name}
          className="w-full h-full object-contain p-4 sm:p-6"
        />

        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
              className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-colors ${
                theme === "dark" ? "bg-gray-800/80 hover:bg-gray-700" : "bg-white/80 hover:bg-white"
              }`}
            >
              <ChevronLeft className={`w-5 h-5 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
              className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-colors ${
                theme === "dark" ? "bg-gray-800/80 hover:bg-gray-700" : "bg-white/80 hover:bg-white"
              }`}
            >
              <ChevronRight className={`w-5 h-5 ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`} />
            </motion.button>
          </>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: isWishlistToggling ? 1 : 1.1 }}
          whileTap={{ scale: isWishlistToggling ? 1 : 0.9 }}
          onClick={() => handleToggleWishlist(id)}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all ${
            isWishlistToggling
              ? "opacity-70 cursor-not-allowed"
              : theme === "dark"
              ? "bg-gray-800/80 hover:bg-gray-700"
              : "bg-white/80 hover:bg-white"
          } ${wishlistHighlight ? "bg-red-100/80" : ""}`}
          disabled={isWishlistToggling}
          aria-label={isWishlistedLocal ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            animate={{
              scale: wishlistHighlight ? [1, 1.2, 1] : 1,
              rotate: wishlistHighlight ? [0, 15, -15, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.5 },
              rotate: { duration: 0.7 },
            }}
          >
            <Heart
              className={`w-6 h-6 transition-all duration-300 ${
                isWishlistedLocal
                  ? "fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isFeatured && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-700 to-pink-600"
                  : "bg-gradient-to-r from-purple-600 to-pink-500"
              }`}
            >
              <Zap className="w-3 h-3 mr-1" /> Featured
            </motion.span>
          )}
          {product.stock === 0 && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md"
            >
              Sold Out
            </motion.span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-md"
            >
              Low Stock
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductImages;
