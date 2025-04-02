/**
 * Security Utilities
 * 
 * This file contains security-related utility functions to help prevent
 * common security vulnerabilities throughout the application.
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 * 
 * @param html The HTML content to sanitize
 * @returns Sanitized HTML content
 */
export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return '';
  
  // Convert to string if not already
  const htmlString = String(html);
  
  // Replace potentially dangerous tags and attributes
  return htmlString
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline event handlers
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    // Remove style attributes
    .replace(/style="[^"]*"/g, '')
    .replace(/style='[^']*'/g, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}

/**
 * Trims and sanitizes user input
 * 
 * @param input The user input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return '';
  
  // Convert to string if not already and trim
  const trimmedInput = String(input).trim();
  
  // Replace HTML entities
  return trimmedInput
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates an email address format
 * 
 * @param email The email address to validate
 * @returns True if the email format is valid
 */
export function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Checks if a password meets security requirements
 * 
 * @param password The password to check
 * @returns Object with validity result and reason if invalid
 */
export function validatePassword(password: string | undefined | null): { isValid: boolean; reason?: string } {
  if (!password) return { isValid: false, reason: 'Password is required' };
  
  if (password.length < 8) {
    return { isValid: false, reason: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, reason: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, reason: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, reason: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
}

/**
 * Checks if content contains potentially malicious code
 * 
 * @param content The content to check
 * @returns True if suspicious content detected
 */
export function containsSuspiciousContent(content: string | undefined | null): boolean {
  if (!content) return false;
  
  // Convert to string if not already
  const stringContent = String(content);
  
  // Patterns that might indicate malicious content
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /eval\(/i,
    /document\.cookie/i,
    /ondblclick/i,
    /onmouse/i,
    /onload/i,
    /onerror/i,
    /onclick/i,
    /onsubmit/i,
    /onchange/i,
    /onkeyup/i,
    /onkeydown/i,
    /onkeypress/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(stringContent));
} 