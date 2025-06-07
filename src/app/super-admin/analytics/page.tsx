"use client";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/store/useAnalytics-Store";
import { motion } from "framer-motion";
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

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AnalyticsDashboard = () => {
  const { analytics, isLoading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    // Fetch data if:
    // 1. We don't have analytics data OR
    // 2. The data is older than 5 minutes (300000 ms)
    if (!analytics || (analytics && Date.now() - (useAnalyticsStore.getState().lastFetched || 0) > 300000)) {
      fetchAnalytics();
    }
  }, [analytics, fetchAnalytics]);

  // Show loading state
  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full"
        />
      </div>
    );
  }

  // Show error state
  if (error && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no data (shouldn't happen with persistence)
  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Data Available</h2>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Data
          </button>
        </div>
      </div>
    );
  }

  // Data for charts
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

  const StatCard = ({
    title,
    value,
    change,
    icon,
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
  }) => (
    <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{change}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-7xl mx-auto">
        <motion.h1 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Dashboard Overview
        </motion.h1>

        {/* Stats Grid */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={analytics.users.total}
            change={`+${analytics.users.newUsers} new`}
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Total Orders"
            value={analytics.orders.total}
            icon={
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Total Revenue"
            value={`Kes ${analytics.orders.revenue.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Avg. Order Value"
            value={`Kes ${analytics.orders.averageOrderValue.toFixed(2)}`}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                />
              </svg>
            }
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
            <div className="h-64">
              <Pie
                data={orderStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="h-64">
              <Pie
                data={paymentMethodData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="h-64">
              <Bar
                data={topSellingProductsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="h-64">
              <Bar
                data={userRolesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
            <div className="space-y-4">
              {analytics.categories.byCategory.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <span className="text-gray-500">{category.productCount} products</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${(category.productCount / analytics.products.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
              <p className="text-gray-600">{analytics.reviews.totalReviews} total reviews</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="text-4xl font-bold text-gray-900 mr-3">{analytics.reviews.averageRating.toFixed(1)}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(analytics.reviews.averageRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
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
