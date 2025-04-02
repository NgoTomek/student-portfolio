/**
 * URL Sanitization Utilities
 * 
 * This file contains utility functions for sanitizing and validating URLs
 * to protect against XSS and other security issues.
 */

/**
 * Sanitizes a URL to prevent XSS attacks
 * Only allows http://, https://, mailto:, and tel: protocols
 * 
 * @param url The URL to sanitize
 * @returns A sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  
  // Trim the URL
  const trimmedUrl = url.trim();
  
  // Check if it's empty after trimming
  if (!trimmedUrl) return null;
  
  // Basic URL validation regex - allows http, https, mailto, and tel protocols
  const safeUrlPattern = /^(?:(?:https?|mailto|tel):\/\/|\/\/).+/i;
  
  // Handle relative URLs specially
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }
  
  // Check if the URL matches our safe pattern
  if (safeUrlPattern.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // If no protocol is specified, prepend https://
  if (!trimmedUrl.includes('://') && !trimmedUrl.startsWith('mailto:') && !trimmedUrl.startsWith('tel:')) {
    const urlWithProtocol = `https://${trimmedUrl}`;
    
    // Recheck with the added protocol
    if (safeUrlPattern.test(urlWithProtocol)) {
      return urlWithProtocol;
    }
  }
  
  // URL is potentially unsafe
  console.warn(`Potentially unsafe URL detected and blocked: ${trimmedUrl}`);
  return null;
}

/**
 * Returns a safe href attribute value
 * 
 * @param url The URL to sanitize
 * @returns A safe href value or undefined (which React will omit the attribute)
 */
export function safeHref(url: string | undefined | null): string | undefined {
  const sanitized = sanitizeUrl(url);
  
  // undefined will cause React to omit the href attribute entirely
  return sanitized || undefined;
}

/**
 * Validates if a string is a valid URL
 * 
 * @param url The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    // Try to create a URL object
    new URL(url);
    return true;
  } catch (error) {
    // If a URL with a protocol fails, try again with https://
    if (!url.includes('://')) {
      try {
        new URL(`https://${url}`);
        return true;
      } catch (error) {
        return false;
      }
    }
    
    return false;
  }
}

/**
 * Creates a safe URL for email addresses
 * 
 * @param email The email address to create a mailto link for
 * @returns A safe mailto URL or undefined
 */
export function safeMailto(email: string | undefined | null): string | undefined {
  if (!email) return undefined;
  
  const trimmedEmail = email.trim();
  
  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    console.warn(`Invalid email address detected: ${trimmedEmail}`);
    return undefined;
  }
  
  return `mailto:${trimmedEmail}`;
}

/**
 * Creates a safe URL for phone numbers
 * 
 * @param phone The phone number to create a tel link for
 * @returns A safe tel URL or undefined
 */
export function safeTel(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Basic validation - ensure we have at least some digits
  if (digits.length < 5) {
    console.warn(`Invalid phone number detected: ${phone}`);
    return undefined;
  }
  
  return `tel:${digits}`;
} 