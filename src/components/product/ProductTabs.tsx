import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductDetailsTab from "./ProductDetailsTab";
import ProductReviewsTab from "./ProductReviewsTab";
import ProductShippingTab from "./ProductShippingTab";
import { Product, Review } from "@/types";

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
  id: string;
  theme: string;
}

function ProductTabs({ product, reviews, id, theme }: ProductTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-12 sm:mt-16 max-w-4xl mx-auto"
    >
      <Tabs defaultValue="details" className="w-full">
        <TabsList
          className={`w-full justify-start gap-0 rounded-lg p-1 ${
            theme === "dark" ? "bg-gray-800/50 backdrop-blur-sm" : "bg-gray-100/50 backdrop-blur-sm"
          }`}
        >
          {[
            { value: "details", label: "PRODUCT DETAILS" },
            { value: "reviews", label: `REVIEWS (${reviews.length})` },
            { value: "shipping", label: "SHIPPING & RETURNS" },
          ].map((tab, index) => (
            <motion.div key={tab.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <TabsTrigger
                value={tab.value}
                className={`w-full py-3 px-4 text-sm sm:text-base font-medium transition-all duration-300 rounded-md ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg"
                    : "text-gray-700 hover:text-gray-900 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:shadow-md"
                }`}
              >
                {tab.label}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <TabsContent value="details" className="mt-8">
            <ProductDetailsTab product={product} theme={theme} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-8">
            <ProductReviewsTab product={product} reviews={reviews} id={id} theme={theme} />
          </TabsContent>
          <TabsContent value="shipping" className="mt-8">
            <ProductShippingTab theme={theme} />
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}

export default ProductTabs;
