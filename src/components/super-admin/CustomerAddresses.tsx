import { Address } from "@/types";

interface CustomerAddressesProps {
  addresses: Address[];
}

export default function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">No addresses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-lg p-4 sm:p-6 shadow-sm ${
            address.isDefault
              ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/50"
              : "border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
          } backdrop-blur-sm transition-colors`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {address.name}
              {address.isDefault && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200">
                  Default
                </span>
              )}
            </h3>
          </div>
          <div className="mt-3 sm:mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p className="break-words">{address.address}</p>
            <p className="break-words">
              {address.city}, {address.postalCode}
            </p>
            <p className="break-words">{address.country}</p>
            <a
              href={`tel:${address.phone}`}
              className="mt-1 sm:mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:underline text-sm sm:text-base"
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
