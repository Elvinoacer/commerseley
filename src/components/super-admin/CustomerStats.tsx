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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(totalSpent)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Orders</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{orders.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(averageOrderValue)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{totalItems}</p>
      </div>
    </div>
  );
}
