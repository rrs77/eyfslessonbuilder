// ============================================================================
// CLASS INTERFACES - Following Interface Segregation Principle
// ============================================================================

import { 
  Class, 
  ClassCategory, 
  ClassSpecificCategory, 
  UserRole,
  SearchParams 
} from '../types';

// ============================================================================
// CLASS SERVICE INTERFACE
// ============================================================================

export interface IClassService {
  // CRUD Operations
  getAll(): Promise<Class[]>;
  getById(id: string): Promise<Class | null>;
  create(classData: CreateClassData): Promise<Class>;
  update(id: string, updates: UpdateClassData): Promise<Class>;
  delete(id: string): Promise<void>;
  
  // Search & Filter
  search(params: SearchParams): Promise<Class[]>;
  getByRole(role: UserRole): Promise<Class[]>;
  
  // Categories
  getCategories(classId: string): Promise<ClassCategory[]>;
  addCategory(classId: string, categoryId: string): Promise<void>;
  removeCategory(classId: string, categoryId: string): Promise<void>;
  
  // Custom Categories
  addCustomCategory(classId: string, category: ClassSpecificCategory): Promise<void>;
  removeCustomCategory(classId: string, categoryName: string): Promise<void>;
  
  // Assessment Statements
  addAssessmentStatement(classId: string, statement: string): Promise<void>;
  removeAssessmentStatement(classId: string, statement: string): Promise<void>;
  updateAssessmentStatements(classId: string, statements: string[]): Promise<void>;
}

// ============================================================================
// USER CLASS SERVICE INTERFACE
// ============================================================================

export interface IUserClassService {
  // User-Class Assignments
  assignUserToClass(userId: string, classId: string): Promise<void>;
  removeUserFromClass(userId: string, classId: string): Promise<void>;
  getUserClasses(userId: string): Promise<Class[]>;
  getClassUsers(classId: string): Promise<string[]>;
  
  // Bulk Operations
  assignUserToMultipleClasses(userId: string, classIds: string[]): Promise<void>;
  removeUserFromMultipleClasses(userId: string, classIds: string[]): Promise<void>;
}

// ============================================================================
// CATEGORY SERVICE INTERFACE
// ============================================================================

export interface ICategoryService {
  // CRUD Operations
  getAll(): Promise<ClassCategory[]>;
  getById(id: string): Promise<ClassCategory | null>;
  create(category: Omit<ClassCategory, 'id'>): Promise<ClassCategory>;
  update(id: string, category: Partial<ClassCategory>): Promise<ClassCategory>;
  delete(id: string): Promise<void>;
  
  // Search & Filter
  search(params: SearchParams): Promise<ClassCategory[]>;
  getByClass(classId: string): Promise<ClassCategory[]>;
  getAvailable(): Promise<ClassCategory[]>;
}

// ============================================================================
// CLASS CONTEXT INTERFACE
// ============================================================================

export interface IClassContext {
  // State
  classes: Class[];
  userClasses: Class[];
  availableCategories: ClassCategory[];
  loading: boolean;
  isAdmin: boolean;
  
  // Class Management
  createClass: (classData: CreateClassData) => Promise<void>;
  updateClass: (id: string, updates: UpdateClassData) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  refreshClasses: () => Promise<void>;
  
  // User-Class Management
  assignUserToClass: (userId: string, classId: string) => Promise<void>;
  removeUserFromClass: (userId: string, classId: string) => Promise<void>;
  getUserClasses: (userId: string) => Promise<void>;
  
  // Category Management
  refreshAvailableCategories: () => Promise<void>;
  
  // Utilities
  getClassById: (id: string) => Class | undefined;
  getClassesByRole: (role: UserRole) => Class[];
}

// ============================================================================
// DATA TRANSFER OBJECTS
// ============================================================================

export interface CreateClassData {
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  categoryIds?: string[];
  customAssessmentStatements?: string[];
  classSpecificCategories?: ClassSpecificCategory[];
}

export interface UpdateClassData {
  name?: string;
  displayName?: string;
  description?: string;
  color?: string;
  categoryIds?: string[];
  customAssessmentStatements?: string[];
  classSpecificCategories?: ClassSpecificCategory[];
}






