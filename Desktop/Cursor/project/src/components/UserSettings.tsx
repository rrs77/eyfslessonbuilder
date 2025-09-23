import React, { useState, useEffect } from 'react';
import { Settings, Upload, Palette, School, RotateCcw, X, Check, Plus, Trash2, GripVertical, Edit3, Save, Users } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { DataSourceSettings } from './DataSourceSettings';
import { ClassManagement } from './ClassManagement';
import { CurriculumTargetsManagement } from './CurriculumTargetsManagement';
import { useAuth } from '../hooks/useAuth';
import { yearGroupsApi } from '../config/api';

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSettings({ isOpen, onClose }: UserSettingsProps) {
  const { user } = useAuth();
  const { settings, updateSettings, resetToDefaults, categories, updateCategories, resetCategoriesToDefaults, customYearGroups, updateYearGroups, resetYearGroupsToDefaults } = useSettings();
  const [tempSettings, setTempSettings] = useState(settings);
  const [tempCategories, setTempCategories] = useState(categories);
  const [tempYearGroups, setTempYearGroups] = useState(customYearGroups);
  const [logoUploadStatus, setLogoUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'appearance' | 'curriculum' | 'data'>('appearance');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6B7280');
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [newYearGroupId, setNewYearGroupId] = useState('');
  const [newYearGroupName, setNewYearGroupName] = useState('');
  const [newYearGroupColor, setNewYearGroupColor] = useState('#3B82F6');
  const [editingYearGroup, setEditingYearGroup] = useState<string | null>(null);
  const [draggedYearGroup, setDraggedYearGroup] = useState<string | null>(null);
  const [isLoadingYearGroups, setIsLoadingYearGroups] = useState(false);
  const [yearGroupError, setYearGroupError] = useState<string | null>(null);
  
  // Category assignment state
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCategoriesForClass, setSelectedCategoriesForClass] = useState<Set<string>>(new Set());
  const [selectedCategoryElements, setSelectedCategoryElements] = useState<Set<string>>(new Set());
  const [classCategoryAssignments, setClassCategoryAssignments] = useState<Record<string, {
    categories: string[];
    elements: string[];
  }>>({});

  // Check if user is admin
  const isAdmin = user?.email === 'rob.reichstorer@gmail.com' || 
                  user?.role === 'administrator';

  // Update temp settings when settings change
  React.useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // Update temp categories when categories change
  React.useEffect(() => {
    setTempCategories(categories);
  }, [categories]);

  // Update temp year groups when year groups change
  React.useEffect(() => {
    setTempYearGroups(customYearGroups);
  }, [customYearGroups]);

  // Load year groups from database on component mount
  useEffect(() => {
    const loadYearGroupsFromDatabase = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoadingYearGroups(true);
        setYearGroupError(null);
        const dbYearGroups = await yearGroupsApi.getAll();
        
        if (dbYearGroups && dbYearGroups.length > 0) {
          // Convert database format to local format
          const convertedYearGroups = dbYearGroups.map(group => ({
            id: group.id,
            name: group.name,
            color: group.color
          }));
          setTempYearGroups(convertedYearGroups);
          updateYearGroups(convertedYearGroups);
        }
      } catch (error) {
        console.error('Failed to load year groups from database:', error);
        setYearGroupError('Failed to load year groups from database');
      } finally {
        setIsLoadingYearGroups(false);
      }
    };

    loadYearGroupsFromDatabase();
  }, [isOpen, updateYearGroups]);

  const handleSave = () => {
    updateSettings(tempSettings);
    updateCategories(tempCategories);
    updateYearGroups(tempYearGroups);
    onClose();
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setTempCategories(categories);
    setTempYearGroups(customYearGroups);
    onClose();
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLogoUploadStatus('error');
      setTimeout(() => setLogoUploadStatus('idle'), 3000);
      return;
    }

    try {
      setLogoUploadStatus('uploading');
      
      // Convert to base64 for demo purposes
      // In production, you'd upload to a proper image hosting service
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempSettings(prev => ({ ...prev, schoolLogo: result }));
        setLogoUploadStatus('success');
        setTimeout(() => setLogoUploadStatus('idle'), 3000);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Logo upload failed:', error);
      setLogoUploadStatus('error');
      setTimeout(() => setLogoUploadStatus('idle'), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      resetToDefaults();
      setTempSettings(settings);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    // Check if category already exists
    if (tempCategories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      alert('A category with this name already exists.');
      return;
    }
    
    // Add new category
    setTempCategories([
      ...tempCategories,
      {
        id: `category-${Date.now()}`,
        name: newCategoryName,
        color: newCategoryColor,
        position: tempCategories.length,
        isActive: true
      }
    ]);
    
    // Reset form
    setNewCategoryName('');
    setNewCategoryColor('#6B7280');
  };

  const handleDeleteCategory = (index: number) => {
    if (confirm('Are you sure you want to delete this category? This may affect existing activities.')) {
      const updatedCategories = tempCategories.filter((_, i) => i !== index);
      // Update positions
      updatedCategories.forEach((cat, i) => {
        cat.position = i;
      });
      setTempCategories(updatedCategories);
    }
  };

  const handleDragStart = (category: string) => {
    setDraggedCategory(category);
  };

  const handleDragOver = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory === targetCategory) return;
    
    const draggedIndex = tempCategories.findIndex(cat => cat.name === draggedCategory);
    const targetIndex = tempCategories.findIndex(cat => cat.name === targetCategory);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Reorder categories
    const newCategories = [...tempCategories];
    const [removed] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, removed);
    
    // Update positions
    newCategories.forEach((cat, i) => {
      cat.position = i;
    });
    
    setTempCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedCategory(null);
  };

  const handleResetCategories = () => {
    if (confirm('Are you sure you want to reset categories to defaults? This cannot be undone.')) {
      resetCategoriesToDefaults();
      setTempCategories(categories);
    }
  };

  // Year Group Management
  const handleAddYearGroup = async () => {
    if (!newYearGroupId.trim() || !newYearGroupName.trim()) return;
    
    // Check if year group already exists
    if (tempYearGroups.some(group => group.id.toLowerCase() === newYearGroupId.toLowerCase())) {
      alert('A year group with this ID already exists.');
      return;
    }
    
    try {
      setIsLoadingYearGroups(true);
      setYearGroupError(null);
      
      // Create in database
      const newYearGroup = await yearGroupsApi.create({
        id: newYearGroupId,
        name: newYearGroupName,
        color: newYearGroupColor
      });
      
      // Update local state
      const updatedYearGroups = [
        ...tempYearGroups,
        {
          id: newYearGroup.id,
          name: newYearGroup.name,
          color: newYearGroup.color
        }
      ];
      
      setTempYearGroups(updatedYearGroups);
      updateYearGroups(updatedYearGroups);
      
      // Reset form
      setNewYearGroupId('');
      setNewYearGroupName('');
      setNewYearGroupColor('#3B82F6');
    } catch (error) {
      console.error('Failed to create year group:', error);
      setYearGroupError('Failed to create year group');
    } finally {
      setIsLoadingYearGroups(false);
    }
  };

  const handleDeleteYearGroup = async (index: number) => {
    if (confirm('Are you sure you want to delete this year group? This may affect existing lessons.')) {
      const yearGroupToDelete = tempYearGroups[index];
      
      try {
        setIsLoadingYearGroups(true);
        setYearGroupError(null);
        
        // Delete from database
        await yearGroupsApi.delete(yearGroupToDelete.id);
        
        // Update local state
        const updatedYearGroups = tempYearGroups.filter((_, i) => i !== index);
        setTempYearGroups(updatedYearGroups);
        updateYearGroups(updatedYearGroups);
      } catch (error) {
        console.error('Failed to delete year group:', error);
        setYearGroupError('Failed to delete year group');
      } finally {
        setIsLoadingYearGroups(false);
      }
    }
  };

  const handleYearGroupDragStart = (yearGroupId: string) => {
    setDraggedYearGroup(yearGroupId);
  };

  const handleYearGroupDragOver = async (e: React.DragEvent, targetYearGroupId: string) => {
    e.preventDefault();
    if (!draggedYearGroup || draggedYearGroup === targetYearGroupId) return;
    
    const draggedIndex = tempYearGroups.findIndex(group => group.id === draggedYearGroup);
    const targetIndex = tempYearGroups.findIndex(group => group.id === targetYearGroupId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // Reorder year groups locally first
    const newYearGroups = [...tempYearGroups];
    const [removed] = newYearGroups.splice(draggedIndex, 1);
    newYearGroups.splice(targetIndex, 0, removed);
    
    setTempYearGroups(newYearGroups);
    
    // Update database with new order
    try {
      const orderedIds = newYearGroups.map(group => group.id);
      await yearGroupsApi.reorder(orderedIds);
    } catch (error) {
      console.error('Failed to reorder year groups:', error);
      setYearGroupError('Failed to reorder year groups');
    }
  };

  const handleYearGroupDragEnd = () => {
    setDraggedYearGroup(null);
  };

  const handleUpdateYearGroup = async (index: number, id: string, name: string, color: string) => {
    try {
      setIsLoadingYearGroups(true);
      setYearGroupError(null);
      
      // Update in database
      await yearGroupsApi.update(id, { name, color });
      
      // Update local state
      const updatedYearGroups = [...tempYearGroups];
      updatedYearGroups[index] = { id, name, color };
      setTempYearGroups(updatedYearGroups);
      updateYearGroups(updatedYearGroups);
      
      setEditingYearGroup(null);
    } catch (error) {
      console.error('Failed to update year group:', error);
      setYearGroupError('Failed to update year group');
    } finally {
      setIsLoadingYearGroups(false);
    }
  };

  const handleResetYearGroups = async () => {
    if (confirm('Are you sure you want to reset year groups to defaults? This cannot be undone.')) {
      try {
        setIsLoadingYearGroups(true);
        setYearGroupError(null);
        
        // Reset to defaults locally
        resetYearGroupsToDefaults();
        setTempYearGroups(customYearGroups);
        
        // Note: In a real implementation, you might want to delete all custom year groups from database
        // and recreate the defaults, but for now we'll just reset locally
      } catch (error) {
        console.error('Failed to reset year groups:', error);
        setYearGroupError('Failed to reset year groups');
      } finally {
        setIsLoadingYearGroups(false);
      }
    }
  };

  // Category assignment functions
  const getCategoryElements = (categoryName: string): string[] => {
    // Music and Drama specific elements for different year groups
    const categoryElements: Record<string, string[]> = {
      'Music': [
        'Singing & Voice', 'Rhythm & Beat', 'Melody & Tune', 'Instruments', 
        'Music Theory', 'Composition', 'Performance', 'Listening Skills',
        'Musical Games', 'Sound Exploration', 'Musical Stories', 'Dance & Movement'
      ],
      'Drama': [
        'Role Play', 'Character Development', 'Storytelling', 'Improvisation',
        'Voice & Speech', 'Movement & Gesture', 'Props & Costumes', 'Stage Presence',
        'Group Work', 'Creative Expression', 'Emotional Expression', 'Performance Skills'
      ]
    };
    
    return categoryElements[categoryName] || [];
  };

  const handleSaveCategoryAssignment = () => {
    if (!selectedClass || selectedCategoriesForClass.size === 0) return;
    
    const assignment = {
      categories: Array.from(selectedCategoriesForClass),
      elements: Array.from(selectedCategoryElements)
    };
    
    setClassCategoryAssignments(prev => ({
      ...prev,
      [selectedClass]: assignment
    }));
    
    // Reset selection
    setSelectedClass('');
    setSelectedCategoriesForClass(new Set());
    setSelectedCategoryElements(new Set());
    
    // Show success message
    alert(`Categories assigned successfully to ${tempYearGroups.find(yg => yg.id === selectedClass)?.name}!`);
  };

  const handleLoadClassAssignment = (classId: string) => {
    const assignment = classCategoryAssignments[classId];
    if (assignment) {
      setSelectedClass(classId);
      setSelectedCategoriesForClass(new Set(assignment.categories));
      setSelectedCategoryElements(new Set(assignment.elements));
    } else {
      setSelectedClass(classId);
      setSelectedCategoriesForClass(new Set());
      setSelectedCategoryElements(new Set());
    }
  };

  const presetLogos = [
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">User Settings</h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'appearance' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'curriculum' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Classes & Reading
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'data' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Data & Classes
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeTab === 'appearance' && (
            <>
              {/* Activity Categories */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Activity Categories</h3>
                  </div>
                  <button
                    onClick={handleResetCategories}
                    className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset to Default</span>
                  </button>
                </div>

                {/* Add New Category */}
                <div className="bg-white rounded-lg border border-indigo-200 p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Add New Category</h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        dir="ltr"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="color"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Category List */}
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Manage Categories</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop to reorder categories. Changes will affect how categories are displayed throughout the application.
                  </p>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {tempCategories.map((category, index) => (
                      <div 
                        key={category.name}
                        draggable
                        onDragStart={() => handleDragStart(category.name)}
                        onDragOver={(e) => handleDragOver(e, category.name)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 bg-white border rounded-lg transition-all duration-200 ${
                          draggedCategory === category.name 
                            ? 'opacity-50 border-indigo-400 bg-indigo-50' 
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {editingCategory === category.name ? (
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1 flex items-center space-x-2">
                              <input
                                type="text"
                                value={category.name}
                                onChange={(e) => {
                                  const updatedCategories = [...tempCategories];
                                  updatedCategories[index].name = e.target.value;
                                  setTempCategories(updatedCategories);
                                }}
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                dir="ltr"
                              />
                              <input
                                type="color"
                                value={category.color}
                                onChange={(e) => {
                                  const updatedCategories = [...tempCategories];
                                  updatedCategories[index].color = e.target.value;
                                  setTempCategories(updatedCategories);
                                }}
                                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                              />
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              >
                                <Save className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <div className="flex-1 font-medium text-gray-900" dir="ltr">{category.name}</div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => setEditingCategory(category.name)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(index)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Music & Drama Category Assignment to Classes */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Assign Music & Drama Categories to Classes</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Select which year groups should have access to Music and Drama categories, and choose specific elements within each category.
                </p>

                <div className="space-y-6">
                  {/* Class Selection */}
                  <div className="bg-white rounded-lg border border-green-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Select Class</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tempYearGroups.map((yearGroup) => {
                        const hasAssignment = classCategoryAssignments[yearGroup.id];
                        return (
                          <button
                            key={yearGroup.id}
                            onClick={() => handleLoadClassAssignment(yearGroup.id)}
                            className={`p-3 border-2 rounded-lg text-left transition-colors ${
                              selectedClass === yearGroup.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: yearGroup.color }}
                                ></div>
                                <span className="font-medium text-gray-900">{yearGroup.name}</span>
                              </div>
                              {hasAssignment && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <Check className="h-4 w-4" />
                                  <span className="text-xs">{hasAssignment.categories.length} categories</span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Assignment for Selected Class */}
                  {selectedClass && (
                    <div className="bg-white rounded-lg border border-green-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">
                          Assign Categories to {tempYearGroups.find(yg => yg.id === selectedClass)?.name}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {selectedCategoriesForClass.size} categories selected
                        </div>
                      </div>

                      <div className="space-y-4">
                        {tempCategories
                          .filter(category => category.name === 'Music' || category.name === 'Drama')
                          .length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <p className="text-sm">No Music or Drama categories found.</p>
                              <p className="text-xs mt-1">Please create Music and Drama categories first in the categories section above.</p>
                            </div>
                          ) : (
                            tempCategories
                              .filter(category => category.name === 'Music' || category.name === 'Drama')
                              .map((category) => (
                          <div key={category.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                <span className="font-medium text-gray-900">{category.name}</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedCategoriesForClass.has(category.id)}
                                  onChange={(e) => {
                                    const newSelected = new Set(selectedCategoriesForClass);
                                    if (e.target.checked) {
                                      newSelected.add(category.id);
                                    } else {
                                      newSelected.delete(category.id);
                                    }
                                    setSelectedCategoriesForClass(newSelected);
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                            
                            {/* Individual Category Elements Selection */}
                            {selectedCategoriesForClass.has(category.id) && (
                              <div className="ml-6 space-y-2">
                                <p className="text-sm text-gray-600 mb-2">Select specific elements:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {getCategoryElements(category.name).map((element, index) => {
                                    const elementId = `${category.id}-element-${index}`;
                                    return (
                                      <label key={elementId} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={selectedCategoryElements.has(elementId)}
                                          onChange={(e) => {
                                            const newSelected = new Set(selectedCategoryElements);
                                            if (e.target.checked) {
                                              newSelected.add(elementId);
                                            } else {
                                              newSelected.delete(elementId);
                                            }
                                            setSelectedCategoryElements(newSelected);
                                          }}
                                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-900">{element}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                          )}
                      </div>

                      {/* Save Assignment Button */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setSelectedClass('');
                            setSelectedCategoriesForClass(new Set());
                            setSelectedCategoryElements(new Set());
                          }}
                          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCategoryAssignment}
                          disabled={selectedCategoriesForClass.size === 0}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Assignment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'curriculum' && (
            <>
              {/* Year Group Management */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Year Group Management</h3>
                  </div>
                  <button
                    onClick={handleResetYearGroups}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset to Default</span>
                  </button>
                </div>

                {/* Add New Year Group */}
                <div className="bg-white rounded-lg border border-blue-200 p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Add New Year Group</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        ID (used in system)
                      </label>
                      <input
                        type="text"
                        value={newYearGroupId}
                        onChange={(e) => setNewYearGroupId(e.target.value)}
                        placeholder="e.g., Year1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={newYearGroupName}
                        onChange={(e) => setNewYearGroupName(e.target.value)}
                        placeholder="e.g., Year 1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Color
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={newYearGroupColor}
                          onChange={(e) => setNewYearGroupColor(e.target.value)}
                          className="h-9 w-9 rounded border border-gray-300 cursor-pointer"
                        />
                        <button
                          onClick={handleAddYearGroup}
                          disabled={!newYearGroupId.trim() || !newYearGroupName.trim() || isLoadingYearGroups}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          {isLoadingYearGroups ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          <span>{isLoadingYearGroups ? 'Adding...' : 'Add'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Note:</strong> The ID is used internally and should be unique. Changing IDs of existing year groups may affect data.
                  </p>
                </div>

                {/* Year Group List */}
                <div className="bg-white rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Manage Year Groups</h4>
                    {isLoadingYearGroups && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop to reorder year groups. Changes will affect how year groups are displayed throughout the application.
                  </p>
                  
                  {yearGroupError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-600">
                        <X className="h-4 w-4" />
                        <span className="text-sm">{yearGroupError}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {tempYearGroups.map((yearGroup, index) => (
                      <div 
                        key={yearGroup.id}
                        draggable
                        onDragStart={() => handleYearGroupDragStart(yearGroup.id)}
                        onDragOver={(e) => handleYearGroupDragOver(e, yearGroup.id)}
                        onDragEnd={handleYearGroupDragEnd}
                        className={`p-3 bg-white border rounded-lg transition-all duration-200 ${
                          draggedYearGroup === yearGroup.id 
                            ? 'opacity-50 border-blue-400 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {editingYearGroup === yearGroup.id ? (
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={yearGroup.id}
                                onChange={(e) => {
                                  const updatedYearGroups = [...tempYearGroups];
                                  updatedYearGroups[index].id = e.target.value;
                                  setTempYearGroups(updatedYearGroups);
                                }}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                dir="ltr"
                              />
                              <input
                                type="text"
                                value={yearGroup.name}
                                onChange={(e) => {
                                  const updatedYearGroups = [...tempYearGroups];
                                  updatedYearGroups[index].name = e.target.value;
                                  setTempYearGroups(updatedYearGroups);
                                }}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                dir="ltr"
                              />
                              <div className="flex space-x-2">
                                <input
                                  type="color"
                                  value={yearGroup.color}
                                  onChange={(e) => {
                                    const updatedYearGroups = [...tempYearGroups];
                                    updatedYearGroups[index].color = e.target.value;
                                    setTempYearGroups(updatedYearGroups);
                                  }}
                                  className="h-9 w-9 rounded border border-gray-300 cursor-pointer"
                                />
                                <button
                                  onClick={() => handleUpdateYearGroup(index, yearGroup.id, yearGroup.name, yearGroup.color)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                  <Save className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: yearGroup.color || '#6B7280' }}
                            ></div>
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-xs text-gray-500">ID:</span>
                                <span className="ml-1 font-medium text-gray-900" dir="ltr">{yearGroup.id}</span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Name:</span>
                                <span className="ml-1 font-medium text-gray-900" dir="ltr">{yearGroup.name}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => setEditingYearGroup(yearGroup.id)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteYearGroup(index)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning about changing IDs */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-600 flex-shrink-0 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Important Note About Year Group IDs</h4>
                    <p className="text-sm text-gray-600">
                      Changing the ID of an existing year group may affect lessons, activities, and other data associated with that year group. 
                      It's recommended to only change the display name and color of existing year groups, not their IDs.
                    </p>
                  </div>
                </div>
              </div>


              {/* Curriculum Targets Management */}
              <CurriculumTargetsManagement 
                isOpen={true} 
                onClose={() => {}} 
                embedded={true}
              />
            </>
          )}

          {activeTab === 'data' && isAdmin && (
            <>
              <ClassManagement 
                isOpen={true} 
                onClose={() => {}} 
              />
              <DataSourceSettings embedded={true} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to adjust a color's brightness
const adjustColor = (color: string, amount: number): string => {
  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);
  
  // Adjust RGB values
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};