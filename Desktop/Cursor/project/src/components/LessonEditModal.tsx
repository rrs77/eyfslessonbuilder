import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Save, 
  Clock, 
  Users, 
  Search,
  Grid,
  List,
  Tag,
  ArrowUpDown,
  ArrowDownUp,
  MoreVertical,
  Plus,
  Check,
  Filter,
  Edit3,
  FolderOpen,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Eye
} from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { LessonDropZone } from './LessonDropZone';
import { ActivityDetails } from './ActivityDetails';
import { PostItNote } from './PostItNote';
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import type { Activity, LessonPlan } from '../contexts/DataContext';

// Define half-term periods
const HALF_TERMS = [
  { id: 'A1', name: 'Autumn 1', months: 'Sep-Oct' },
  { id: 'A2', name: 'Autumn 2', months: 'Nov-Dec' },
  { id: 'SP1', name: 'Spring 1', months: 'Jan-Feb' },
  { id: 'SP2', name: 'Spring 2', months: 'Mar-Apr' },
  { id: 'SM1', name: 'Summer 1', months: 'Apr-May' },
  { id: 'SM2', name: 'Summer 2', months: 'Jun-Jul' },
];

interface LessonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonNumber: string;
  lessonData: any;
  theme: any;
}

export function LessonEditModal({ isOpen, onClose, lessonNumber, lessonData, theme }: LessonEditModalProps) {
  console.log('LessonEditModal rendering:', { isOpen, lessonNumber, lessonData: !!lessonData, theme: !!theme });
  
  const { currentSheetInfo, allLessonsData, addOrUpdateUserLessonPlan, userCreatedLessonPlans, allActivities } = useData();
  const { categories } = useSettings();
  
  // Safe data access
  const safeLessonData = lessonData || {};
  const safeAllActivities = allActivities || [];
  const safeCategories = categories || [];
  
  // Error boundary - return early if critical data is missing
  if (!lessonData) {
    console.error('LessonEditModal: lessonData is null or undefined', { lessonNumber, lessonData, isOpen });
    return null;
  }
  
  // Initialize currentLessonPlan with existing lesson data or create new
  const [currentLessonPlan, setCurrentLessonPlan] = useState<LessonPlan>(() => {
    try {
      if (lessonData) {
        // Convert database lesson format to builder format
        const activities = Object.values(lessonData.grouped || {}).flat().map(activity => ({
          ...activity,
          _uniqueId: Date.now() + Math.random().toString(36).substring(2, 9)
        }));

        return {
          id: lessonData.id || `plan-${Date.now()}`,
          date: new Date(lessonData.date || new Date()),
          week: parseInt(lessonNumber) || 1,
          className: currentSheetInfo?.sheet || 'Unknown',
          activities: activities,
          duration: lessonData.totalTime || 0,
          notes: lessonData.notes || '',
          status: lessonData.status || 'draft',
          title: lessonData.title || `Lesson ${lessonNumber}`,
          term: lessonData.term || '',
          lessonNumber: lessonNumber,
          createdAt: new Date(lessonData.createdAt || new Date()),
          updatedAt: new Date(lessonData.updatedAt || new Date()),
          isEditingExisting: true
        };
      }
      
      return {
        id: `plan-${Date.now()}`,
        date: new Date(),
        week: 1,
        className: currentSheetInfo?.sheet || 'Unknown',
        activities: [],
        duration: 0,
        notes: '',
        status: 'draft',
        title: `Lesson ${lessonNumber}`,
        term: '',
        lessonNumber: lessonNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error initializing lesson plan:', error);
      // Return a safe default
      return {
        id: `plan-${Date.now()}`,
        date: new Date(),
        week: 1,
        className: 'Unknown',
        activities: [],
        duration: 0,
        notes: '',
        status: 'draft',
        title: `Lesson ${lessonNumber}`,
        term: '',
        lessonNumber: lessonNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'time' | 'level'>('category');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleUpdateLessonPlan = async (updatedPlan: LessonPlan) => {
    try {
      // Validate that the plan has a title
      if (!updatedPlan.title.trim()) {
        alert('Please provide a lesson title');
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
        return false;
      }
      
      // Make sure the lesson has a lesson number
      if (!updatedPlan.lessonNumber) {
        updatedPlan.lessonNumber = lessonNumber;
      }
      
      // Save the lesson plan using the context function
      await addOrUpdateUserLessonPlan(updatedPlan);
      
      setCurrentLessonPlan(updatedPlan);
      setSaveStatus('success');
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
      return true;
    } catch (error) {
      console.error('Failed to update lesson plan:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return false;
    }
  };

  const handleActivityAdd = (activity: Activity) => {
    // Create a deep copy of the activity to avoid reference issues
    const activityCopy = JSON.parse(JSON.stringify(activity));
    
    // Generate a unique ID for this activity instance to ensure it's treated as unique
    const uniqueActivity = {
      ...activityCopy,
      _uniqueId: Date.now() + Math.random().toString(36).substring(2, 9)
    };
    
    const updatedPlan = {
      ...currentLessonPlan,
      activities: [...currentLessonPlan.activities, uniqueActivity],
      duration: currentLessonPlan.duration + (uniqueActivity.time || 0),
    };
    
    setCurrentLessonPlan(updatedPlan);
    setHasUnsavedChanges(true);
  };

  const handleActivityRemove = (activityIndex: number) => {
    const removedActivity = currentLessonPlan.activities[activityIndex];
    const updatedPlan = {
      ...currentLessonPlan,
      activities: currentLessonPlan.activities.filter((_, index) => index !== activityIndex),
      duration: currentLessonPlan.duration - (removedActivity.time || 0),
    };
    setCurrentLessonPlan(updatedPlan);
    setHasUnsavedChanges(true);
  };

  const handleActivityReorder = (dragIndex: number, hoverIndex: number) => {
    const draggedActivity = currentLessonPlan.activities[dragIndex];
    const newActivities = [...currentLessonPlan.activities];
    newActivities.splice(dragIndex, 1);
    newActivities.splice(hoverIndex, 0, draggedActivity);
    
    const updatedPlan = {
      ...currentLessonPlan,
      activities: newActivities,
    };
    
    setCurrentLessonPlan(updatedPlan);
    setHasUnsavedChanges(true);
  };

  const handleLessonPlanFieldUpdate = (field: string, value: any) => {
    const updatedPlan = {
      ...currentLessonPlan,
      [field]: value
    };
    setCurrentLessonPlan(updatedPlan);
    setHasUnsavedChanges(true);
  };

  const handleSaveLessonPlan = () => {
    // Make sure the lesson has a lesson number
    if (!currentLessonPlan.lessonNumber) {
      const updatedPlan = {
        ...currentLessonPlan,
        lessonNumber
      };
      setCurrentLessonPlan(updatedPlan);
      const success = handleUpdateLessonPlan(updatedPlan);
      if (success) {
        setHasUnsavedChanges(false);
      }
    } else {
      const success = handleUpdateLessonPlan(currentLessonPlan);
      if (success) {
        setHasUnsavedChanges(false);
      }
    }
  };

  // Filter and sort activities for the library
  const filteredAndSortedActivities = React.useMemo(() => {
    let filtered = safeAllActivities.filter(activity => {
      const matchesSearch = activity.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || 
                          activity.level === selectedLevel || 
                          activity.level === 'All';
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort activities
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.activity.localeCompare(b.activity);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'time':
          comparison = a.time - b.time;
          break;
        case 'level':
          comparison = a.level.localeCompare(b.level);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [safeAllActivities, searchQuery, selectedCategory, selectedLevel, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Toggle activity selection
  const toggleActivitySelection = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    } else {
      setSelectedActivities(prev => [...prev, activityId]);
    }
  };

  // Add selected activities to lesson plan
  const addSelectedActivities = () => {
    // Find all selected activities
    const activitiesToAdd = safeAllActivities.filter(activity => {
      const activityId = `${activity.activity}-${activity.category}`;
      return selectedActivities.includes(activityId);
    });
    
    if (activitiesToAdd.length === 0) return;
    
    // Create a new array of activities with unique IDs
    const newActivities = activitiesToAdd.map(activity => {
      // Create a deep copy of the activity
      const activityCopy = JSON.parse(JSON.stringify(activity));
      
      // Add a unique ID
      return {
        ...activityCopy,
        _uniqueId: Date.now() + Math.random().toString(36).substring(2, 9)
      };
    });
    
    // Calculate new total duration
    const additionalDuration = newActivities.reduce((sum, activity) => sum + (activity.time || 0), 0);
    
    // Update the lesson plan
    const updatedPlan = {
      ...currentLessonPlan,
      activities: [...currentLessonPlan.activities, ...newActivities],
      duration: currentLessonPlan.duration + additionalDuration,
    };
    
    setCurrentLessonPlan(updatedPlan);
    setHasUnsavedChanges(true);
    
    // Clear selections after adding
    setSelectedActivities([]);
  };

  if (!isOpen) return null;

  // Simple fallback for debugging
  if (!lessonData || !theme) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">
            Missing lesson data or theme. Lesson: {lessonNumber}
          </p>
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden flex-shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold">Edit Lesson {lessonNumber}</h2>
              <p className="text-white text-opacity-90">Alter activity order, edit activities, and customise your lesson</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-3 text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-full">
              {/* Lesson Plan Details */}
              <div className="xl:col-span-2 flex flex-col space-y-4">
                <div className="flex-1">
                  <LessonDropZone
                    lessonPlan={currentLessonPlan}
                    onActivityAdd={handleActivityAdd}
                    onActivityRemove={handleActivityRemove}
                    onActivityReorder={handleActivityReorder}
                    onLessonPlanFieldUpdate={handleLessonPlanFieldUpdate}
                    isEditing={true}
                    onActivityClick={(activity) => setSelectedActivity(activity)}
                    onSave={handleSaveLessonPlan}
                    onSaveAndCreate={() => {
                      handleSaveLessonPlan();
                      onClose();
                    }}
                    hideNotes={true}
                  />
                </div>
                
                {/* Post-it Note for Lesson Notes */}
                <div className="mt-4">
                  <PostItNote
                    notes={currentLessonPlan.notes}
                    onNotesUpdate={(notes) => handleLessonPlanFieldUpdate('notes', notes)}
                    isEditing={true}
                    placeholder="Add lesson notes, reflections, challenges, or room for improvement..."
                  />
                </div>
              </div>

              {/* Activity Library Panel */}
              <div className="xl:col-span-1 flex flex-col">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
                  {/* Library Header */}
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-500 text-white flex-shrink-0">
                    <h3 className="text-lg font-semibold mb-3">Activity Library</h3>
                    
                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    {/* Filters */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent text-sm"
                      >
                        <option value="all" className="text-gray-900">All Categories</option>
                        {safeCategories.map(category => (
                          <option key={category.name} value={category.name} className="text-gray-900">
                            {category.name}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent text-sm"
                      >
                        <option value="all" className="text-gray-900">All Levels</option>
                        <option value="LKG" className="text-gray-900">LKG</option>
                        <option value="UKG" className="text-gray-900">UKG</option>
                        <option value="Reception" className="text-gray-900">Reception</option>
                      </select>
                    </div>
                    
                    {/* Add Selected Button */}
                    {selectedActivities.length > 0 && (
                      <button
                        onClick={addSelectedActivities}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add {selectedActivities.length} Selected {selectedActivities.length === 1 ? 'Activity' : 'Activities'}</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Activity List */}
                  <div className="flex-1 overflow-y-auto p-3 min-h-0">
                    {filteredAndSortedActivities.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No matching activities found</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredAndSortedActivities.map((activity, index) => {
                          const activityId = `${activity.activity}-${activity.category}`;
                          const isSelected = selectedActivities.includes(activityId);
                          
                          return (
                            <div 
                              key={`${activity._id || activity.id || activityId}-${index}`}
                              className={`relative bg-white rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer group ${
                                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              }`}
                              onClick={(e) => {
                                // If clicking on the checkbox area, toggle selection
                                if (e.target instanceof Element && e.target.closest('.checkbox-area')) {
                                  toggleActivitySelection(activityId);
                                } else {
                                  // Otherwise, open activity details
                                  setSelectedActivity(activity);
                                }
                              }}
                            >
                              {/* Checkbox */}
                              <div className="absolute top-3 right-3 z-10 checkbox-area">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-blue-600' : 'border-2 border-gray-300'
                                }`}>
                                  {isSelected && <Check className="h-3 w-3 text-white" />}
                                </div>
                              </div>
                              
                              <div className="pr-6">
                                <div className="flex items-start">
                                  <div 
                                    className="w-1 h-full rounded-full flex-shrink-0 mr-2"
                                    style={{ 
                                      backgroundColor: activity.category ? 
                                        safeCategories.find(cat => cat.name === activity.category)?.color || '#6B7280'
                                      : '#6B7280',
                                      minHeight: '40px'
                                    }}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900 text-sm">{activity.activity}</h4>
                                      <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-xs text-gray-500">{activity.category}</span>
                                      {activity.level && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                          {activity.level}
                                        </span>
                                      )}
                                      {activity.time > 0 && (
                                        <span className="text-xs text-gray-500 flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {activity.time}m
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DndProvider>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSaveLessonPlan();
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onAddToLesson={() => {
            // Add the activity to the current lesson plan
            handleActivityAdd(selectedActivity);
            setSelectedActivity(null);
          }}
          onUpdate={(updatedActivity) => {
            // Update the activity in the current lesson plan
            const updatedActivities = currentLessonPlan.activities.map(activity => 
              activity._uniqueId === selectedActivity._uniqueId ? updatedActivity : activity
            );
            setCurrentLessonPlan(prev => ({
              ...prev,
              activities: updatedActivities
            }));
            setHasUnsavedChanges(true);
            setSelectedActivity(null);
          }}
          onDelete={(activityId) => {
            // Remove the activity from the current lesson plan
            const updatedActivities = currentLessonPlan.activities.filter(activity => 
              activity._uniqueId !== selectedActivity._uniqueId
            );
            setCurrentLessonPlan(prev => ({
              ...prev,
              activities: updatedActivities
            }));
            setHasUnsavedChanges(true);
            setSelectedActivity(null);
          }}
          onDuplicate={(duplicatedActivity) => {
            // Add the duplicated activity to the lesson plan
            const uniqueDuplicatedActivity = {
              ...duplicatedActivity,
              _uniqueId: Date.now() + Math.random().toString(36).substring(2, 9)
            };
            setCurrentLessonPlan(prev => ({
              ...prev,
              activities: [...prev.activities, uniqueDuplicatedActivity]
            }));
            setHasUnsavedChanges(true);
            setSelectedActivity(null);
          }}
        />
      )}

      {/* Save Status Message */}
      {saveStatus !== 'idle' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`max-w-md w-full mx-auto px-6 py-4 rounded-lg shadow-xl transition-all duration-300 transform ${
            saveStatus === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {saveStatus === 'success' ? (
                <>
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-800">Lesson saved successfully!</h3>
                    <p className="text-sm text-green-600">Your lesson plan has been saved.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Failed to save lesson</h3>
                    <p className="text-sm text-red-600">Please provide a lesson title.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}