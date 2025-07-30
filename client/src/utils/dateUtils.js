/**
 * Formats a date string into ISO format (YYYY-MM-DD).
 * Returns an empty string if input is falsy.
 * If the date is invalid or parsing fails, returns the original input.
 * 
 * @param {string} dateString - The input date string to format.
 * @returns {string} Formatted date string in 'YYYY-MM-DD' format or original input if invalid.
 */
export function formatDateISO(dateString) {
  if (!dateString) return ""; // Return empty string if input is falsy (null, undefined, "")

  try {
    const date = new Date(dateString); // Parse input into Date object

    if (isNaN(date.getTime())) 
      return dateString; // Return original string if Date is invalid

    // Extract year, month (0-based, so add 1), and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Pad month to 2 digits
    const day = String(date.getDate()).padStart(2, "0"); // Pad day to 2 digits

    // Return formatted string as 'YYYY-MM-DD'
    return `${year}-${month}-${day}`;
  } catch {
    // If an error occurs during parsing, return the original input
    return dateString;
  }
}
