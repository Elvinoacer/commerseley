import { Address } from "@/types";

interface CustomerAddressesProps {
  addresses: Address[];
}

export default function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No addresses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-lg p-6 ${address.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              {address.name}
              {address.isDefault && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Default
                </span>
              )}
            </h3>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>{address.address}</p>
            <p>
              {address.city}, {address.postalCode}
            </p>
            <p>{address.country}</p>
            <a href={`tel:${address.phone}`} className="mt-2">
              Phone: {address.phone}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
