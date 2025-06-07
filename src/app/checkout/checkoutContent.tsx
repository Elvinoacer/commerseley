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
import { useAuthStore } from "@/store/useAuthStore";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { Coupon, useCouponStore } from "@/store/useCouponStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";

function CheckoutContent() {
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
  const { user } = useAuthStore();
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
          firstName: user?.name.split(" ")[0] || "Customer",
          lastName: user?.name.split(" ")[1] || "",
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
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50"
      >
        <Skeleton className="w-full max-w-2xl h-[400px] rounded-2xl">
          <div className="h-full flex justify-center items-center">
            <motion.h1
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl md:text-3xl font-bold text-indigo-800"
            >
              Processing your order...
            </motion.h1>
          </div>
        </Skeleton>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Radial gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 via-pink-50 to-indigo-100 opacity-70" />

                <div className="relative z-10 p-8">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
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
                    className="text-center text-2xl font-bold text-gray-900 mb-2"
                  >
                    Ready to Complete Payment
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-600 mb-6"
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
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-bold rounded-lg shadow-lg"
                    >
                      Click Here to Proceed
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentModal(false)}
                      className="w-full border-gray-300 hover:bg-gray-50 rounded-lg"
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
          className="text-3xl md:text-4xl font-extrabold text-center text-indigo-900 mb-8"
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
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-lg rounded-2xl">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800">Delivery Information</h2>
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-center">
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
                          className="flex items-start space-x-3 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                        >
                          <Checkbox
                            id={address.id}
                            checked={selectedAddress === address.id}
                            onCheckedChange={() => setSelectedAddress(address.id)}
                            className="mt-1 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                          <Label htmlFor={address.id} className="flex-grow">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-800">{address.name}</span>
                              {address.isDefault && (
                                <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700">{address.address}</div>
                            <div className="text-sm text-gray-600">
                              {address.city}, {address.country}, {address.postalCode}
                            </div>
                            <div className="text-sm text-gray-600">{address.phone}</div>
                          </Label>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/account")}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
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
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-100 shadow-lg rounded-2xl">
                <h3 className="text-xl font-semibold mb-4 text-purple-800">Contact Information</h3>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-600">We'll send your order confirmation to this email</p>
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
            <Card className="p-6 sticky top-6 bg-white/90 backdrop-blur-sm border border-pink-100 shadow-xl rounded-2xl">
              <h2 className="text-xl font-semibold text-pink-800 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItemsWithDetails.length === 0 ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-center">
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
                        <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                          {item.product?.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.product?.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.color} / {item.size}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          Kes {(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <Separator className="bg-gray-200" />
                <div className="space-y-3">
                  <Input
                    placeholder="Enter a Discount code or Gift code"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleApplyCoupon}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg"
                    >
                      Apply Coupon
                    </Button>
                  </motion.div>
                  {couponAppliedError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600">
                      {couponAppliedError}
                    </motion.p>
                  )}
                  {appliedCoupon && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600">
                      Coupon Applied Successfully!
                    </motion.p>
                  )}
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">Kes {subTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-Kes {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-indigo-700">Kes {total.toFixed(2)}</span>
                </div>
                <Separator className="bg-gray-200" />
                {(cartItemsWithDetails.length === 0 || !selectedAddress || !checkoutEmail) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center"
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
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 text-lg font-bold rounded-lg"
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
                      <h3 className="font-semibold text-lg text-indigo-800">Select Payment Method</h3>

                      {isCashOnDeliveryEnabled && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPaymentMethod === "CASH_ON_DELIVERY"
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:bg-indigo-50/50"
                          }`}
                          onClick={() => setSelectedPaymentMethod("CASH_ON_DELIVERY")}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                selectedPaymentMethod === "CASH_ON_DELIVERY"
                                  ? "border-indigo-500 bg-indigo-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedPaymentMethod === "CASH_ON_DELIVERY" && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Cash on Delivery</h4>
                              <p className="text-sm text-gray-600">Pay when you receive your order</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPaymentMethod === "PAY_NOW"
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:bg-indigo-50/50"
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod("PAY_NOW");
                          // setShowPaymentModal(true);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              selectedPaymentMethod === "PAY_NOW"
                                ? "border-indigo-500 bg-indigo-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedPaymentMethod === "PAY_NOW" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Pay Now</h4>
                            <p className="text-sm text-gray-600">Pay instantly via card or mobile money</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 text-lg font-bold rounded-lg"
                          onClick={handlePlaceOrder}
                          disabled={!selectedPaymentMethod}
                        >
                          {selectedPaymentMethod === "PAY_NOW" ? "Proceed to Payment" : "Place Order"}
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="w-full mt-2 border-gray-300 hover:bg-gray-100 rounded-lg"
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
