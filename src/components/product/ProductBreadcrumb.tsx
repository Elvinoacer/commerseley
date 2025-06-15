import { slideUp } from "@/lib/utils";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductBreadcrumbProps {
  product: Product;
  theme: string;
}

function ProductBreadcrumb({ product, theme }: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto whitespace-nowrap py-2 mb-4 sm:mb-6">
      <motion.ol
        variants={slideUp}
        className={`flex items-center text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        role="list"
      >
        <li className="flex items-center">
          <Link
            href="/"
            className={`inline-block px-2 py-2 hover:underline transition-colors ${
              theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
            }`}
            title="Home"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 flex-shrink-0" aria-hidden="true" />
        </li>
        <li className="flex items-center">
          <Link
            href={`/category/${product.category.id}`}
            className={`inline-block px-2 py-2 hover:underline transition-colors truncate max-w-[120px] sm:max-w-[200px] ${
              theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
            }`}
            title={product.category.name}
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 flex-shrink-0" aria-hidden="true" />
        </li>
        <li className="flex items-center">
          <span
            className={`inline-block px-2 py-2 font-medium truncate max-w-[120px] sm:max-w-[200px] ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
            title={product.name}
          >
            {product.name}
          </span>
        </li>
      </motion.ol>
    </nav>
  );
}

export default ProductBreadcrumb;
