import { Address, OrderWithItems, UserWithRelations } from "@/types";
import { formatCurrency } from "@/utils/currency-formatter";

interface CustomerStatsProps {
  customer: UserWithRelations;
  orders: OrderWithItems[];
  addresses: Address[];
}

export default function CustomerStats({ customer, orders, addresses }: CustomerStatsProps) {
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
  const totalItems = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {/* Total Spent */}
      <div className="bg-white/50 dark:bg-gray-700/50 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm transition-colors">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrency(totalSpent)}
        </p>
      </div>

      {/* Orders */}
      <div className="bg-white/50 dark:bg-gray-700/50 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm transition-colors">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Orders</h3>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {orders.length}
        </p>
      </div>

      {/* Avg. Order Value */}
      <div className="bg-white/50 dark:bg-gray-700/50 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm transition-colors">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Order</h3>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrency(averageOrderValue)}
        </p>
      </div>

      {/* Total Items */}
      <div className="bg-white/50 dark:bg-gray-700/50 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm transition-colors">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</h3>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {totalItems}
        </p>
      </div>
    </div>
  );
}
