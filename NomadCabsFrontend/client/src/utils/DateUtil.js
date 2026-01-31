/**
 * Safely format a date string to a readable format
 * @param {string|Date|null} dateValue - Date to format
 * @param {Object|string} options - Options object or fallback string (for backwards compatibility)
 * @param {string} options.locale - Locale (default: 'en-US')
 * @param {string} options.timeZone - Time zone (default: 'UTC')
 * @param {string} options.variant - 'date' | 'datetime' | 'time'
 * @param {string} options.fallback - Fallback value if date is invalid
 * @returns {string} Formatted date or fallback
 */
export const formatDateSafe = (dateValue, options = {}) => {
  // ✅ Support both old API (string fallback) and new API (options object)
  if (typeof options === 'string') {
    options = { fallback: options };
  }

  const {
    locale = 'en-US',
    timeZone = 'UTC',
    variant = 'date',
    fallback = '—',
  } = options;

  if (!dateValue) return fallback;

  try {
    let date;

    // ✅ Handle different date formats
    if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'string') {
      // ✅ Handle MySQL datetime format (YYYY-MM-DD HH:MM:SS)
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateValue)) {
        // Assume UTC for MySQL datetime
        date = new Date(dateValue.replace(' ', 'T') + 'Z');
      } else {
        // Standard ISO format or other formats
        date = new Date(dateValue);
      }
    } else {
      return fallback;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateValue);
      return fallback;
    }

    // Format based on variant
    let formatOptions = {};
    
    if (variant === 'datetime') {
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone,
      };
    } else if (variant === 'time') {
      formatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone,
      };
    } else {
      // date variant
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone,
      };
    }

    return date.toLocaleString(locale, formatOptions);
  } catch (error) {
    console.error("Error formatting date:", error, 'Input:', dateValue);
    return fallback;
  }
};

/**
 * Format date to ISO string (YYYY-MM-DD) for input fields
 * @param {string|Date|null} dateValue - Date to format
 * @returns {string} ISO date string or empty string
 */
export const formatDateToISO = (dateValue) => {
  if (!dateValue) return "";

  try {
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formatting date to ISO:", error);
    return "";
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateValue - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isDateInPast = (dateValue) => {
  if (!dateValue) return false;

  try {
    const date = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is expiring soon (within specified days)
 * @param {string|Date} dateValue - Date to check
 * @param {number} daysThreshold - Number of days to consider as "soon"
 * @returns {boolean} True if date is expiring soon
 */
export const isExpiringSoon = (dateValue, daysThreshold = 30) => {
  if (!dateValue) return false;

  try {
    const date = new Date(dateValue);
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(today.getDate() + daysThreshold);

    return date >= today && date <= threshold;
  } catch (error) {
    return false;
  }
};

/**
 * Get days until expiry
 * @param {string|Date} dateValue - Date to check
 * @returns {number|null} Number of days until expiry, or null if invalid
 */
export const getDaysUntilExpiry = (dateValue) => {
  if (!dateValue) return null;

  try {
    const date = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    return null;
  }
};

/**
 * Format timestamp to readable format with time
 * @param {string|Date} timestamp - Timestamp to format
 * @param {Object} options - Format options
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (timestamp, options = {}) => {
  if (!timestamp) return options.fallback || "—";

  try {
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return options.fallback || "—";
    }

    const locale = options.locale || 'en-US';
    const timeZone = options.timeZone || 'UTC';

    // Format as DD MMM YYYY, HH:MM (e.g., 15 Dec 2024, 14:30)
    const dateOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone,
    };
    
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    };

    const dateStr = date.toLocaleDateString(locale, dateOptions);
    const timeStr = date.toLocaleTimeString(locale, timeOptions);

    return `${dateStr}, ${timeStr}`;
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return options.fallback || "—";
  }
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} dateValue - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateValue) => {
  if (!dateValue) return "—";

  try {
    const date = new Date(dateValue);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return "—";
    }

    const diffMs = date - now;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (Math.abs(diffSeconds) < 60) {
      return "just now";
    } else if (Math.abs(diffMinutes) < 60) {
      return diffMinutes > 0 
        ? `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`
        : `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ago`;
    } else if (Math.abs(diffHours) < 24) {
      return diffHours > 0 
        ? `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`
        : `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ago`;
    } else if (Math.abs(diffDays) < 30) {
      return diffDays > 0 
        ? `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
        : `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
    } else {
      return formatDateSafe(dateValue);
    }
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "—";
  }
};

export default {
  formatDateSafe,
  formatDateToISO,
  isDateInPast,
  isExpiringSoon,
  getDaysUntilExpiry,
  formatTimestamp,
  getRelativeTime,
};