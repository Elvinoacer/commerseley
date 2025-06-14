"use client";

import { protectCouponFormAction } from "@/actions/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Wand2, Sparkles, CalendarDays, Percent, Users, Ticket } from "lucide-react";

function SuperAdminManageCouponsPage() {
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  });
  const router = useRouter();
  const { toast } = useToast();
  const { createCoupon, isLoading } = useCouponStore();
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUniqueCoupon = async () => {
    setIsGeneratingCode(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setFormData((prev) => ({
      ...prev,
      code: result,
    }));
    setIsGeneratingCode(false);
  };

  const handleCouponSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({
        title: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    const checkCouponFormvalidation = await protectCouponFormAction();
    if (!checkCouponFormvalidation.success) {
      toast({
        title: checkCouponFormvalidation.error,
        variant: "destructive",
      });
      return;
    }

    const couponData = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercent.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    };

    const result = await createCoupon(couponData);
    if (result) {
      toast({
        title: "Coupon created successfully!",
        description: `${couponData.code} is now active.`,
      });

      router.push("/super-admin/coupons/list");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-xl p-6 mb-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-2xl font-extrabold text-white flex items-center gap-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              <Ticket className="h-6 w-6" />
              Create New Coupon
            </motion.h1>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
              <Sparkles className="h-6 w-6 text-yellow-300 dark:text-yellow-200" />
            </motion.div>
          </div>
          <motion.p
            className="text-purple-100 dark:text-purple-200 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create discount coupons for your customers
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleCouponSubmit}
          variants={containerVariants}
          className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-md overflow-hidden p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
        >
          {/* Date Range */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CalendarDays className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                value={formData.startDate}
                onChange={handleInputChange}
                name="startDate"
                type="date"
                className="mt-2 pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                required
                aria-label="Coupon start date"
              />
              <CalendarDays className="absolute left-3 top-9 h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>

            <div className="relative">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <CalendarDays className="h-4 w-4" />
                End Date
              </Label>
              <Input
                value={formData.endDate}
                onChange={handleInputChange}
                name="endDate"
                type="date"
                className="mt-2 pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                required
                aria-label="Coupon end date"
              />
              <CalendarDays className="absolute left-3 top-9 h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </motion.div>

          {/* Coupon Code */}
          <motion.div variants={itemVariants} className="mb-6">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Ticket className="h-4 w-4" />
              Coupon Code
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="text"
                name="code"
                placeholder="e.g. SUMMER20"
                className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                required
                value={formData.code}
                onChange={handleInputChange}
                aria-label="Coupon code"
              />
              <Button
                type="button"
                onClick={handleCreateUniqueCoupon}
                variant="outline"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                disabled={isGeneratingCode}
                aria-label="Generate unique coupon code"
              >
                <AnimatePresence mode="wait">
                  {isGeneratingCode ? (
                    <motion.span
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Wand2 className="h-4 w-4" />
                      </motion.span>
                      Generating...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="generate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Wand2 className="h-4 w-4" />
                      Generate
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </motion.div>

          {/* Discount Percentage */}
          <motion.div variants={itemVariants} className="mb-6">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Percent className="h-4 w-4" />
              Discount Percentage
            </Label>
            <div className="relative mt-2">
              <Input
                type="number"
                name="discountPercent"
                placeholder="e.g. 20 for 20% off"
                className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                min="1"
                max="100"
                required
                value={formData.discountPercent}
                onChange={handleInputChange}
                aria-label="Discount percentage"
              />
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </motion.div>

          {/* Usage Limits */}
          <motion.div variants={itemVariants} className="mb-8">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Users className="h-4 w-4" />
              Usage Limit
            </Label>
            <div className="relative mt-2">
              <Input
                type="number"
                name="usageLimit"
                placeholder="Number of times coupon can be used"
                className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                min="1"
                required
                value={formData.usageLimit}
                onChange={handleInputChange}
                aria-label="Coupon usage limit"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 hover:from-purple-700 dark:hover:from-purple-600 hover:to-indigo-700 dark:hover:to-indigo-600 py-6 text-lg font-bold shadow-lg text-white"
              aria-label="Create coupon"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="creating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Sparkles className="h-5 w-5" />
                    </motion.span>
                    Creating Coupon...
                  </motion.span>
                ) : (
                  <motion.span
                    key="create"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    Create Coupon
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.form>

        {/* Floating decorative elements */}
        <AnimatePresence>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20, x: Math.random() * 100 - 50 }}
              animate={{
                opacity: [0, 0.2, 0],
                y: [-20, Math.random() * 100 + 50],
                x: Math.random() * 100 - 50,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 10,
                delay: i * 2,
                repeat: Infinity,
              }}
              className="absolute text-purple-300 dark:text-purple-400 text-2xl pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: "10%",
              }}
            >
              {["🎟️", "✨", "🎉"][i % 3]}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default SuperAdminManageCouponsPage;
