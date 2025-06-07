/**
 * Formats a date with various options
 *
 * @param date - Date object, string, or timestamp
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: {
    style?: "short" | "medium" | "long" | "full" | "custom";
    format?: string;
    locale?: string;
    includeTime?: boolean;
    timeStyle?: "short" | "medium" | "long";
  } = {}
): string {
  // Parse input date
  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else if (typeof date === "number") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const { style = "medium", format = "", locale = "en-US", includeTime = false, timeStyle = "short" } = options;

  if (style === "custom" && format) {
    return customFormatDate(dateObj, format);
  }

  const dateStyles: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: "numeric", month: "short", year: "2-digit" },
    medium: { day: "numeric", month: "short", year: "numeric" },
    long: { day: "numeric", month: "long", year: "numeric" },
    full: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  };

  const timeStyles: Record<string, Intl.DateTimeFormatOptions> = {
    short: { hour: "numeric", minute: "2-digit" },
    medium: { hour: "numeric", minute: "2-digit", second: "2-digit" },
    long: { hour: "numeric", minute: "2-digit", second: "2-digit", timeZoneName: "short" },
  };

  const formatOptions: Intl.DateTimeFormatOptions = {
    ...(style !== "custom" ? dateStyles[style as Exclude<typeof style, "custom">] : {}),
    ...(includeTime ? timeStyles[timeStyle] : {}),
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * Custom date formatting using pattern
 *
 * @param date - Date object
 * @param format - Format pattern (e.g., 'YYYY-MM-DD')
 * @returns Formatted date string
 */
function customFormatDate(date: Date, format: string): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const replacements: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(-2),
    MMMM: new Intl.DateTimeFormat("en-US", { month: "long" }).format(date),
    MMM: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    MM: pad(date.getMonth() + 1),
    M: (date.getMonth() + 1).toString(),
    DD: pad(date.getDate()),
    D: date.getDate().toString(),
    dddd: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date),
    ddd: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
    HH: pad(date.getHours()),
    H: date.getHours().toString(),
    hh: pad(date.getHours() % 12 || 12),
    h: (date.getHours() % 12 || 12).toString(),
    mm: pad(date.getMinutes()),
    m: date.getMinutes().toString(),
    ss: pad(date.getSeconds()),
    s: date.getSeconds().toString(),
    A: date.getHours() < 12 ? "AM" : "PM",
    a: date.getHours() < 12 ? "am" : "pm",
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|A|a/g, (match) => replacements[match]);
}

/**
 * Returns relative time string (e.g., "2 days ago")
 *
 * @param date - Date to compare
 * @param baseDate - Reference date (default: now)
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: Date | string | number,
  baseDate: Date | string | number = new Date()
): string {
  const dateObj = typeof date === "object" ? date : new Date(date);
  const baseDateObj = typeof baseDate === "object" ? baseDate : new Date(baseDate);

  const seconds = Math.floor((baseDateObj.getTime() - dateObj.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return "just now";
}
