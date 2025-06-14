import { Address } from "@/types";

interface CustomerAddressesProps {
  addresses: Address[];
}

export default function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">No addresses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-lg p-6 shadow-sm ${
            address.isDefault
              ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/50"
              : "border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
          } backdrop-blur-sm transition-colors`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {address.name}
              {address.isDefault && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200">
                  Default
                </span>
              )}
            </h3>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p>{address.address}</p>
            <p>
              {address.city}, {address.postalCode}
            </p>
            <p>{address.country}</p>
            <a
              href={`tel:${address.phone}`}
              className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline"
              aria-label={`Call ${address.phone}`}
            >
              Phone: {address.phone}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
