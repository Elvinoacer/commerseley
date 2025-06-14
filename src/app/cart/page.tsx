"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

function UserCartPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { fetchCart, items, isLoading, updateCartItemQuantity, removeFromCart } = useCartStore();
  const { data } = useSession();
  const { user } = data || {};
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Theme-aware colors
  const bgGradient = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50";
  const cardBg = isDark ? "bg-gray-800/90" : "bg-white/90";
  const cardBorder = isDark ? "border-gray-700" : "border-indigo-100";
  const textColor = isDark ? "text-gray-100" : "text-gray-800";
  const secondaryTextColor = isDark ? "text-gray-300" : "text-gray-600";
  const primaryGradient = isDark ? "from-indigo-500 to-purple-500" : "from-indigo-600 to-purple-600";
  const accentGradient = isDark ? "from-pink-500 to-rose-500" : "from-pink-500 to-rose-500";
  const hoverGradient = isDark
    ? "hover:from-indigo-600 hover:to-purple-600"
    : "hover:from-indigo-700 hover:to-purple-700";
  const accentHoverGradient = isDark
    ? "hover:from-pink-600 hover:to-rose-600"
    : "hover:from-pink-600 hover:to-rose-600";

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(id, newQuantity);
      toast({ title: "Quantity updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update quantity", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(true);
    try {
      await removeFromCart(id);
      toast({ title: "Item removed from cart" });
    } catch (error) {
      toast({ title: "Failed to remove item", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isLoading || !user) {
    return (
      <div className={cn("min-h-screen py-12 px-4 sm:px-6 lg:px-8", bgGradient)}>
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className={cn("h-12 w-1/2 mx-auto rounded-lg", isDark ? "bg-gray-700" : "bg-gray-200")} />
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className={cn("h-32 w-full rounded-lg", isDark ? "bg-gray-700" : "bg-gray-200")} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden", bgGradient)}>
      {/* Floating Particles Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className={cn(
              "absolute rounded-full",
              isDark ? "bg-indigo-500/10 blur-[1px]" : "bg-indigo-300/30 blur-[1px]"
            )}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Glowing Gradient Spots */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className={cn(
            "absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20",
            isDark ? "bg-indigo-600" : "bg-indigo-300"
          )}
        ></div>
        <div
          className={cn(
            "absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20",
            isDark ? "bg-pink-600" : "bg-pink-300"
          )}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className={cn("h-6 w-6", textColor)} />
          </motion.div>
          <motion.h1
            className={cn("text-3xl md:text-4xl font-extrabold text-center", isDark ? "text-white" : "text-indigo-900")}
          >
            Your Shopping Cart
          </motion.h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("p-8 rounded-2xl shadow-lg text-center border", cardBg, cardBorder)}
          >
            <div className="flex justify-center mb-6">
              <div className={cn("p-4 rounded-full", isDark ? "bg-indigo-900/50" : "bg-indigo-100")}>
                <ShoppingBag className={cn("h-10 w-10", isDark ? "text-indigo-400" : "text-indigo-600")} />
              </div>
            </div>
            <h3 className={cn("text-xl font-semibold mb-4", textColor)}>Your cart is empty</h3>
            <p className={cn("mb-6", secondaryTextColor)}>Explore our products and add some items to your cart!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/listing")}
                className={cn(
                  "rounded-lg px-6 py-3",
                  `bg-gradient-to-r ${primaryGradient} ${hoverGradient} text-white`
                )}
              >
                Shop Now
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    "p-6 rounded-2xl shadow-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                    cardBg,
                    cardBorder
                  )}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative w-20 h-20 rounded-md overflow-hidden border"
                    >
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" priority={index === 0} />
                      ) : (
                        <div
                          className={cn(
                            "w-full h-full flex items-center justify-center",
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          )}
                        >
                          <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>No Image</span>
                        </div>
                      )}
                    </motion.div>
                    <div>
                      <h3 className={cn("font-medium text-lg", textColor)}>{item.name}</h3>
                      <p className={cn("text-sm", secondaryTextColor)}>Color: {item.color}</p>
                      <p className={cn("text-sm", secondaryTextColor)}>Size: {item.size}</p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          disabled={isUpdating}
                          onClick={() => handleRemoveItem(item.id)}
                          variant="ghost"
                          className={cn(
                            "text-sm mt-2",
                            isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                          )}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          variant="outline"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full",
                            isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                          )}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <Input
                        type="number"
                        className={cn(
                          "w-16 text-center rounded-lg",
                          isDark
                            ? "bg-gray-700 border-gray-600 focus:border-indigo-500 text-white"
                            : "border-gray-300 focus:border-indigo-500"
                        )}
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        disabled={isUpdating}
                      />
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          variant="outline"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full",
                            isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                          )}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm", secondaryTextColor)}>Kes {item.price.toFixed(2)}</p>
                      <p className={cn("font-medium", textColor)}>Kes {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={cn("p-6 rounded-2xl shadow-lg border", cardBg, cardBorder)}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={cn("text-lg font-medium", textColor)}>Subtotal</span>
                <span className={cn("text-lg font-medium", textColor)}>Kes {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className={cn("text-sm", secondaryTextColor)}>Shipping</span>
                <span className={cn("text-sm", secondaryTextColor)}>Calculated at checkout</span>
              </div>
              <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
              <div className="flex justify-between items-center my-4">
                <span className={cn("text-xl font-bold", textColor)}>Total</span>
                <span className={cn("text-xl font-bold", isDark ? "text-indigo-400" : "text-indigo-700")}>
                  Kes {total.toFixed(2)}
                </span>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  disabled={items.length === 0 || isUpdating}
                  onClick={() => router.push("/checkout")}
                  className={cn(
                    "w-full py-6 text-lg font-bold rounded-lg",
                    `bg-gradient-to-r ${primaryGradient} ${hoverGradient} text-white`
                  )}
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/listing")}
                  variant="outline"
                  className={cn(
                    "w-full mt-3 rounded-lg",
                    isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                  )}
                >
                  Continue Shopping
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCartPage;
