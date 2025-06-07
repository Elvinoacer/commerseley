// ... other imports
import { UserWithRelations } from "@/types";

// Update your fetch call to match Node.js API response
export const fetchCustomer = async (customerId: string) => {
  try {
    const response = await fetch(`/api/admin/customers/${customerId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (response.status === 403) {
      return { message: "You do not have permission to view this page" };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch customer data");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data as UserWithRelations;
  } catch (err) {
    return err instanceof Error ? err.message : "An unknown error occurred";
  }
};
