import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as XLSX from 'xlsx';
import { ServiceLocator } from '../services';
import { Activity, LessonData, LessonPlan, HalfTerm, Unit, SheetInfo } from '../types';
import { ErrorHandler } from '../utils';

// Data Context Interface
interface DataContextType {
  // State
  loading: boolean;
  currentSheetInfo: SheetInfo;
  
  // Activities
  activities: Activity[];
  addActivity: (activity: Activity) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  
  // Lessons
  lessons: Record<string, LessonData>;
  lessonNumbers: string[];
  updateLessonTitle: (lessonNumber: string, title: string) => void;
  updateLessonData: (lessonNumber: string, data: LessonData) => void;
  deleteLesson: (lessonNumber: string) => void;
  
  // Lesson Plans
  lessonPlans: LessonPlan[];
  addOrUpdateUserLessonPlan: (plan: LessonPlan) => Promise<void>;
  
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
  setCurrentSheetInfo: (info: SheetInfo) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  // Get services
  const activityService = ServiceLocator.getActivityService();
  const lessonService = ServiceLocator.getLessonService();
  const unitService = ServiceLocator.getUnitService();
  const halfTermService = ServiceLocator.getHalfTermService();
  const eyfsService = ServiceLocator.getEyfsService();

  // State
  const [currentSheetInfo, setCurrentSheetInfo] = useState<SheetInfo>({
    sheet: 'LKG',
    display: 'Lower Kindergarten',
    eyfs: 'LKG Statements'
  });
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lessonNumbers, setLessonNumbers] = useState<string[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Record<string, LessonData>>({});
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [halfTerms, setHalfTerms] = useState<HalfTerm[]>([
    { id: 'A1', lessons: [], isComplete: false },
    { id: 'A2', lessons: [], isComplete: false },
    { id: 'SP1', lessons: [], isComplete: false },
    { id: 'SP2', lessons: [], isComplete: false },
    { id: 'SM1', lessons: [], isComplete: false },
    { id: 'SM2', lessons: [], isComplete: false },
  ]);
  const [allEyfsStatements, setAllEyfsStatements] = useState<string[]>([]);
  const [eyfsStatements, setEyfsStatements] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Initial half-term structure (for new sheets)
  const initialHalfTerms = [
    { id: 'A1', lessons: [], isComplete: false },
    { id: 'A2', lessons: [], isComplete: false },
    { id: 'SP1', lessons: [], isComplete: false },
    { id: 'SP2', lessons: [], isComplete: false },
    { id: 'SM1', lessons: [], isComplete: false },
    { id: 'SM2', lessons: [], isComplete: false },
  ];

  // Load data on mount and when sheet changes
  useEffect(() => {
    loadAllData();
  }, [currentSheetInfo.sheet]);

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadActivities(),
        loadLessons(),
        loadEyfsStatements(),
        loadUnits(),
        loadLessonPlans(),
        loadHalfTerms()
      ]);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadAllData');
    } finally {
      setLoading(false);
    }
  };

  // Load activities
  const loadActivities = async () => {
    try {
      console.log('Loading activities...');
      const activitiesData = await activityService.getAll();
      console.log('Activities loaded:', activitiesData?.length || 0, 'activities');
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading activities:', error);
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadActivities');
      setActivities([]);
    }
  };

  // Load lessons
  const loadLessons = async () => {
    try {
      const lessonData = await lessonService.getAll();
      setLessons(lessonData);
      setLessonNumbers(Object.keys(lessonData));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadLessons');
      setLessons({});
      setLessonNumbers([]);
    }
  };


  // Load Units
  const loadUnits = async () => {
    try {
      const fetchedUnits = await unitService.getAll(currentSheetInfo.sheet);
      setUnits(fetchedUnits);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadUnits');
      setUnits([]);
    }
  };

  // Load Half Terms
  const loadHalfTerms = async () => {
    try {
      const fetchedHalfTerms = await halfTermService.getAll(currentSheetInfo.sheet);
      if (fetchedHalfTerms.length > 0) {
        setHalfTerms(fetchedHalfTerms);
      } else {
        // Initialize with default half-terms if none exist
        setHalfTerms(initialHalfTerms);
      }
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadHalfTerms');
      setHalfTerms(initialHalfTerms);
    }
  };

  // Load EYFS statements
  const loadEyfsStatements = async () => {
    try {
      const eyfsData = await eyfsService.getBySheet(currentSheetInfo.sheet);
      if (eyfsData) {
        // Remove duplicates from allStatements
        const uniqueStatements = [...new Set(eyfsData.allStatements || [])] as string[];
        setAllEyfsStatements(uniqueStatements);
        setEyfsStatements(eyfsData.structuredStatements || {});
      } else {
        setAllEyfsStatements([]);
        setEyfsStatements({});
      }
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadEyfsStatements');
      setAllEyfsStatements([]);
      setEyfsStatements({});
    }
  };

  // Load lesson plans
  const loadLessonPlans = async () => {
    try {
      const plans = await lessonService.getLessonPlans();
      setLessonPlans(plans);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.loadLessonPlans');
      setLessonPlans([]);
    }
  };

  // Activity management
  const addActivity = async (activity: Activity) => {
    try {
      const newActivity = await activityService.create(activity);
      setActivities(prev => [...prev, newActivity]);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.addActivity');
      throw error;
    }
  };

  const updateActivity = async (activity: Activity) => {
    try {
      const activityId = activity._id || activity.id;
      if (!activityId) {
        throw new Error('Activity ID is required for update');
      }
      const updatedActivity = await activityService.update(activityId, activity);
      setActivities(prev => prev.map(a => (a._id === activityId || a.id === activityId) ? updatedActivity : a));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.updateActivity');
      throw error;
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      await activityService.delete(activityId);
      setActivities(prev => prev.filter(a => a._id !== activityId && a.id !== activityId));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.deleteActivity');
      throw error;
    }
  };


  // Unit Management
  const addUnit = async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newUnit = await unitService.create(unit);
      setUnits(prev => [...prev, newUnit]);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.addUnit');
      throw error;
    }
  };

  const updateUnit = async (id: string, unit: Partial<Unit>) => {
    try {
      const updatedUnit = await unitService.update(id, unit);
      setUnits(prev => prev.map(u => u.id === id ? updatedUnit : u));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.updateUnit');
      throw error;
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      await unitService.delete(id);
      setUnits(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.deleteUnit');
      throw error;
    }
  };

  // Lesson management
  const updateLessonTitle = (lessonNumber: string, title: string) => {
    try {
      lessonService.updateTitle(lessonNumber, title);
      setLessons(prev => ({
        ...prev,
        [lessonNumber]: {
          ...prev[lessonNumber],
          title
        }
      }));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.updateLessonTitle');
    }
  };

  const updateLessonData = (lessonNumber: string, data: LessonData) => {
    try {
      lessonService.updateData(lessonNumber, data);
      setLessons(prev => ({
        ...prev,
        [lessonNumber]: data
      }));
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.updateLessonData');
    }
  };

  const deleteLesson = (lessonNumber: string) => {
    try {
      lessonService.delete(lessonNumber);
      const updatedLessons = { ...lessons };
      delete updatedLessons[lessonNumber];
      setLessons(updatedLessons);
      
      const updatedLessonNumbers = lessonNumbers.filter(num => num !== lessonNumber);
      setLessonNumbers(updatedLessonNumbers);
      
      // Remove from half-terms
      const updatedHalfTerms = halfTerms.map(term => ({
        ...term,
        lessons: term.lessons.filter(num => num !== lessonNumber)
      }));
      setHalfTerms(updatedHalfTerms);
      
      // Remove from units
      const updatedUnits = units.map(unit => ({
        ...unit,
        lessonNumbers: unit.lessonNumbers.filter(num => num !== lessonNumber)
      }));
      setUnits(updatedUnits);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.deleteLesson');
    }
  };

  // User lesson plans
  const addOrUpdateUserLessonPlan = async (plan: LessonPlan) => {
    try {
      const existingIndex = lessonPlans.findIndex(p => p.id === plan.id);
      let updatedPlan = { ...plan, updatedAt: new Date() };
      
      if (existingIndex >= 0) {
        // Update existing plan
        updatedPlan = await lessonService.updateLessonPlan(plan.id, updatedPlan);
      } else {
        // Create new plan
        updatedPlan = await lessonService.createLessonPlan(updatedPlan);
      }
      
      // Update local state
      let updatedPlans;
      if (existingIndex >= 0) {
        updatedPlans = [...lessonPlans];
        updatedPlans[existingIndex] = updatedPlan;
      } else {
        updatedPlans = [...lessonPlans, updatedPlan];
      }
      
      setLessonPlans(updatedPlans);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.addOrUpdateUserLessonPlan');
      throw error;
    }
  };

  // Half-term management
  const updateHalfTerm = async (halfTermId: string, lessons: string[], isComplete: boolean) => {
    try {
      await halfTermService.update(halfTermId, lessons, isComplete);
      const updatedHalfTerms = halfTerms.map(term => 
        term.id === halfTermId 
          ? { ...term, lessons, isComplete }
          : term
      );
      setHalfTerms(updatedHalfTerms);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.updateHalfTerm');
      throw error;
    }
  };

  const getLessonsForHalfTerm = (halfTermId: string): string[] => {
    const halfTerm = halfTerms.find(term => term.id === halfTermId);
    return halfTerm ? halfTerm.lessons : [];
  };

  const removeLessonFromHalfTerm = async (halfTermId: string, lessonNumber: string) => {
    try {
      await halfTermService.removeLesson(halfTermId, lessonNumber);
      const currentLessons = getLessonsForHalfTerm(halfTermId);
      const updatedLessons = currentLessons.filter(lesson => lesson !== lessonNumber);
      await updateHalfTerm(halfTermId, updatedLessons, false);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.removeLessonFromHalfTerm');
      throw error;
    }
  };

  const clearAllHalfTermAssignments = async () => {
    try {
      const clearedHalfTerms = halfTerms.map(term => ({
        ...term,
        lessons: [],
        isComplete: false
      }));
      
      // Update all half-terms using service
      for (const halfTerm of clearedHalfTerms) {
        await halfTermService.update(halfTerm.id, [], false);
      }
      
      setHalfTerms(clearedHalfTerms);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'DataContext.clearAllHalfTermAssignments');
      throw error;
    }
  };

  // EYFS Standards management
  const addEyfsToLesson = (lessonNumber: string, statement: string) => {
    const currentStatements = eyfsStatements[lessonNumber] || [];
    if (!currentStatements.includes(statement)) {
      const updatedStatements = {
        ...eyfsStatements,
        [lessonNumber]: [...currentStatements, statement]
      };
      setEyfsStatements(updatedStatements);
    }
  };

  const removeEyfsFromLesson = (lessonNumber: string, statement: string) => {
    const updatedEyfs = { ...eyfsStatements };
    if (updatedEyfs[lessonNumber]) {
      updatedEyfs[lessonNumber] = updatedEyfs[lessonNumber].filter(s => s !== statement);
    }
    setEyfsStatements(updatedEyfs);
  };

  // Data refresh
  const refreshData = async () => {
    await loadAllData();
  };

  // Excel file upload
  const uploadExcelFile = async (file: File): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Process the data and update activities
          const activities = processExcelData(jsonData);
          
          // Use service to create activities
          await activityService.createMany(activities);
          setActivities(prev => [...prev, ...activities]);
          
          resolve(undefined);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  // Process Excel data
  const processExcelData = (data: any[]): Activity[] => {
    if (data.length < 2) return [];
    
    const headers = data[0];
    const activities: Activity[] = [];
    let currentLessonNumber = '';
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;
      
      // Skip rows without category or activity name
      if (!row[1] || !row[2]) continue;

      // Handle lesson number logic - if empty, use the last seen lesson number
      if (row[0]) {
        currentLessonNumber = String(row[0]).trim();
      }

      // Parse time safely
      let time = 0;
      if (row[5]) {
        const timeStr = String(row[5]).trim();
        const parsedTime = parseInt(timeStr);
        if (!isNaN(parsedTime) && parsedTime >= 0) {
          time = parsedTime;
        }
      }

      // Format description with proper line breaks
      let description = String(row[3] || '').trim();
      
      // If description doesn't already contain HTML, convert newlines to <br> tags
      if (description && !description.includes('<')) {
        description = description.replace(/\n/g, '<br>');
      }
      
      const activity: Activity = {
        id: `imported-${Date.now()}-${i}`,
        activity: String(row[2] || '').trim(),
        description: description,
        time,
        videoLink: String(row[6] || '').trim(),
        musicLink: String(row[7] || '').trim(),
        backingLink: String(row[8] || '').trim(),
        resourceLink: String(row[9] || '').trim(),
        link: '',
        vocalsLink: '',
        imageLink: '',
        teachingUnit: String(row[1] || '').trim(),
        category: String(row[1] || '').trim(),
        level: String(row[4] || '').trim(),
        unitName: String(row[10] || '').trim(),
        lessonNumber: currentLessonNumber || '1'
      };
      
      activities.push(activity);
    }
    
    return activities;
  };

  const value: DataContextType = {
    // State
    loading,
    currentSheetInfo,
    
    // Activities
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    
    // Lessons
    lessons,
    lessonNumbers,
    updateLessonTitle,
    updateLessonData,
    deleteLesson,
    
    // Lesson Plans
    lessonPlans,
    addOrUpdateUserLessonPlan,
    
    // Units
    units,
    addUnit,
    updateUnit,
    deleteUnit,
    
    // Half-terms
    halfTerms,
    updateHalfTerm,
    getLessonsForHalfTerm,
    removeLessonFromHalfTerm,
    clearAllHalfTermAssignments,
    
    // EYFS
    eyfsStatements,
    allEyfsStatements,
    addEyfsToLesson,
    removeEyfsFromLesson,
    
    // Utilities
    refreshData,
    setCurrentSheetInfo,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}