// REPOSITORY SOURCE: diplomat-bit/aibankingnew | PATH: diplomat-bit-aibankingnew-a0c4868/src/lib/utils.ts
================================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/src/lib/utils.ts
================================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * Usage: cn("bg-red-500", condition && "text-white", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric amount into a currency string.
 * @param amount - The number to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale string (default: 'en-US').
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date into a readable string.
 * @param date - Date object, timestamp number, or date string.
 * @param options - Intl.DateTimeFormatOptions (default: Month Day, Year).
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(d, { month: "short", day: "numeric" });
}

/**
 * Formats a large number into a compact string (e.g., 1.2k, 1.5M).
 */
export function formatCompactNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/src/lib/utils.ts
================================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * Usage: cn("bg-red-500", condition && "text-white", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric amount into a currency string.
 * @param amount - The number to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale string (default: 'en-US').
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date into a readable string.
 * @param date - Date object, timestamp number, or date string.
 * @param options - Intl.DateTimeFormatOptions (default: Month Day, Year).
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(d, { month: "short", day: "numeric" });
}

/**
 * Formats a large number into a compact string (e.g., 1.2k, 1.5M).
 */
export function formatCompactNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

================================================================================
// APPENDED FROM REPO: diplomat-bit/gameover | ORIGINAL PATH: diplomat-bit-gameover-da1da3c/src/lib/utils.ts
================================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/src/lib/utils.ts
================================================================================

/**
 * A utility function for conditionally joining Tailwind CSS classes.
 *
 * @param args - A list of class names or objects where keys are class names and values are booleans.
 * @returns A string of joined class names.
 */
export function cn(...args: ClassValue[]): string {
  return twMerge(args);
}

// --- Dependencies ---

// This is a placeholder for the actual `twMerge` function from the `tailwind-merge` library.
// In a real project, you would install and import it:
// import { twMerge } from 'tailwind-merge';
// For this example, we'll provide a simplified mock implementation.

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: any };

function twMerge(classes: ClassValue[]): string {
  const validClasses: string[] = [];

  for (const classValue of classes) {
    if (typeof classValue === 'string' && classValue.length > 0) {
      validClasses.push(classValue);
    } else if (typeof classValue === 'object' && classValue !== null) {
      for (const key in classValue) {
        if (Object.prototype.hasOwnProperty.call(classValue, key) && classValue[key]) {
          validClasses.push(key);
        }
      }
    }
  }

  // In a real `twMerge`, this would handle conflicts and ordering.
  // For this mock, we'll just join them with spaces.
  return validClasses.join(' ');
}

// --- Example Usage (for demonstration, not part of the final output) ---
/*
// Assuming you have Tailwind CSS configured in your project.

// Example 1: Simple joining
const baseClasses = "text-blue-500 font-bold";
const hoverClasses = "hover:text-blue-700";
const combined = cn(baseClasses, hoverClasses);
// combined will be "text-blue-500 font-bold hover:text-blue-700"

// Example 2: Conditional classes
const isActive = true;
const isDisabled = false;
const conditional = cn("p-4", isActive && "bg-green-500", isDisabled && "opacity-50");
// conditional will be "p-4 bg-green-500"

// Example 3: Object syntax for conditional classes
const variant = "primary";
const buttonClasses = cn(
  "py-2 px-4 rounded",
  {
    "bg-blue-500 text-white": variant === "primary",
    "bg-gray-200 text-gray-800": variant === "secondary",
  },
  "focus:outline-none focus:ring-2 focus:ring-offset-2"
);
// If variant is "primary", buttonClasses will be "py-2 px-4 rounded bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
*/

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/src/lib/utils.ts
================================================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * Usage: cn("bg-red-500", condition && "text-white", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric amount into a currency string.
 * @param amount - The number to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale string (default: 'en-US').
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date into a readable string.
 * @param date - Date object, timestamp number, or date string.
 * @param options - Intl.DateTimeFormatOptions (default: Month Day, Year).
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(d, { month: "short", day: "numeric" });
}

/**
 * Formats a large number into a compact string (e.g., 1.2k, 1.5M).
 */
export function formatCompactNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

================================================================================
// APPENDED FROM REPO: diplomat-bit/my-appaibanking | ORIGINAL PATH: diplomat-bit-my-appaibanking-43962ef/src/lib/utils.ts
================================================================================

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}