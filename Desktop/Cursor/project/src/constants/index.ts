// ============================================================================
// APPLICATION CONSTANTS - Following DRY principles
// ============================================================================

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  NAME: 'Creative Curriculum Designer',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional music lesson planning and viewing system for educators',
  AUTHOR: 'Rob Reichstorer',
  EMAIL: 'rob.reichstorer@gmail.com'
} as const;

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// ============================================================================
// USER ROLES
// ============================================================================

export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  SLT: 'slt',
  TEACHER: 'teacher',
  TA: 'ta'
} as const;

// ============================================================================
// PERMISSIONS
// ============================================================================

export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',
  
  // Class Management
  CLASS_CREATE: 'class:create',
  CLASS_READ: 'class:read',
  CLASS_UPDATE: 'class:update',
  CLASS_DELETE: 'class:delete',
  CLASS_MANAGE: 'class:manage',
  
  // Activity Management
  ACTIVITY_CREATE: 'activity:create',
  ACTIVITY_READ: 'activity:read',
  ACTIVITY_UPDATE: 'activity:update',
  ACTIVITY_DELETE: 'activity:delete',
  ACTIVITY_MANAGE: 'activity:manage',
  
  // Lesson Management
  LESSON_CREATE: 'lesson:create',
  LESSON_READ: 'lesson:read',
  LESSON_UPDATE: 'lesson:update',
  LESSON_DELETE: 'lesson:delete',
  LESSON_MANAGE: 'lesson:manage',
  
  // Settings Management
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_MANAGE: 'settings:manage',
  
  // System Management
  SYSTEM_MANAGE: 'system:manage',
  SYSTEM_READ: 'system:read'
} as const;

// ============================================================================
// CLASS CONFIGURATION
// ============================================================================

export const CLASS_CONFIG = {
  DEFAULT_CLASSES: [
    { id: 'LKG', name: 'LKG', displayName: 'Lower Kindergarten', color: '#10B981' },
    { id: 'UKG', name: 'UKG', displayName: 'Upper Kindergarten', color: '#3B82F6' },
    { id: 'Reception', name: 'Reception', displayName: 'Reception', color: '#8B5CF6' }
  ],
  
  LEVELS: ['All', 'LKG', 'UKG', 'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
  
  DEFAULT_COLOR: '#6B7280'
} as const;

// ============================================================================
// HALF-TERMS CONFIGURATION
// ============================================================================

export const HALF_TERMS_CONFIG = [
  { id: 'A1', name: 'Autumn 1', months: 'Sep-Oct' },
  { id: 'A2', name: 'Autumn 2', months: 'Nov-Dec' },
  { id: 'SP1', name: 'Spring 1', months: 'Jan-Feb' },
  { id: 'SP2', name: 'Spring 2', months: 'Mar-Apr' },
  { id: 'SM1', name: 'Summer 1', months: 'Apr-May' },
  { id: 'SM2', name: 'Summer 2', months: 'Jun-Jul' }
] as const;

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const THEME_CONFIG = {
  DEFAULT_THEME: {
    primary: '#2563EB',
    secondary: '#059669',
    accent: '#7C3AED'
  },
  
  CLASS_THEMES: {
    LKG: { primary: '#10B981', secondary: '#059669', accent: '#047857' },
    UKG: { primary: '#3B82F6', secondary: '#2563EB', accent: '#1D4ED8' },
    Reception: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#6D28D9' }
  },
  
  COLOR_PALETTE: [
    '#2563EB', // Blue
    '#059669', // Green
    '#7C3AED', // Purple
    '#DC2626', // Red
    '#EA580C', // Orange
    '#0891B2', // Cyan
    '#BE185D', // Pink
    '#65A30D'  // Lime
  ]
} as const;

// ============================================================================
// VALIDATION CONFIGURATION
// ============================================================================

export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TITLE_LENGTH: 200,
  MIN_ACTIVITY_NAME_LENGTH: 3,
  MAX_ACTIVITY_NAME_LENGTH: 100,
  MIN_ACTIVITY_DESCRIPTION_LENGTH: 10,
  MAX_ACTIVITY_DESCRIPTION_LENGTH: 1000
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  MODAL_SIZES: {
    SMALL: 'max-w-md',
    MEDIUM: 'max-w-lg',
    LARGE: 'max-w-2xl',
    EXTRA_LARGE: 'max-w-4xl',
    FULL: 'max-w-7xl'
  },
  
  ANIMATION_DURATION: 200,
  
  DEBOUNCE_DELAY: 300,
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  }
} as const;

// ============================================================================
// DATABASE TABLES
// ============================================================================

export const DB_TABLES = {
  ACTIVITIES: 'activities',
  LESSONS: 'lessons',
  LESSON_PLANS: 'user_lesson_plans',
  EYFS_STATEMENTS: 'eyfs_statements',
  YEAR_GROUPS: 'year_groups',
  UNITS: 'units',
  HALF_TERMS: 'half_terms',
  SUBJECTS: 'subjects',
  SUBJECT_CATEGORIES: 'subject_categories',
  CLASSES: 'classes',
  CLASS_CATEGORIES: 'class_categories',
  USER_CLASSES: 'user_classes'
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTH_ERROR',
  AUTHORIZATION_ERROR: 'AUTHZ_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND',
  CONFLICT_ERROR: 'CONFLICT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// ============================================================================
// STATUS CODES
// ============================================================================

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

// ============================================================================
// LESSON STATUS
// ============================================================================

export const LESSON_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const;

// ============================================================================
// ACTIVITY LEVELS
// ============================================================================

export const ACTIVITY_LEVELS = [
  'All',
  'LKG',
  'UKG',
  'Reception',
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Year 5',
  'Year 6'
] as const;

// ============================================================================
// EYFS DOMAINS
// ============================================================================

export const EYFS_DOMAINS = {
  COMMUNICATION_LANGUAGE: 'Communication and Language',
  PHYSICAL_DEVELOPMENT: 'Physical Development',
  PERSONAL_SOCIAL_EMOTIONAL: 'Personal, Social and Emotional Development',
  LITERACY: 'Literacy',
  MATHEMATICS: 'Mathematics',
  UNDERSTANDING_WORLD: 'Understanding the World',
  EXPRESSIVE_ARTS: 'Expressive Arts and Design'
} as const;

// ============================================================================
// FILE CONFIGURATION
// ============================================================================

export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_IMAGE_DIMENSIONS: { width: 2000, height: 2000 }
} as const;

