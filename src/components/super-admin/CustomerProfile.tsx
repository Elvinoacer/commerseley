import { UserWithRelations } from "@/types";
import { formatDate } from "@/utils/format-date";

interface CustomerProfileProps {
  customer: UserWithRelations;
}

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  console.log("customer.wishlist", customer.wishlist);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="mt-1 text-sm text-gray-900">{customer.name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <a href={`mailto:${customer.email}`} className="mt-1 text-sm text-gray-900">
              {customer.email}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="mt-1 text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-1 text-sm text-gray-900">{customer.orders.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Saved Addresses</p>
            <p className="mt-1 text-sm text-gray-900">{customer.addresses.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cart Items</p>
            <p className="mt-1 text-sm text-gray-900">{customer.cart?.items.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wishlist Items</p>
            {/* @ts-ignore */}
            <p className="mt-1 text-sm text-gray-900">{customer.wishlist?.[0]?.product?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
