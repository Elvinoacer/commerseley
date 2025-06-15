import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductDetailsTab from "./ProductDetailsTab";
import ProductReviewsTab from "./ProductReviewsTab";
import ProductShippingTab from "./ProductShippingTab";
import { Product, Review } from "@/types";
import { useState, Suspense } from "react";

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
  id: string;
  theme: string;
}

function ProductTabs({ product, reviews, id, theme }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      className="mt-8 sm:mt-12 mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-4xl"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={`flex overflow-x-auto whitespace-nowrap gap-0 rounded-md p-1 hide-scrollbar ${
            theme === "dark" ? "bg-gray-800/60" : "bg-gray-100/60"
          }`}
          aria-label="Product information tabs"
        >
          {[
            { value: "details", label: "Details" },
            { value: "reviews", label: `Reviews (${reviews.length})` },
            { value: "shipping", label: "Shipping" },
          ].map((tab, index) => (
            <motion.div
              key={tab.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 min-w-[100px] sm:min-w-[120px]"
            >
              <TabsTrigger
                value={tab.value}
                className={`w-full py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 rounded-md truncate ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-sm"
                    : "text-gray-600 hover:text-gray-900 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:shadow-sm"
                }`}
                aria-controls={`tab-content-${tab.value}`}
              >
                {tab.label}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[600px]"
        >
          <TabsContent value="details" className="mt-6 sm:mt-8 px-2 sm:px-0">
            <ProductDetailsTab product={product} theme={theme} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6 sm:mt-8 px-2 sm:px-0">
            <Suspense fallback={<div className="text-center py-4">Loading reviews...</div>}>
              <ProductReviewsTab product={product} reviews={reviews} id={id} theme={theme} />
            </Suspense>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6 sm:mt-8 px-2 sm:px-0">
            <ProductShippingTab theme={theme} />
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}

export default ProductTabs;
