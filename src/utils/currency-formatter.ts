/**
 * Formats a number as currency
 *
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "KES", locale: string = "en-US"): string {
  // Handle null/undefined/NaN cases
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Kes 0.00";
  }

  // Format as currency
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Alternative version that returns the formatted value and its parts
 *
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns Object containing formatted string and its parts
 */
export function formatCurrencyDetailed(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): {
  formatted: string;
  currencySymbol: string;
  integerPart: string;
  decimalPart: string;
  raw: number;
} {
  // Handle null/undefined/NaN cases
  if (amount === null || amount === undefined || isNaN(amount)) {
    return {
      formatted: "Kes 0.00",
      currencySymbol: "Kes",
      integerPart: "0",
      decimalPart: "00",
      raw: 0,
    };
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  const parts = formatter.formatToParts(amount);

  let currencySymbol = "Kes";
  let integerPart = "";
  let decimalPart = "00";

  parts.forEach((part) => {
    switch (part.type) {
      case "currency":
        currencySymbol = part.value;
        break;
      case "integer":
        integerPart = part.value;
        break;
      case "fraction":
        decimalPart = part.value;
        break;
    }
  });

  return {
    formatted,
    currencySymbol,
    integerPart,
    decimalPart,
    raw: amount,
  };
}
