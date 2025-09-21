import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ServiceLocator } from '../services';
import { Subject, Theme } from '../types';

// Local type definition
interface ClassTheme {
  [className: string]: Theme;
}
import { ErrorHandler } from '../utils';

// Settings Context Interface
interface Settings {
  schoolName: string;
  schoolLogo: string;
  customTheme: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface YearGroup {
  id: string;
  name: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  position: number;
  isActive: boolean;
}

interface SettingsContextType {
  // Legacy interface for backward compatibility
  subjects: Subject[];
  classThemes: ClassTheme;
  updateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  addCategory: (subjectId: string, category: Omit<Category, 'id'>) => void;
  updateCategory: (subjectId: string, categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (subjectId: string, categoryId: string) => void;
  resetToDefaults: () => void;
  getThemeForClass: (className: string) => Theme;
  updateClassTheme: (className: string, theme: Theme) => void;
  getCategoryColor: (categoryName: string) => string;
  
  // New interface for UserSettings component
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  categories: Category[];
  updateCategories: (categories: Category[]) => void;
  resetCategoriesToDefaults: () => void;
  customYearGroups: YearGroup[];
  updateYearGroups: (yearGroups: YearGroup[]) => void;
  resetYearGroupsToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default subjects and categories - matching Supabase database
const defaultSubjects: Subject[] = [
  {
    id: 'music-activities',
    name: 'Music Activities',
    categories: [
      { id: 'action-games-songs', name: 'Action/Games Songs', color: '#EF4444', position: 1, isActive: true },
      { id: 'core-songs', name: 'Core Songs', color: '#F97316', position: 2, isActive: true },
      { id: 'drama-games', name: 'Drama Games', color: '#F59E0B', position: 3, isActive: true },
      { id: 'general-game', name: 'General Game', color: '#EAB308', position: 4, isActive: true },
      { id: 'goodbye', name: 'Goodbye', color: '#84CC16', position: 5, isActive: true },
      { id: 'hello', name: 'Hello', color: '#22C55E', position: 6, isActive: true },
      { id: 'kodaly-action-songs', name: 'Kodaly Action Songs', color: '#10B981', position: 7, isActive: true },
      { id: 'kodaly-songs', name: 'Kodaly Songs', color: '#06B6D4', position: 8, isActive: true },
      { id: 'parachute-games', name: 'Parachute Games', color: '#6366F1', position: 9, isActive: true },
      { id: 'percussion-games', name: 'Percussion Games', color: '#14B8A6', position: 10, isActive: true },
      { id: 'rhythm', name: 'Rhythm', color: '#EC4899', position: 11, isActive: true },
      { id: 'rhythm-sticks', name: 'Rhythm Sticks', color: '#A855F7', position: 12, isActive: true },
      { id: 'scarf-songs', name: 'Scarf Songs', color: '#F472B6', position: 13, isActive: true },
      { id: 'singing', name: 'Singing', color: '#8B5CF6', position: 14, isActive: true },
      { id: 'teaching-units', name: 'Teaching Units', color: '#F43F5E', position: 15, isActive: true },
      { id: 'vocal-warm-ups', name: 'Vocal Warm-Ups', color: '#06B6D4', position: 16, isActive: true },
      { id: 'welcome', name: 'Welcome', color: '#8B5CF6', position: 17, isActive: true },
    ]
  }
];

// Modern professional color scheme inspired by Notion, Linear, and Vercel
const defaultClassThemes: ClassTheme = {
  'LKG': {
    primary: '#2563EB', // Modern blue
    secondary: '#1D4ED8', // Darker blue
    accent: '#3B82F6' // Lighter blue
  },
  'UKG': {
    primary: '#059669', // Modern green
    secondary: '#047857', // Darker green
    accent: '#10B981' // Lighter green
  },
  'Reception': {
    primary: '#7C3AED', // Modern purple
    secondary: '#6D28D9', // Darker purple
    accent: '#8B5CF6' // Lighter purple
  }
};

// Default settings for UserSettings component
const defaultSettings: Settings = {
  schoolName: 'My School',
  schoolLogo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  customTheme: false,
  primaryColor: '#3B82F6',
  secondaryColor: '#2563EB',
  accentColor: '#60A5FA'
};

// Default categories for UserSettings component
const defaultCategories: Category[] = [
  { id: 'action-games-songs', name: 'Action/Games Songs', color: '#EF4444', position: 1, isActive: true },
  { id: 'core-songs', name: 'Core Songs', color: '#F97316', position: 2, isActive: true },
  { id: 'drama-games', name: 'Drama Games', color: '#F59E0B', position: 3, isActive: true },
  { id: 'general-game', name: 'General Game', color: '#EAB308', position: 4, isActive: true },
  { id: 'goodbye', name: 'Goodbye', color: '#84CC16', position: 5, isActive: true },
  { id: 'hello', name: 'Hello', color: '#22C55E', position: 6, isActive: true },
  { id: 'kodaly-action-songs', name: 'Kodaly Action Songs', color: '#10B981', position: 7, isActive: true },
  { id: 'kodaly-songs', name: 'Kodaly Songs', color: '#06B6D4', position: 8, isActive: true },
  { id: 'parachute-games', name: 'Parachute Games', color: '#6366F1', position: 9, isActive: true },
  { id: 'percussion-games', name: 'Percussion Games', color: '#14B8A6', position: 10, isActive: true },
  { id: 'rhythm', name: 'Rhythm', color: '#EC4899', position: 11, isActive: true },
  { id: 'rhythm-sticks', name: 'Rhythm Sticks', color: '#A855F7', position: 12, isActive: true },
  { id: 'scarf-songs', name: 'Scarf Songs', color: '#F472B6', position: 13, isActive: true },
  { id: 'singing', name: 'Singing', color: '#8B5CF6', position: 14, isActive: true },
  { id: 'teaching-units', name: 'Teaching Units', color: '#F43F5E', position: 15, isActive: true },
  { id: 'vocal-warm-ups', name: 'Vocal Warm-Ups', color: '#06B6D4', position: 16, isActive: true },
  { id: 'welcome', name: 'Welcome', color: '#8B5CF6', position: 17, isActive: true }
];

// Default year groups for UserSettings component
const defaultYearGroups: YearGroup[] = [
  { id: 'LKG', name: 'LKG', color: '#2563EB' },
  { id: 'UKG', name: 'UKG', color: '#059669' },
  { id: 'Reception', name: 'Reception', color: '#7C3AED' }
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [classThemes, setClassThemes] = useState<ClassTheme>(() => {
    const saved = localStorage.getItem('curriculum-class-themes');
    return saved ? JSON.parse(saved) : defaultClassThemes;
  });
  
  // New state for UserSettings component
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('curriculum-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('curriculum-categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [customYearGroups, setCustomYearGroups] = useState<YearGroup[]>(() => {
    const saved = localStorage.getItem('curriculum-year-groups');
    return saved ? JSON.parse(saved) : defaultYearGroups;
  });

  // Initialize services
  const subjectService = ServiceLocator.getSubjectService();
  const themeService = ServiceLocator.getThemeService();
  const settingsService = ServiceLocator.getSettingsService();

  // Load subjects from service layer
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const loadedSubjects = await subjectService.getAll();
        
        if (loadedSubjects && loadedSubjects.length > 0) {
          setSubjects(loadedSubjects);
        } else {
          // If no subjects, use defaults and save them
          setSubjects(defaultSubjects);
          // Create subjects individually
          for (const subject of defaultSubjects) {
            await subjectService.create(subject);
          }
        }
      } catch (error) {
        ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.loadSubjects');
        // Fallback to defaults
        setSubjects(defaultSubjects);
      }
    };

    loadSubjects();
  }, [subjectService]);

