import { OrderWithItems } from "@/types";
import { formatCurrency } from "@/utils/currency-formatter";
import { formatDate } from "@/utils/format-date";

interface CustomerOrdersProps {
  orders: OrderWithItems[];
}

export default function CustomerOrders({ orders }: CustomerOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">No orders found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view - Card layout */}
      <div className="sm:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">Order #{order.id.slice(0, 8)}</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                    : order.status === "SHIPPED"
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                    : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Total</p>
                <p className="text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Items</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Items
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                        : order.status === "SHIPPED"
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                        : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
