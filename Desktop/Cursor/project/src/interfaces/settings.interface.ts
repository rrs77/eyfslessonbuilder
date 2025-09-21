// ============================================================================
// SETTINGS INTERFACES - Following Interface Segregation Principle
// ============================================================================

import { 
  Subject, 
  Category, 
  Theme, 
  UserRole,
  SearchParams 
} from '../types';

// ============================================================================
// SUBJECT SERVICE INTERFACE
// ============================================================================

export interface ISubjectService {
  // CRUD Operations
  getAll(): Promise<Subject[]>;
  getById(id: string): Promise<Subject | null>;
  create(subject: Omit<Subject, 'id'>): Promise<Subject>;
  update(id: string, subject: Partial<Subject>): Promise<Subject>;
  delete(id: string): Promise<void>;
  
  // Search & Filter
  search(params: SearchParams): Promise<Subject[]>;
  getActive(): Promise<Subject[]>;
  
  // Categories
  getCategories(subjectId: string): Promise<Category[]>;
  addCategory(subjectId: string, category: Omit<Category, 'id'>): Promise<Category>;
  updateCategory(subjectId: string, categoryId: string, category: Partial<Category>): Promise<Category>;
  deleteCategory(subjectId: string, categoryId: string): Promise<void>;
}

// ============================================================================
// THEME SERVICE INTERFACE
// ============================================================================

export interface IThemeService {
  // Theme Management
  getCurrentTheme(): Theme;
  setTheme(theme: Theme): void;
  getThemeForClass(className: string): Theme;
  resetToDefault(): void;
  
  // Color Management
  getColorPalette(): string[];
  validateColor(color: string): boolean;
  generateColorScheme(baseColor: string): Theme;
}

// ============================================================================
// SETTINGS SERVICE INTERFACE
// ============================================================================

export interface ISettingsService {
  // School Settings
  getSchoolName(): string;
  setSchoolName(name: string): void;
  getSchoolLogo(): string;
  setSchoolLogo(logoUrl: string): void;
  
  // User Preferences
  getUserPreferences(userId: string): Record<string, any>;
  setUserPreference(userId: string, key: string, value: any): void;
  resetUserPreferences(userId: string): void;
  
  // System Settings
  getSystemSettings(): Record<string, any>;
  setSystemSetting(key: string, value: any): void;
  resetToDefaults(): void;
}

// ============================================================================
// PERMISSION SERVICE INTERFACE
// ============================================================================

export interface IPermissionService {
  // Permission Checks
  canAccess(userRole: UserRole, resource: string, action: string): boolean;
  hasPermission(userRole: UserRole, permission: string): boolean;
  canManageUsers(userRole: UserRole): boolean;
  canManageClasses(userRole: UserRole): boolean;
  canManageSettings(userRole: UserRole): boolean;
  
  // Role Hierarchy
  isRoleHigherThan(role1: UserRole, role2: UserRole): boolean;
  canManageRole(managerRole: UserRole, targetRole: UserRole): boolean;
}

// ============================================================================
// SETTINGS CONTEXT INTERFACE
// ============================================================================

export interface ISettingsContext {
  // State
  subjects: Subject[];
  categories: Category[];
  theme: Theme;
  schoolName: string;
  schoolLogo: string;
  loading: boolean;
  
  // Subject Management
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Category Management
  addCategory: (subjectId: string, category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (subjectId: string, categoryId: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (subjectId: string, categoryId: string) => Promise<void>;
  
  // Theme Management
  setTheme: (theme: Theme) => void;
  getThemeForClass: (className: string) => Theme;
  resetTheme: () => void;
  
  // School Settings
  setSchoolName: (name: string) => void;
  setSchoolLogo: (logoUrl: string) => void;
  
  // Utilities
  getCategoryColor: (categoryName: string) => string;
  resetToDefaults: () => void;
  refreshData: () => Promise<void>;
}

