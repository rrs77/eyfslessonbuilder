// ============================================================================
// DATA INTERFACES - Following Interface Segregation Principle
// ============================================================================

import { 
  Activity, 
  LessonData, 
  LessonPlan, 
  Unit, 
  HalfTerm, 
  EyfsData,
  SearchParams,
  ApiResponse 
} from '../types';

// ============================================================================
// ACTIVITY SERVICE INTERFACE
// ============================================================================

export interface IActivityService {
  // CRUD Operations
  getAll(): Promise<Activity[]>;
  getById(id: string): Promise<Activity | null>;
  create(activity: Omit<Activity, 'id' | '_id'>): Promise<Activity>;
  update(id: string, activity: Partial<Activity>): Promise<Activity>;
  delete(id: string): Promise<void>;
  
  // Search & Filter
  search(params: SearchParams): Promise<Activity[]>;
  getByCategory(category: string): Promise<Activity[]>;
  getByLevel(level: string): Promise<Activity[]>;
  
  // Bulk Operations
  createMany(activities: Omit<Activity, 'id' | '_id'>[]): Promise<Activity[]>;
  deleteMany(ids: string[]): Promise<void>;
}

// ============================================================================
// LESSON SERVICE INTERFACE
// ============================================================================

export interface ILessonService {
  // CRUD Operations
  getAll(): Promise<Record<string, LessonData>>;
  getByNumber(lessonNumber: string): Promise<LessonData | null>;
  updateTitle(lessonNumber: string, title: string): Promise<void>;
  updateData(lessonNumber: string, data: LessonData): Promise<void>;
  delete(lessonNumber: string): Promise<void>;
  
  // Lesson Plans
  getLessonPlans(): Promise<LessonPlan[]>;
  createLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<LessonPlan>;
  updateLessonPlan(id: string, plan: Partial<LessonPlan>): Promise<LessonPlan>;
  deleteLessonPlan(id: string): Promise<void>;
}

// ============================================================================
// UNIT SERVICE INTERFACE
// ============================================================================

export interface IUnitService {
  // CRUD Operations
  getAll(sheetName: string): Promise<Unit[]>;
  getById(id: string): Promise<Unit | null>;
  create(unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit>;
  update(id: string, unit: Partial<Unit>): Promise<Unit>;
  delete(id: string): Promise<void>;
}

// ============================================================================
// HALF-TERM SERVICE INTERFACE
// ============================================================================

export interface IHalfTermService {
  // CRUD Operations
  getAll(sheetName: string): Promise<HalfTerm[]>;
  getById(id: string, sheetName: string): Promise<HalfTerm | null>;
  update(id: string, lessons: string[], isComplete: boolean): Promise<HalfTerm>;
  addLesson(id: string, lessonNumber: string): Promise<void>;
  removeLesson(id: string, lessonNumber: string): Promise<void>;
  clearAll(id: string): Promise<void>;
}

// ============================================================================
// EYFS SERVICE INTERFACE
// ============================================================================

export interface IEyfsService {
  // Data Operations
  getAllStatements(): Promise<string[]>;
  getStructuredStatements(): Promise<Record<string, string[]>>;
  getBySheet(sheetName: string): Promise<EyfsData | null>;
  
  // Management
  addStatement(statement: string): Promise<void>;
  removeStatement(statement: string): Promise<void>;
  updateStatements(statements: string[]): Promise<void>;
}

// ============================================================================
// DATA CONTEXT INTERFACE
// ============================================================================

export interface IDataContext {
  // State
  loading: boolean;
  currentSheetInfo: { sheet: string; display: string; eyfs: string };
  
  // Activities
  activities: Activity[];
  addActivity: (activity: Activity) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  
  // Lessons
  lessons: Record<string, LessonData>;
  lessonNumbers: string[];
  updateLessonTitle: (lessonNumber: string, title: string) => void;
  updateLessonData: (lessonNumber: string, data: LessonData) => void;
  deleteLesson: (lessonNumber: string) => void;
  
  // Lesson Plans
  lessonPlans: LessonPlan[];
  addOrUpdateLessonPlan: (plan: LessonPlan) => Promise<void>;
  
  // Units
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUnit: (id: string, unit: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  
  // Half-terms
  halfTerms: HalfTerm[];
  updateHalfTerm: (id: string, lessons: string[], isComplete: boolean) => void;
  getLessonsForHalfTerm: (id: string) => string[];
  removeLessonFromHalfTerm: (id: string, lessonNumber: string) => void;
  clearAllHalfTermAssignments: () => void;
  
  // EYFS
  eyfsStatements: Record<string, string[]>;
  allEyfsStatements: string[];
  addEyfsToLesson: (lessonNumber: string, statement: string) => void;
  removeEyfsFromLesson: (lessonNumber: string, statement: string) => void;
  
  // Utilities
  refreshData: () => Promise<void>;
  setCurrentSheetInfo: (info: { sheet: string; display: string; eyfs: string }) => void;
}






