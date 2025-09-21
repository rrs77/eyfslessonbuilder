// ============================================================================
// CORE TYPES - Centralized type definitions following DRY principles
// ============================================================================

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

export type UserRole = 'teacher' | 'ta' | 'slt' | 'administrator';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  token?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  purchasedItems?: string[];
  passwordLastChanged?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// ============================================================================
// CURRICULUM & EDUCATION
// ============================================================================

export interface Class {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  isActive: boolean;
  categories: ClassCategory[];
  curriculumTargets: string[];
  customAssessmentStatements?: string[];
  classSpecificCategories?: ClassSpecificCategory[];
}

export interface ClassCategory {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

export interface ClassSpecificCategory {
  name: string;
  color: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  position: number;
  isActive: boolean;
}

export interface CurriculumTarget {
  id: string;
  subject: string;
  yearGroup: string;
  domain: string;
  statement: string;
}

// ============================================================================
// ACTIVITIES & LESSONS
// ============================================================================

export interface Activity {
  _id?: string;
  id?: string;
  activity: string;
  description: string;
  activityText?: string;
  time: number;
  videoLink: string;
  musicLink: string;
  backingLink: string;
  resourceLink: string;
  link: string;
  vocalsLink: string;
  imageLink: string;
  teachingUnit: string;
  category: string;
  level: string;
  unitName: string;
  lessonNumber: string;
  eyfsStandards?: string[];
  yearGroups?: string[];
  htmlDescription?: string;
  uniqueId?: string;
}

export interface PrivateActivity extends Activity {
  name: string;
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
}

export interface LessonData {
  title?: string;
  totalTime: number;
  grouped: Record<string, Activity[]>;
  eyfsStandards?: string[];
}

export interface LessonPlan {
  id: string;
  title: string;
  lessonNumber?: string;
  className: string;
  activities: Activity[];
  duration: number;
  notes: string;
  status: 'draft' | 'published' | 'archived';
  term?: string;
  week: number;
  date: Date;
  unitId?: string;
  unitName?: string;
  createdAt: Date;
  updatedAt: Date;
  isEditingExisting?: boolean;
}

// ============================================================================
// UNITS & TERMS
// ============================================================================

export interface Unit {
  id: string;
  name: string;
  description: string;
  lessonNumbers: string[];
  color: string;
  term?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HalfTerm {
  id: string;
  lessons: string[];
  isComplete: boolean;
}

export interface SheetInfo {
  sheet: string;
  display: string;
  eyfs: string;
}

// ============================================================================
// EYFS & ASSESSMENT
// ============================================================================

export interface EyfsStatement {
  domain: string;
  subdomain: string;
  statement: string;
}

export interface EyfsData {
  allStatements: string[];
  structuredStatements: Record<string, string[]>;
}

// ============================================================================
// UI & COMPONENTS
// ============================================================================

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================================================
// API & DATA
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

// ============================================================================
// PERMISSIONS
// ============================================================================

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// ============================================================================
// UTILITIES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

