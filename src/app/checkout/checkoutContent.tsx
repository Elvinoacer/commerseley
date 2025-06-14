"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAddressStore } from "@/store/useAddressStore";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { Coupon, useCouponStore } from "@/store/useCouponStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Product, useProductStore } from "@/store/useProductStore";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function CheckoutContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<(CartItem & { product: Product })[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponAppliedError, setCouponAppliedError] = useState("");
  const { items, fetchCart, clearCart } = useCartStore();
  const { getProductById } = useProductStore();
  const { fetchCoupons, couponList } = useCouponStore();
  const { createFinalOrder, isPaymentProcessing, fetchCashOnDeliverySetting, isCashOnDeliveryEnabled } =
    useOrderStore();
  const { data } = useSession();
  const { user } = data || {};
  const router = useRouter();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"CASH_ON_DELIVERY" | "PAY_NOW">();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    fetchCoupons();
    fetchAddresses();
    fetchCart();
    fetchCashOnDeliverySetting();
  }, [fetchAddresses, fetchCart, fetchCoupons, fetchCashOnDeliverySetting]);

  useEffect(() => {
    const findDefaultAddress = addresses.find((address) => address.isDefault);
    if (findDefaultAddress) {
      setSelectedAddress(findDefaultAddress.id);
    }
  }, [addresses]);

  useEffect(() => {
    const fetchIndividualProductDetails = async () => {
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );
      setCartItemsWithDetails(itemsWithDetails.filter((item) => item.product !== null));
    };

    fetchIndividualProductDetails();
  }, [items, getProductById]);

  function handleApplyCoupon() {
    const getCurrentCoupon = couponList.find((c) => c.code === couponCode);

    if (!getCurrentCoupon) {
      setCouponAppliedError("Invalid Coupon code");
      setAppliedCoupon(null);
      toast({ title: "Invalid Coupon code", variant: "destructive" });
      return;
    }

    const now = new Date();
    if (now < new Date(getCurrentCoupon.startDate) || now > new Date(getCurrentCoupon.endDate)) {
      setCouponAppliedError("Coupon is not valid at this time or has expired");
      setAppliedCoupon(null);
      toast({ title: "Coupon is not valid at this time or has expired", variant: "destructive" });
      return;
    }

    if (getCurrentCoupon.usageCount >= getCurrentCoupon.usageLimit) {
      setCouponAppliedError("Coupon has reached its usage limit! Please try a different coupon");
      setAppliedCoupon(null);
      toast({ title: "Coupon has reached its usage limit!", variant: "destructive" });
      return;
    }

    setAppliedCoupon(getCurrentCoupon);
    setCouponAppliedError("");
    toast({ title: "Coupon Applied Successfully!", variant: "default" });
  }

  const handleProceedToPayment = () => {
    if (!user) {
      toast({ title: "No user found! Please log in to continue.", variant: "destructive" });
      return;
    }

    if (!selectedAddress) {
      toast({ title: "Please select a delivery address", variant: "destructive" });
      return;
    }

    if (!checkoutEmail) {
      toast({ title: "Please enter your email address", variant: "destructive" });
      return;
    }

    setShowPaymentOptions(true);
  };

  const initiatePayNow = async () => {
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/initiate-payment`,
        {
          userId: user?.id,
          email: checkoutEmail,
          amount: total,
          firstName: user?.name?.split(" ")[0] || "Customer",
          lastName: user?.name?.split(" ")[1] || "",
          redirectUrl: `${window.location.origin}/order-confirmation`,
        },
        { withCredentials: true }
      );

      return response.data.paymentUrl;
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast({ title: "Failed to initiate payment", variant: "destructive" });
      return null;
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      toast({ title: "Please select a payment method", variant: "destructive" });
      return;
    }

    try {
      const orderData = {
        userId: user!.id,
        email: checkoutEmail,
        addressId: selectedAddress,
        items: cartItemsWithDetails.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productCategory: item.product.category?.name || "",
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images[0] || "",
          price: item.product.price,
        })),
        couponId: appliedCoupon?.id,
        total,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PENDING",
        paymentId: `${selectedPaymentMethod.toLowerCase()}-${Date.now().toString()}`,
      };

      if (selectedPaymentMethod === "CASH_ON_DELIVERY") {
        await createFinalOrder(orderData);
      }

      if (selectedPaymentMethod === "PAY_NOW") {
        setShowPaymentModal(true);
        const paymentUrl = await initiatePayNow();
        if (paymentUrl) {
          setPaymentLink(paymentUrl);
        }
        return;
      } else {
        await clearCart();
        toast({ title: "Order placed successfully!" });
        router.push("/order-confirmation");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "There was an error processing your order", variant: "destructive" });
    }
  };

  const handleProceedToPaymentPage = () => {
    if (paymentLink) {
      window.location.href = paymentLink;
    }
  };

  const subTotal = cartItemsWithDetails.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subTotal * appliedCoupon.discountPercent) / 100 : 0;
  const total = subTotal - discountAmount;

  if (isPaymentProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50 to-pink-50"
        }`}
      >
        <Skeleton className={`w-full max-w-2xl h-[400px] rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="h-full flex justify-center items-center">
            <motion.h1
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`text-2xl md:text-3xl font-bold ${isDark ? "text-indigo-400" : "text-indigo-800"}`}
            >
              Processing your order...
            </motion.h1>
          </div>
        </Skeleton>
      </motion.div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${bgGradient} transition-colors duration-300`}>
      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop with radial gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
            />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md"
            >
              <div className={`relative overflow-hidden rounded-2xl shadow-xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
                {/* Radial gradient background */}
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-pink-900/20 to-indigo-900/20"
                      : "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 via-pink-50 to-indigo-100"
                  } opacity-70`}
                />

                <div className="relative z-10 p-8">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-6"
                  >
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${accentGradient} flex items-center justify-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-center text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Ready to Complete Payment
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`text-center mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    You'll be redirected to our secure payment page to complete your transaction.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col space-y-3"
                  >
                    <Button
                      onClick={handleProceedToPaymentPage}
                      className={`w-full bg-gradient-to-r ${accentGradient} ${accentHoverGradient} text-white py-6 text-lg font-bold rounded-lg shadow-lg`}
                    >
                      Click Here to Proceed
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentModal(false)}
                      className={`w-full rounded-lg ${
                        isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-4xl font-extrabold text-center mb-8 ${
            isDark ? "text-white" : "text-indigo-900"
          }`}
        >
          Checkout
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className={`p-6 ${cardBg} backdrop-blur-sm border ${cardBorder} shadow-lg rounded-2xl`}>
                <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-indigo-400" : "text-indigo-800"}`}>
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-center ${secondaryTextColor}`}
                    >
                      No addresses found. Please add one.
                    </motion.p>
                  ) : (
                    <AnimatePresence>
                      {addresses.map((address, index) => (
                        <motion.div
                          key={address.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`flex items-start space-x-3 p-2 rounded-lg transition-colors ${
                            isDark ? "hover:bg-gray-700/50" : "hover:bg-indigo-50"
                          }`}
                        >
                          <Checkbox
                            id={address.id}
                            checked={selectedAddress === address.id}
                            onCheckedChange={() => setSelectedAddress(address.id)}
                            className={`mt-1 ${
                              isDark
                                ? "data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                : "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            }`}
                          />
                          <Label htmlFor={address.id} className="flex-grow">
                            <div className="flex items-center">
                              <span className={`font-medium ${textColor}`}>{address.name}</span>
                              {address.isDefault && (
                                <span
                                  className={`ml-2 text-sm px-2 py-1 rounded-full ${
                                    isDark ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-100"
                                  }`}
                                >
                                  Default
                                </span>
                              )}
                            </div>
                            <div className={`text-sm ${secondaryTextColor}`}>{address.address}</div>
                            <div className={`text-sm ${secondaryTextColor}`}>
                              {address.city}, {address.country}, {address.postalCode}
                            </div>
                            <div className={`text-sm ${secondaryTextColor}`}>{address.phone}</div>
                          </Label>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/account")}
                      className={`w-full bg-gradient-to-r ${primaryGradient} ${hoverGradient} text-white rounded-lg`}
                    >
                      Add a New Address
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                className={`p-6 ${cardBg} backdrop-blur-sm border ${
                  isDark ? "border-purple-900" : "border-purple-100"
                } shadow-lg rounded-2xl`}
              >
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-purple-400" : "text-purple-800"}`}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full rounded-lg ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white"
                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    }`}
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                  />
                  <p className={`text-sm ${secondaryTextColor}`}>We'll send your order confirmation to this email</p>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1"
          >
            <Card
              className={`p-6 sticky top-6 ${cardBg} backdrop-blur-sm border ${
                isDark ? "border-pink-900" : "border-pink-100"
              } shadow-xl rounded-2xl`}
            >
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-pink-400" : "text-pink-800"}`}>
                Order Summary
              </h2>
              <div className="space-y-4">
                {cartItemsWithDetails.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center ${secondaryTextColor}`}
                  >
                    Your cart is empty.
                  </motion.p>
                ) : (
                  <AnimatePresence>
                    {cartItemsWithDetails.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-4"
                      >
                        <div
                          className={`relative h-16 w-16 rounded-md overflow-hidden ${
                            isDark ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          {item.product?.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              priority
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center ${
                                isDark ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            >
                              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${textColor}`}>{item.product?.name}</h3>
                          <p className={`text-sm ${secondaryTextColor}`}>
                            {item.color} / {item.size}
                          </p>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className={`font-medium ${textColor}`}>
                          Kes {(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                <div className="space-y-3">
                  <Input
                    placeholder="Enter a Discount code or Gift code"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                    className={`rounded-lg ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-white"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    }`}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleApplyCoupon}
                      className={`w-full bg-gradient-to-r ${primaryGradient} ${hoverGradient} text-white rounded-lg`}
                    >
                      Apply Coupon
                    </Button>
                  </motion.div>
                  {couponAppliedError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}
                    >
                      {couponAppliedError}
                    </motion.p>
                  )}
                  {appliedCoupon && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-sm ${isDark ? "text-green-400" : "text-green-600"}`}
                    >
                      Coupon Applied Successfully!
                    </motion.p>
                  )}
                </div>
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={secondaryTextColor}>Subtotal</span>
                    <span className={textColor}>Kes {subTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className={`flex justify-between ${isDark ? "text-green-400" : "text-green-600"}`}>
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-Kes {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                <div className="flex justify-between font-medium text-lg">
                  <span className={textColor}>Total</span>
                  <span className={isDark ? "text-indigo-400" : "text-indigo-700"}>Kes {total.toFixed(2)}</span>
                </div>
                <Separator className={isDark ? "bg-gray-700" : "bg-gray-200"} />
                {(cartItemsWithDetails.length === 0 || !selectedAddress || !checkoutEmail) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm text-center ${isDark ? "text-red-400" : "text-red-500"}`}
                  >
                    Ensure you have items in your cart, a selected address, and a valid email
                  </motion.p>
                )}

                <AnimatePresence>
                  {!showPaymentOptions ? (
                    <motion.div
                      key="proceed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex justify-center"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          disabled={cartItemsWithDetails.length === 0 || !selectedAddress || !checkoutEmail}
                          className={`w-full bg-gradient-to-r ${accentGradient} ${accentHoverGradient} text-white py-6 text-lg font-bold rounded-lg`}
                          onClick={handleProceedToPayment}
                        >
                          Proceed to Payment
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <h3 className={`font-semibold text-lg ${isDark ? "text-indigo-400" : "text-indigo-800"}`}>
                        Select Payment Method
                      </h3>

                      {isCashOnDeliveryEnabled && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedPaymentMethod === "CASH_ON_DELIVERY"
                              ? `${isDark ? "border-indigo-500 bg-indigo-900/30" : "border-indigo-500 bg-indigo-50"}`
                              : `${
                                  isDark
                                    ? "border-gray-700 hover:bg-indigo-900/20"
                                    : "border-gray-200 hover:bg-indigo-50/50"
                                }`
                          } border`}
                          onClick={() => setSelectedPaymentMethod("CASH_ON_DELIVERY")}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                selectedPaymentMethod === "CASH_ON_DELIVERY"
                                  ? `${isDark ? "border-indigo-500 bg-indigo-500" : "border-indigo-500 bg-indigo-500"}`
                                  : `${isDark ? "border-gray-500" : "border-gray-300"}`
                              }`}
                            >
                              {selectedPaymentMethod === "CASH_ON_DELIVERY" && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <h4 className={`font-medium ${textColor}`}>Cash on Delivery</h4>
                              <p className={`text-sm ${secondaryTextColor}`}>Pay when you receive your order</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedPaymentMethod === "PAY_NOW"
                            ? `${isDark ? "border-indigo-500 bg-indigo-900/30" : "border-indigo-500 bg-indigo-50"}`
                            : `${
                                isDark
                                  ? "border-gray-700 hover:bg-indigo-900/20"
                                  : "border-gray-200 hover:bg-indigo-50/50"
                              }`
                        } border`}
                        onClick={() => {
                          setSelectedPaymentMethod("PAY_NOW");
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              selectedPaymentMethod === "PAY_NOW"
                                ? `${isDark ? "border-indigo-500 bg-indigo-500" : "border-indigo-500 bg-indigo-500"}`
                                : `${isDark ? "border-gray-500" : "border-gray-300"}`
                            }`}
                          >
                            {selectedPaymentMethod === "PAY_NOW" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium ${textColor}`}>Pay Now</h4>
                            <p className={`text-sm ${secondaryTextColor}`}>Pay instantly via card or mobile money</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          className={`w-full bg-gradient-to-r ${accentGradient} ${accentHoverGradient} text-white py-6 text-lg font-bold rounded-lg`}
                          onClick={handlePlaceOrder}
                          disabled={!selectedPaymentMethod}
                        >
                          {selectedPaymentMethod === "PAY_NOW" ? "Proceed to Payment" : "Place Order"}
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className={`w-full mt-2 rounded-lg ${
                            isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => setShowPaymentOptions(false)}
                        >
                          Back to Order Summary
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
