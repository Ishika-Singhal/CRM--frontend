// frontend/src/utils/helpers.js
// This file can contain various utility functions used across the frontend.

/**
 * Formats a date string into a more readable local date and time string.
 * @param {string|Date} dateInput - The date string or Date object.
 * @returns {string} Formatted date string.
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString(); // Uses user's locale for formatting
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// You can add more utility functions here as needed, e.g.:
// - Input validation helpers
// - Data transformation functions
// - UI related helpers (e.g., scroll to top)