import { slideUp } from "@/lib/utils";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  product: Product;
  theme: string;
}

function ProductBreadcrumb({ product, theme }: ProductBreadcrumbProps) {
  return (
    <motion.div
      variants={slideUp}
      className={`flex items-center text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
    >
      <span className={`hover:text-white cursor-pointer ${theme === "dark" ? "hover:text-white" : "hover:text-black"}`}>
        Home
      </span>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className={`hover:text-white cursor-pointer ${theme === "dark" ? "hover:text-white" : "hover:text-black"}`}>
        {product.category.name}
      </span>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{product.name}</span>
    </motion.div>
  );
}

export default ProductBreadcrumb;
