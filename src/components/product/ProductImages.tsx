import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Zap } from "lucide-react";
import { staggerItem } from "@/lib/utils";
import { Product } from "@/types";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

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
  const [isDragging, setIsDragging] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1)),
    onSwipedRight: () => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1)),
    onSwipeStart: () => setIsDragging(true),
    onSwiped: () => setIsDragging(false),
    preventScrollOnSwipe: true,
    trackMouse: true, // For testing on desktop
  });

  return (
    <motion.div variants={staggerItem} className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <motion.div
        className={`relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg shadow-md overflow-hidden border ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        {...handlers}
        aria-label="Product image carousel"
        role="region"
      >
        <img
          src={product.images[selectedImage] || "/placeholder.jpg"}
          srcSet={`${product.images[selectedImage]} 1x, ${product.images[selectedImage]} 2x`}
          sizes="(max-width: 640px) 100vw, 50vw"
          alt={`${product.name} - Image ${selectedImage + 1}`}
          className="w-full h-full object-contain p-2 sm:p-4"
          draggable={false}
        />

        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: isDragging ? 1 : 1.1 }}
              whileTap={{ scale: isDragging ? 1 : 0.9 }}
              onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
              className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full p-2 sm:p-3 shadow-md transition-colors ${
                theme === "dark" ? "bg-gray-800/70 hover:bg-gray-700" : "bg-white/70 hover:bg-white"
              }`}
              aria-label="Previous image"
              disabled={isDragging}
            >
              <ChevronLeft
                className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: isDragging ? 1 : 1.1 }}
              whileTap={{ scale: isDragging ? 1 : 0.9 }}
              onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
              className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full p-2 sm:p-3 shadow-md transition-colors ${
                theme === "dark" ? "bg-gray-800/70 hover:bg-gray-700" : "bg-white/70 hover:bg-white"
              }`}
              aria-label="Next image"
              disabled={isDragging}
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              />
            </motion.button>
          </>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: isWishlistToggling || isDragging ? 1 : 1.1 }}
          whileTap={{ scale: isWishlistToggling || isDragging ? 1 : 0.9 }}
          onClick={() => handleToggleWishlist(id)}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-3 rounded-full shadow-md transition-all ${
            isWishlistToggling
              ? "opacity-60 cursor-not-allowed"
              : theme === "dark"
              ? "bg-gray-800/70 hover:bg-gray-700"
              : "bg-white/70 hover:bg-white"
          } ${wishlistHighlight ? "bg-red-100/70" : ""}`}
          disabled={isWishlistToggling || isDragging}
          aria-label={isWishlistedLocal ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            animate={{
              scale: wishlistHighlight ? [1, 1.2, 1] : 1,
              rotate: wishlistHighlight ? [0, 10, -10, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.4 },
              rotate: { duration: 0.6 },
            }}
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                isWishlistedLocal
                  ? "fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
                  : theme === "dark"
                  ? "text-gray-300 hover:text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
          {product.isFeatured && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center shadow-md truncate max-w-[100px] sm:max-w-[120px] ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-700 to-pink-600"
                  : "bg-gradient-to-r from-purple-600 to-pink-500"
              }`}
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> Featured
            </motion.span>
          )}
          {product.stock === 0 && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md truncate max-w-[100px] sm:max-w-[120px]"
            >
              Sold Out
            </motion.span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-yellow-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md truncate max-w-[100px] sm:max-w-[120px]"
            >
              Low Stock
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <motion.div
          className="flex overflow-x-auto gap-2 sm:gap-3 py-2 hide-scrollbar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {product.images.map((image: string, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: isDragging ? 1 : 1.05 }}
              whileTap={{ scale: isDragging ? 1 : 0.95 }}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border transition-all ${
                selectedImage === index
                  ? "ring-2 ring-indigo-600 shadow-sm"
                  : theme === "dark"
                  ? "opacity-80 hover:opacity-100 border-gray-700"
                  : "opacity-80 hover:opacity-100 border-gray-200"
              }`}
              aria-label={`Select image ${index + 1}`}
              disabled={isDragging}
            >
              <img
                src={image}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index > 2 ? "lazy" : "eager"}
              />
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProductImages;
