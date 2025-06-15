"use client";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/store/useAnalytics-Store";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AnalyticsDashboard = () => {
  const { analytics, isLoading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    if (!analytics || (analytics && Date.now() - (useAnalyticsStore.getState().lastFetched || 0) > 300000)) {
      fetchAnalytics();
    }
  }, [analytics, fetchAnalytics]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Chart options with responsive font sizes
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#6B7280",
          font: {
            family: "'Inter', sans-serif",
            size: 10, // Smaller font for mobile
          },
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 10, // Smaller font for mobile
        },
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            family: "'Inter', sans-serif",
            size: 10, // Smaller font for mobile
          },
        },
      },
      x: {
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            family: "'Inter', sans-serif",
            size: 10, // Smaller font for mobile
          },
        },
      },
    },
  };

  const darkChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        labels: {
          color: "#9CA3AF",
        },
      },
    },
    scales: {
      y: {
        ...chartOptions.scales.y,
        grid: {
          color: "rgba(31, 41, 55, 0.5)",
        },
        ticks: {
          color: "#9CA3AF",
        },
      },
      x: {
        ...chartOptions.scales.x,
        grid: {
          color: "rgba(31, 41, 55, 0.5)",
        },
        ticks: {
          color: "#9CA3AF",
        },
      },
    },
  };

  const StatCard = ({
    title,
    value,
    change,
    icon,
    className,
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    className?: string;
  }) => (
    <motion.div
      variants={fadeIn}
      className={cn(
        "p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border flex flex-col", // Smaller padding on mobile
        "bg-white dark:bg-gray-800/90 border-gray-200 dark:border-gray-700",
        "hover:shadow-md transition-all duration-200 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs sm:text-sm mt-1",
                change.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  // Loading state
  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full"
        />
      </div>
    );
  }

  // Error state
  if (error && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg max-w-md text-center bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 dark:text-red-400 mb-3 sm:mb-4">Error</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{error}</p>
          <Button
            onClick={fetchAnalytics}
            className="mt-3 sm:mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base"
          >
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg max-w-md text-center bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            No Data Available
          </h2>
          <Button
            onClick={fetchAnalytics}
            className="mt-3 sm:mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base"
          >
            Load Data
          </Button>
        </motion.div>
      </div>
    );
  }

  // Chart data configuration
  const orderStatusData = {
    labels: analytics.orders.byStatus.map((item) => item.status),
    datasets: [
      {
        label: "Orders by Status",
        data: analytics.orders.byStatus.map((item) => item.count),
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const paymentMethodData = {
    labels: analytics.orders.byPaymentMethod.map((item) => item.method),
    datasets: [
      {
        data: analytics.orders.byPaymentMethod.map((item) => item.count),
        backgroundColor: ["rgba(236, 72, 153, 0.7)", "rgba(139, 92, 246, 0.7)", "rgba(14, 165, 233, 0.7)"],
        borderColor: ["rgba(236, 72, 153, 1)", "rgba(139, 92, 246, 1)", "rgba(14, 165, 233, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const topSellingProductsData = {
    labels: analytics.products.topSelling.map((item) => item.name),
    datasets: [
      {
        label: "Units Sold",
        data: analytics.products.topSelling.map((item) => item.soldCount),
        backgroundColor: "rgba(79, 70, 229, 0.7)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
    ],
  };

  const userRolesData = {
    labels: analytics.users.byRole.map((item) => item.role),
    datasets: [
      {
        label: "Users by Role",
        data: analytics.users.byRole.map((item) => item.count),
        backgroundColor: ["rgba(244, 63, 94, 0.7)", "rgba(220, 38, 38, 0.7)", "rgba(234, 88, 12, 0.7)"],
        borderColor: ["rgba(244, 63, 94, 1)", "rgba(220, 38, 38, 1)", "rgba(234, 88, 12, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 sm:p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Insights and analytics for your business performance
          </p>
        </motion.div>

        {/* Stats Grid - Stack on mobile */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          <StatCard
            title="Total Users"
            value={analytics.users.total}
            change={`+${analytics.users.newUsers} new`}
            icon={<Icons.users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          />
          <StatCard
            title="Total Orders"
            value={analytics.orders.total}
            icon={<Icons.shoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />}
          />
          <StatCard
            title="Total Revenue"
            value={`Kes ${analytics.orders.revenue.toLocaleString()}`}
            icon={<Icons.dollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />}
          />
          <StatCard
            title="Avg. Order Value"
            value={`Kes ${analytics.orders.averageOrderValue.toFixed(2)}`}
            icon={<Icons.trendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />}
          />
        </motion.div>

        {/* Charts Section - Stack on mobile */}
        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Orders by Status
            </h3>
            <div className="h-48 sm:h-64">
              <Pie data={orderStatusData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Payment Methods
            </h3>
            <div className="h-48 sm:h-64">
              <Pie data={paymentMethodData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        {/* Top Selling Products - Full width on mobile */}
        <motion.div
          variants={fadeIn}
          className="bg-white dark:bg-gray-800/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Top Selling Products
          </h3>
          <div className="h-48 sm:h-64">
            <Bar data={topSellingProductsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Additional Stats - Stack on mobile */}
        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              User Distribution
            </h3>
            <div className="h-48 sm:h-64">
              <Bar data={userRolesData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Product Categories
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {analytics.categories.byCategory.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    <span className="text-gray-600 dark:text-gray-300">{category.productCount} products</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 sm:h-2 rounded-full"
                      style={{ width: `${(category.productCount / analytics.products.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          variants={fadeIn}
          className="bg-white dark:bg-gray-800/90 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Customer Reviews</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {analytics.reviews.totalReviews} total reviews
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mr-2 sm:mr-3">
                {analytics.reviews.averageRating.toFixed(1)}
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Icons.star
                    key={i}
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6",
                      i < Math.floor(analytics.reviews.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
