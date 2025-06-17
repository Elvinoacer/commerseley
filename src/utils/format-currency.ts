/**
 * Formats a number as currency with localization support
 *
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  options: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    locale = "en-US", // Default to US English
    currency = "USD", // Default to US Dollars
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Handle non-numbers and NaN/Infinite values
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "—"; // Return a dash for invalid amounts
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid locale or currency
    console.error("Currency formatting error:", error);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  }
};

// Alternative simplified version without Intl.NumberFormat
export const simpleFormatCurrency = (
  amount: number,
  currencySymbol: string = "$",
  decimalDigits: number = 2
): string => {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "—";
  }

  return `${currencySymbol}${amount.toFixed(decimalDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
