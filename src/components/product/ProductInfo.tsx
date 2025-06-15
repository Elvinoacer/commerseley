import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Truck, Shield, CreditCard } from "lucide-react";
import { Color, Product, Review } from "@/types";
import { staggerItem } from "@/lib/utils";
import { useState } from "react";

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  selectedColor: number;
  setSelectedColor: (index: number) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  theme: string;
}

function ProductInfo({
  product,
  reviews,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
  theme,
}: ProductInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  let parsedColors: Color[] = [];
  try {
    parsedColors = JSON.parse(product.colors as unknown as string);
  } catch (error) {
    console.error("Failed to parse product colors:", error);
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  return (
    <motion.div variants={staggerItem} className="w-full space-y-3 sm:space-y-4">
      {/* Product Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
          <div className="flex-1">
            <h1
              className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : theme === "dark"
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                ({reviews.length} reviews)
              </span>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              theme === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
            }`}
          >
            {product.stock} in stock
          </span>
        </div>

        {/* Price */}
        <div className="mb-2 sm:mb-3">
          <span
            className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            KES {(product.isOnOffer && product.offerPrice ? product.offerPrice : product.price).toFixed(2)}
          </span>
          {product.isOnOffer && product.offerPrice && (
            <span
              className={`text-xs sm:text-sm line-through ml-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              KES {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Description with improved wrapping */}
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p
            className={`${
              isDescriptionExpanded ? "" : "line-clamp-3"
            } transition-all duration-300 break-words hyphens-auto`}
            style={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {product.description || "No description available."}
          </p>
          {product.description && product.description.length > 100 && (
            <button
              onClick={toggleDescription}
              className={`text-blue-600 dark:text-blue-400 text-xs font-medium mt-1 inline-block hover:underline ${
                theme === "dark" ? "hover:text-blue-300" : "hover:text-blue-700"
              }`}
              aria-expanded={isDescriptionExpanded}
            >
              {isDescriptionExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Color Selection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3
          className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {parsedColors[selectedColor]?.name && (
            <>
              <span>Color</span> <span className="font-normal">{parsedColors[selectedColor].name}</span>
            </>
          )}
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {parsedColors.map((color: Color, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all shadow-sm ${
                selectedColor === index
                  ? "border-indigo-600 scale-105"
                  : theme === "dark"
                  ? "border-gray-600 hover:border-gray-400"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(index)}
              title={color.name}
              aria-label={`Select color ${color.name}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Size Selection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3
          className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Size
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {product.sizes.map((size: string) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`h-8 w-8 sm:h-9 sm:w-9 text-xs rounded transition-all shadow-sm ${
                selectedSize === size
                  ? theme === "dark"
                    ? "bg-purple-700 text-white border-purple-700"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-400"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
              }`}
              onClick={() => setSelectedSize(size)}
              aria-label={`Select size ${size}`}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quantity */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3
          className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Quantity
        </h3>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div
            className={`flex items-center border rounded-md overflow-hidden shadow-sm ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <Button
              variant="ghost"
              className={`h-8 w-8 sm:h-9 sm:w-9 text-sm ${
                theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              -
            </Button>
            <span
              className={`w-8 sm:w-10 text-center text-xs sm:text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {quantity}
            </span>
            <Button
              variant="ghost"
              className={`h-8 w-8 sm:h-9 sm:w-9 text-sm ${
                theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
          {product.stock < 10 && (
            <span className={`text-xs ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
              Only {product.stock} left!
            </span>
          )}
        </div>
      </motion.div>

      {/* Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-2 sm:pt-3"
      >
        {(quantity > product.stock || quantity <= 0 || !selectedSize || selectedColor < 0) && (
          <p className={`text-xs mb-1 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
            Please select all fields
          </p>
        )}
        <Button
          className={`w-full h-10 sm:h-11 text-xs sm:text-sm font-medium shadow-md ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
          onClick={handleAddToCart}
          disabled={quantity > product.stock || quantity <= 0 || !selectedSize || selectedColor < 0}
          aria-label="Add to cart"
        >
          Add to Cart
        </Button>
      </motion.div>

      {/* Shipping Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div
          className={`flex items-center gap-2 p-1.5 sm:p-2 rounded ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <Truck className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Free shipping</span>
        </div>
        <div
          className={`flex items-center gap-2 p-1.5 sm:p-2 rounded ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <Shield className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>2-year warranty</span>
        </div>
        <div
          className={`flex items-center gap-2 p-1.5 sm:p-2 rounded ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <CreditCard className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Secure payment</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductInfo;
