import { UserWithRelations } from "@/types";
import { formatDate } from "@/utils/format-date";

interface CustomerProfileProps {
  customer: UserWithRelations;
}

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  console.log("customer.wishlist", customer.wishlist);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{customer.name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <a
              href={`mailto:${customer.email}`}
              className="mt-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              aria-label={`Email ${customer.email}`}
            >
              {customer.email}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(customer.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Activity</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{customer.orders.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saved Addresses</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{customer.addresses.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cart Items</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{customer.cart?.items.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Wishlist Items</p>
            {/* @ts-ignore */}
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {customer.wishlist?.[0]?.product?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
