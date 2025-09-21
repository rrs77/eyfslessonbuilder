import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ServiceLocator } from '../services';
import { Class, ClassCategory, UserClass, AvailableCategory } from '../types';
import { ErrorHandler } from '../utils';
import { useAuth } from '../hooks/useAuth';
import { useData } from './DataContext';
import { useSettings } from './SettingsContext';

// Class Context Interface

interface ClassContextType {
  classes: Class[];
  userClasses: UserClass[];
  availableCategories: AvailableCategory[];
  loading: boolean;
  createClass: (classData: { name: string; displayName: string; description?: string; color?: string; categoryIds?: string[]; customAssessmentStatements?: string[]; classSpecificCategories?: Array<{name: string, color: string, description?: string}> }) => Promise<void>;
  updateClass: (classId: string, updates: { name?: string; displayName?: string; description?: string; color?: string; categoryIds?: string[]; customAssessmentStatements?: string[]; classSpecificCategories?: Array<{name: string, color: string, description?: string}> }) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  assignUserToClass: (userId: string, classId: string) => Promise<void>;
  getUserClasses: (userId: string) => Promise<void>;
  refreshClasses: () => Promise<void>;
  refreshAvailableCategories: () => Promise<void>;
  isAdmin: boolean;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export function ClassProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { subjects } = useSettings();
  const [classes, setClasses] = useState<Class[]>([]);
  const [userClasses, setUserClasses] = useState<UserClass[]>([]);
  const [availableCategories, setAvailableCategories] = useState<AvailableCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize services
  const classService = ServiceLocator.getClassService();
  const userClassService = ServiceLocator.getUserClassService();
  const categoryService = ServiceLocator.getCategoryService();

  // Check if user is admin
  const isAdmin = user?.email === 'rob.reichstorer@gmail.com' || 
                  user?.role === 'administrator';

  // Load classes from service layer
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const fetchedClasses = await classService.getAll();
        setClasses(fetchedClasses);
      } catch (error) {
        ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.loadClasses');
        // Set default classes if service fails
        const defaultClasses: Class[] = [
          { id: 'LKG', name: 'LKG', displayName: 'Lower Kindergarten', description: 'Lower Kindergarten class', color: '#10B981', isActive: true, categories: [], curriculumTargets: [] },
          { id: 'UKG', name: 'UKG', displayName: 'Upper Kindergarten', description: 'Upper Kindergarten class', color: '#3B82F6', isActive: true, categories: [], curriculumTargets: [] },
          { id: 'Reception', name: 'Reception', displayName: 'Reception', description: 'Reception class', color: '#8B5CF6', isActive: true, categories: [], curriculumTargets: [] }
        ];
        setClasses(defaultClasses);
      }
    };
    
    loadClasses();
  }, [classService]);

  // Load categories from SettingsContext
  useEffect(() => {
    if (subjects && subjects.length > 0) {
      // Get all categories from the first subject (Music Activities)
      const musicSubject = subjects[0];
      if (musicSubject && musicSubject.categories) {
        const categories: AvailableCategory[] = musicSubject.categories
          .filter(cat => cat.isActive)
          .map(cat => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            sortOrder: cat.position,
            subject: {
              id: musicSubject.id,
              name: musicSubject.name
            }
          }));
        
        setAvailableCategories(categories);
      }
      setLoading(false);
    }
  }, [subjects]);

  // Assign categories to classes when both are available
  useEffect(() => {
    if (classes.length > 0 && availableCategories.length > 0) {
      const updatedClasses = classes.map(cls => ({
        ...cls,
        categories: availableCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
          sortOrder: cat.sortOrder
        }))
      }));
      setClasses(updatedClasses);
    }
  }, [availableCategories]);

  // Load user classes if user is logged in
  useEffect(() => {
    if (user?.id && classes.length > 0) {
      getUserClasses(user.id);
    }
  }, [user?.id, classes.length]);

  const refreshClasses = async () => {
    try {
      const classesData = await classService.getAll();
      setClasses(classesData);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.refreshClasses');
    }
  };

  const refreshAvailableCategories = async () => {
    try {
      const categoriesData = await categoryService.getAvailableCategories();
      setAvailableCategories(categoriesData);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.refreshAvailableCategories');
    }
  };

  const createClass = async (classData: { name: string; displayName: string; description?: string; color?: string; categoryIds?: string[]; customAssessmentStatements?: string[]; classSpecificCategories?: Array<{name: string, color: string, description?: string}> }) => {
    try {
      const newClass = await classService.create(classData);
      setClasses(prev => [...prev, newClass]);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.createClass');
      throw error;
    }
  };

  const updateClass = async (classId: string, updates: { name?: string; displayName?: string; description?: string; color?: string; categoryIds?: string[]; customAssessmentStatements?: string[]; classSpecificCategories?: Array<{name: string, color: string, description?: string}> }) => {
    try {
      const updatedClass = await classService.update(classId, updates);
      setClasses(prev => prev.map(cls => cls.id === classId ? updatedClass : cls));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.updateClass');
      throw error;
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      await classService.delete(classId);
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.deleteClass');
      throw error;
    }
  };

  const assignUserToClass = async (userId: string, classId: string) => {
    try {
      await userClassService.assignUserToClass(userId, classId);
      await getUserClasses(userId);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.assignUserToClass');
      throw error;
    }
  };

  const getUserClasses = async (userId: string) => {
    try {
      const userClassesData = await userClassService.getUserClasses(userId);
      setUserClasses(userClassesData);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'ClassContext.getUserClasses');
      throw error;
    }
  };

  const value: ClassContextType = {
    classes,
    userClasses,
    availableCategories,
    loading,
    createClass,
    updateClass,
    deleteClass,
    assignUserToClass,
    getUserClasses,
    refreshClasses,
    refreshAvailableCategories,
    isAdmin
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClass() {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
}