  // No localStorage backup needed - all data managed by service layer

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('curriculum-class-themes', JSON.stringify(classThemes));
  }, [classThemes]);

  useEffect(() => {
    localStorage.setItem('curriculum-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('curriculum-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('curriculum-year-groups', JSON.stringify(customYearGroups));
  }, [customYearGroups]);

  // Helper functions removed - now handled by service layer

  const updateSubject = async (subjectId: string, updates: Partial<Subject>) => {
    try {
      const updatedSubject = await subjectService.update(subjectId, updates);
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId ? updatedSubject : subject
      ));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.updateSubject');
      throw error;
    }
  };

  const addCategory = async (subjectId: string, category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await subjectService.addCategory(subjectId, { ...category, isActive: true });
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, categories: [...subject.categories, newCategory] }
          : subject
      ));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.addCategory');
      throw error;
    }
  };

  const updateCategory = async (subjectId: string, categoryId: string, updates: Partial<Category>) => {
    try {
      const updatedCategory = await subjectService.updateCategory(subjectId, categoryId, updates);
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId 
          ? {
              ...subject,
              categories: subject.categories.map(category =>
                category.id === categoryId ? updatedCategory : category
              )
            }
          : subject
      ));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.updateCategory');
      throw error;
    }
  };

  const deleteCategory = async (subjectId: string, categoryId: string) => {
    try {
      await subjectService.deleteCategory(subjectId, categoryId);
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId 
          ? {
              ...subject,
              categories: subject.categories.filter(category => category.id !== categoryId)
            }
          : subject
      ));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.deleteCategory');
      throw error;
    }
  };

  const resetToDefaults = async () => {
    try {
      await settingsService.resetToDefaults();
      setSubjects(defaultSubjects);
      setClassThemes(defaultClassThemes);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.resetToDefaults');
      // Fallback to local reset
      setSubjects(defaultSubjects);
      setClassThemes(defaultClassThemes);
    }
  };

  const getThemeForClass = (className: string): Theme => {
    return themeService.getThemeForClass(className);
  };

  const updateClassTheme = async (className: string, theme: Theme) => {
    try {
      themeService.setTheme(theme);
      setClassThemes((prev: ClassTheme) => ({
        ...prev,
        [className]: theme
      }));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'SettingsContext.updateClassTheme');
      throw error;
    }
  };

  const getCategoryColor = (categoryName: string): string => {
    // First try to find in subjects (if available)
    if (subjects) {
      for (const subject of subjects) {
        const category = subject?.categories?.find(cat => cat.name === categoryName);
        if (category) {
          return category.color;
        }
      }
    }
    
    // If not found in subjects, use a predefined color mapping for activity categories
    const categoryColors: Record<string, string> = {
      'Kodaly Songs': '#EF4444',           // Red
      'Welcome': '#10B981',                 // Green
      'Vocal Warm-Ups': '#3B82F6',         // Blue
      'Core Songs': '#8B5CF6',             // Purple
      'Kodaly Action Songs': '#F59E0B',    // Amber
      'Action/Games Songs': '#EC4899',     // Pink
      'Rhythm Sticks': '#06B6D4',          // Cyan
      'Scarf Songs': '#84CC16',            // Lime
      'General Game': '#F97316',           // Orange
      'Parachute Games': '#6366F1',        // Indigo
      'Percussion Games': '#14B8A6',       // Teal
      'Goodbye': '#8B5CF6',                // Purple
      'Teaching Units': '#64748B',         // Slate
      'Drama Games': '#DC2626',            // Red
      'Rhythm': '#059669',                 // Emerald
      'Hello': '#0EA5E9',                  // Sky
      'Singing': '#A855F7'                 // Violet
    };
    
    return categoryColors[categoryName] || '#6B7280'; // Default gray if not found
  };

  // New functions for UserSettings component
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  const resetCategoriesToDefaults = () => {
    setCategories(defaultCategories);
  };

  const updateYearGroups = (newYearGroups: YearGroup[]) => {
    setCustomYearGroups(newYearGroups);
  };

  const resetYearGroupsToDefaults = () => {
    setCustomYearGroups(defaultYearGroups);
  };

  const value: SettingsContextType = {
    // Legacy interface for backward compatibility
    subjects,
    classThemes,
    updateSubject,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaults,
    getThemeForClass,
    updateClassTheme,
    getCategoryColor,
    
    // New interface for UserSettings component
    settings,
    updateSettings,
    categories,
    updateCategories,
    resetCategoriesToDefaults,
    customYearGroups,
    updateYearGroups,
    resetYearGroupsToDefaults
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}