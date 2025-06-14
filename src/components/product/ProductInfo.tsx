import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Truck, Shield, CreditCard } from "lucide-react";
import { Color, Product, Review } from "@/types";
import { staggerItem } from "@/lib/utils";

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
  return (
    <motion.div variants={staggerItem} className="lg:w-1/2 space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : theme === "dark"
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                ({reviews.length} reviews)
              </span>
            </div>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              theme === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
            }`}
          >
            {product.stock} in stock
          </span>
        </div>

        <div className="mb-4">
          <span className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Kes {product?.offerPrice?.toFixed(2) || product.price.toFixed(2)}
          </span>
          {product.isOnOffer && product.offerPrice && (
            <span className={`text-lg line-through ml-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Kes {product.price.toFixed(2)}
            </span>
          )}
        </div>

        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {product.description}
        </p>
      </motion.div>

      {/* Color Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className={`text-base sm:text-lg font-medium mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          {JSON.parse(product?.colors)[selectedColor]?.name && (
            <>
              <span>Color</span> <span className="font-normal">{JSON.parse(product?.colors)[selectedColor]?.name}</span>
            </>
          )}
        </h3>
        <div className="flex gap-2 sm:gap-3">
          {JSON.parse(product.colors).map((color: Color, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all shadow-sm ${
                selectedColor === index
                  ? "border-indigo-600 scale-110"
                  : theme === "dark"
                  ? "border-gray-600 hover:border-gray-400"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(index)}
              title={color?.name}
            />
          ))}
        </div>
      </motion.div>

      {/* Size Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className={`text-base sm:text-lg font-medium mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size: string) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`h-10 w-10 sm:h-12 sm:w-12 text-sm sm:text-base rounded-lg transition-all ${
                selectedSize === size
                  ? theme === "dark"
                    ? "bg-purple-700 text-white shadow-md"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-400"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quantity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className={`text-base sm:text-lg font-medium mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          Quantity
        </h3>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center border rounded-lg overflow-hidden shadow-sm ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <Button
              variant="ghost"
              size="lg"
              className={`h-10 sm:h-12 w-10 sm:w-12 text-lg sm:text-xl ${
                theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100"
              }`}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span
              className={`w-10 sm:w-12 text-center text-base sm:text-lg font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="lg"
              className={`h-10 sm:h-12 w-10 sm:w-12 text-lg sm:text-xl ${
                theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100"
              }`}
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              +
            </Button>
          </div>
          {product.stock < 10 && (
            <span className={`text-sm ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
              Only {product.stock} left in stock!
            </span>
          )}
        </div>
      </motion.div>

      {/* Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-4"
      >
        {(quantity > product.stock || quantity <= 0 || !selectedSize || selectedColor < 0) && (
          <p className={`text-sm mb-2 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
            Select all fields to proceed
          </p>
        )}
        <Button
          className={`w-full h-12 sm:h-14 text-base sm:text-lg shadow-lg ${
            theme === "dark"
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
          onClick={handleAddToCart}
          disabled={quantity > product.stock || quantity <= 0 || !selectedSize || selectedColor < 0}
        >
          ADD TO CART
        </Button>
      </motion.div>

      {/* Shipping Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
      >
        <div className={`flex items-center gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <Truck className={`w-5 h-5 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Free shipping</span>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <Shield className={`w-5 h-5 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>2-year warranty</span>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <CreditCard className={`w-5 h-5 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Secure payment</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductInfo;
