/**
 * Type Checking Utilities
 * 
 * Runtime type checking utilities to complement TypeScript's static type checking
 * and provide additional safety at runtime.
 */

/**
 * Checks if a value is a string
 * @param value The value to check
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a number
 * @param value The value to check
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Checks if a value is a boolean
 * @param value The value to check
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is an object
 * @param value The value to check
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks if a value is an array
 * @param value The value to check
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if a value is an array of strings
 * @param value The value to check
 */
export function isStringArray(value: unknown): value is string[] {
  return isArray(value) && value.every(isString);
}

/**
 * Checks if a value is a valid date
 * @param value The value to check
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Safely parses a JSON string, returning null on failure
 * @param jsonString The JSON string to parse
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

/**
 * Returns a default value if the input is null or undefined
 * @param value The input value
 * @param defaultValue The default value to use
 */
export function defaultIfNullOrUndefined<T>(value: T | null | undefined, defaultValue: T): T {
  return value === null || value === undefined ? defaultValue : value;
}

/**
 * Ensures a numeric value is within a specified range
 * @param value The numeric value to check
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 */
export function ensureRange(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
} 