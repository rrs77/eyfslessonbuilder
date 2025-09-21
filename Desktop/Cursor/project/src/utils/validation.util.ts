// ============================================================================
// VALIDATION UTILITIES - Following DRY principles
// ============================================================================

import { ValidationRule, ValidationSchema } from '../types';

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const ValidationRules = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    required: true,
    custom: (value: any) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return null;
    }
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    custom: (value: string) => {
      if (typeof value === 'string' && value.length < min) {
        return message || `Must be at least ${min} characters long`;
      }
      return null;
    }
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    custom: (value: string) => {
      if (typeof value === 'string' && value.length > max) {
        return message || `Must be no more than ${max} characters long`;
      }
      return null;
    }
  }),

  email: (message: string = 'Invalid email format'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message;
      }
      return null;
    }
  }),

  url: (message: string = 'Invalid URL format'): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return message;
      }
      return null;
    }
  }),

  number: (message: string = 'Must be a valid number'): ValidationRule => ({
    custom: (value: any) => {
      if (value !== null && value !== undefined && isNaN(Number(value))) {
        return message;
      }
      return null;
    }
  }),

  positiveNumber: (message: string = 'Must be a positive number'): ValidationRule => ({
    custom: (value: any) => {
      const num = Number(value);
      if (value !== null && value !== undefined && (isNaN(num) || num <= 0)) {
        return message;
      }
      return null;
    }
  }),

  password: (message: string = 'Password must be at least 8 characters with uppercase, lowercase, and number'): ValidationRule => ({
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    custom: (value: string) => {
      if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value)) {
        return message;
      }
      return null;
    }
  })
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    const error = validateRule(value, rule);
    if (error) return error;
  }
  return null;
}

export function validateRule(value: any, rule: ValidationRule): string | null {
  // Required check
  if (rule.required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!rule.required && (value === null || value === undefined || value === '')) {
    return null;
  }

  // Min length check
  if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters long`;
  }

  // Max length check
  if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters long`;
  }

  // Pattern check
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

export function validateForm<T extends Record<string, any>>(
  data: T, 
  schema: ValidationSchema
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const fieldRules = Array.isArray(rules) ? rules : [rules];
    const error = validateField(value, fieldRules);
    
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// ============================================================================
// COMMON VALIDATION SCHEMAS
// ============================================================================

export const CommonSchemas = {
  user: {
    email: [ValidationRules.required(), ValidationRules.email()],
    name: [ValidationRules.required(), ValidationRules.minLength(2)],
    password: [ValidationRules.required(), ValidationRules.password()]
  },

  activity: {
    activity: [ValidationRules.required(), ValidationRules.minLength(3)],
    description: [ValidationRules.required(), ValidationRules.minLength(10)],
    time: [ValidationRules.required(), ValidationRules.positiveNumber()],
    category: [ValidationRules.required()],
    level: [ValidationRules.required()]
  },

  class: {
    name: [ValidationRules.required(), ValidationRules.minLength(2)],
    displayName: [ValidationRules.required(), ValidationRules.minLength(2)],
    description: [ValidationRules.minLength(10)],
    color: [ValidationRules.required()]
  },

  lesson: {
    title: [ValidationRules.required(), ValidationRules.minLength(3)],
    duration: [ValidationRules.required(), ValidationRules.positiveNumber()],
    className: [ValidationRules.required()]
  }
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

export function getFieldError(errors: Record<string, string>, field: string): string | undefined {
  return errors[field];
}

export function clearFieldError(errors: Record<string, string>, field: string): Record<string, string> {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

