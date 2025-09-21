import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Palette, 
  Tag,
  Save,
  RotateCcw
} from 'lucide-react';
import { useClass } from '../contexts/ClassContext';
// import { useCurriculum } from '../contexts/CurriculumContext';
import type { Class, AvailableCategory } from '../contexts/ClassContext';

interface ClassManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClassManagement({ isOpen, onClose }: ClassManagementProps) {
  const { 
    classes, 
    availableCategories, 
    loading, 
    createClass, 
    updateClass, 
    deleteClass, 
    refreshClasses,
    isAdmin 
  } = useClass();
  
  // const { getAllSubjects, getAllYearGroups, getAllDomains, getTargetsForDomain } = useCurriculum();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    color: '#6B7280',
    selectedCategories: [] as string[],
    selectedCurriculumTargets: [] as string[],
    classSpecificCategories: [] as Array<{name: string, color: string, description?: string}>,
    customAssessmentStatements: [] as string[]
  });
  const [saving, setSaving] = useState(false);
  const [categoryTab, setCategoryTab] = useState<'existing' | 'class-specific'>('existing');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    color: '#6B7280',
    description: ''
  });
  const [newAssessmentStatement, setNewAssessmentStatement] = useState('');

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      setShowCreateForm(false);
      setEditingClass(null);
      setCategoryTab('existing');
      setShowCreateCategory(false);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        color: '#6B7280',
        selectedCategories: [],
        selectedCurriculumTargets: [],
        classSpecificCategories: [],
        customAssessmentStatements: []
      });
      setNewCategoryData({
        name: '',
        color: '#6B7280',
        description: ''
      });
    }
  }, [isOpen]);

  if (!isAdmin) {
    return null;
  }

  const handleCreateClass = async () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if at least one category is selected or created
    if (formData.selectedCategories.length === 0 && formData.classSpecificCategories.length === 0) {
      alert('Please select existing categories or create class-specific categories');
      return;
    }

    try {
      setSaving(true);
      await createClass({
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        color: formData.color,
        categoryIds: formData.selectedCategories,
        classSpecificCategories: formData.classSpecificCategories,
        customAssessmentStatements: formData.customAssessmentStatements
      });
      
      setShowCreateForm(false);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        color: '#6B7280',
        selectedCategories: [],
        selectedCurriculumTargets: [],
        classSpecificCategories: [],
        customAssessmentStatements: []
      });
    } catch (error) {
      console.error('Failed to create class:', error);
      alert('Failed to create class. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClass = (classToEdit: Class) => {
    setEditingClass(classToEdit);
    setFormData({
      name: classToEdit.name,
      displayName: classToEdit.displayName,
      description: classToEdit.description,
      color: classToEdit.color,
      selectedCategories: (classToEdit.categories || []).map(cat => cat.id),
      selectedCurriculumTargets: classToEdit.curriculumTargets || [],
      classSpecificCategories: classToEdit.classSpecificCategories || []
    });
    setShowCreateForm(true);
  };

  const handleUpdateClass = async () => {
    if (!editingClass || !formData.name.trim() || !formData.displayName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if at least one category is selected or created
    if (formData.selectedCategories.length === 0 && formData.classSpecificCategories.length === 0) {
      alert('Please select existing categories or create class-specific categories');
      return;
    }

    try {
      setSaving(true);
      await updateClass(editingClass.id, {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        color: formData.color,
        categoryIds: formData.selectedCategories,
        classSpecificCategories: formData.classSpecificCategories,
        customAssessmentStatements: formData.customAssessmentStatements
      });
      
      setEditingClass(null);
      setShowCreateForm(false);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        color: '#6B7280',
        selectedCategories: [],
        selectedCurriculumTargets: [],
        classSpecificCategories: [],
        customAssessmentStatements: []
      });
    } catch (error) {
      console.error('Failed to update class:', error);
      alert('Failed to update class. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (classToDelete: Class) => {
    if (!confirm(`Are you sure you want to delete "${classToDelete.displayName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteClass(classToDelete.id);
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class. Please try again.');
    }
  };

  const toggleCategory = (categoryId: string, event?: React.MouseEvent) => {
    setFormData(prev => {
      const isSelected = prev.selectedCategories.includes(categoryId);
      
      if (event?.shiftKey && prev.selectedCategories.length > 0) {
        // Shift+click: select range from last selected to current
        const lastSelectedIndex = availableCategories.findIndex(cat => 
          prev.selectedCategories.includes(cat.id) && cat.id !== categoryId
        );
        const currentIndex = availableCategories.findIndex(cat => cat.id === categoryId);
        
        if (lastSelectedIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastSelectedIndex, currentIndex);
          const end = Math.max(lastSelectedIndex, currentIndex);
          const rangeIds = availableCategories.slice(start, end + 1).map(cat => cat.id);
          
          if (isSelected) {
            // Remove all in range
            return {
              ...prev,
              selectedCategories: prev.selectedCategories.filter(id => !rangeIds.includes(id))
            };
          } else {
            // Add all in range
            const newSelected = [...prev.selectedCategories];
            rangeIds.forEach(id => {
              if (!newSelected.includes(id)) {
                newSelected.push(id);
              }
            });
            return {
              ...prev,
              selectedCategories: newSelected
            };
          }
        }
      }
      
      // Normal click: toggle single category
      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter(id => id !== categoryId)
          : [...prev.selectedCategories, categoryId]
      };
    });
  };

  const addClassSpecificCategory = () => {
    if (!newCategoryData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    setFormData(prev => ({
      ...prev,
      classSpecificCategories: [...prev.classSpecificCategories, { ...newCategoryData }]
    }));

    setNewCategoryData({
      name: '',
      color: '#6B7280',
      description: ''
    });
    setShowCreateCategory(false);
  };

  const removeClassSpecificCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      classSpecificCategories: prev.classSpecificCategories.filter((_, i) => i !== index)
    }));
  };

  const addCustomAssessmentStatement = () => {
    if (!newAssessmentStatement.trim()) {
      alert('Please enter an assessment statement');
      return;
    }

    setFormData(prev => ({
      ...prev,
      customAssessmentStatements: [...prev.customAssessmentStatements, newAssessmentStatement.trim()]
    }));

    setNewAssessmentStatement('');
    setShowCreateAssessment(false);
  };

  const removeCustomAssessment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customAssessmentStatements: prev.customAssessmentStatements.filter((_, i) => i !== index),
      selectedCurriculumTargets: prev.selectedCurriculumTargets.filter(id => id !== `custom-${index}`)
    }));
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingClass(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      color: '#6B7280',
      selectedCategories: [],
      selectedCurriculumTargets: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Class Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading classes...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manage Classes</h3>
                  <p className="text-sm text-gray-600">Create and configure classes with their available categories</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Class</span>
                </button>
              </div>

              {/* Create/Edit Form */}
              {showCreateForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingClass ? 'Edit Class' : 'Create New Class'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Class Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., LKG, UKG, Reception"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Name *
                        </label>
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="e.g., Lower Kindergarten, Upper Kindergarten"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Optional description for this class"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Class Color
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600">{formData.color}</span>
                        </div>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Class Categories
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCreateCategory(true)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Create New Category</span>
                        </button>
                      </div>
                      
                      {/* Category Selection Tabs */}
                      <div className="mb-4">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setCategoryTab('existing')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              categoryTab === 'existing'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Select Existing
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryTab('class-specific')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              categoryTab === 'class-specific'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Class-Specific
                          </button>
                        </div>
                      </div>

                      {/* Existing Categories Tab */}
                      {categoryTab === 'existing' && (
                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-1">
                          <div className="text-xs text-gray-500 mb-2 px-2">
                            💡 Select from existing categories that will be available for this class
                          </div>
                          {availableCategories.map(category => (
                            <label
                              key={category.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                formData.selectedCategories.includes(category.id)
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.selectedCategories.includes(category.id)}
                                onChange={(e) => toggleCategory(category.id, e)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div 
                                className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-200"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-900 block truncate">
                                  {category.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {category.subject.name}
                                </span>
                              </div>
                              {formData.selectedCategories.includes(category.id) && (
                                <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Class-Specific Categories Tab */}
                      {categoryTab === 'class-specific' && (
                        <div className="space-y-3">
                          <div className="text-xs text-gray-500 mb-2 px-2">
                            💡 Create categories specifically for this class that won't be available to other classes
                          </div>
                          
                          {/* Class-Specific Categories List */}
                          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                            {formData.classSpecificCategories.map((category, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div 
                                  className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-200"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-900 block truncate">
                                    {category.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Class-specific category
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeClassSpecificCategory(index)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            
                            {formData.classSpecificCategories.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No class-specific categories created yet</p>
                                <p className="text-xs">Click "Create New Category" to add one</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {categoryTab === 'existing' 
                          ? 'Select which existing categories will be available for this class'
                          : 'Create categories that are specific to this class and its unique needs'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Assessment Statements Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Assessment Statements
                    </label>
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="text-xs text-gray-500 mb-2 px-2">
                        💡 Select assessment statements that will be available for this class
                      </div>
                      
                      {/* EYFS Section */}
                      <div className="border-b border-gray-200 pb-2">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Early Years Foundation Stage (EYFS)</h4>
                        <div className="space-y-1">
                          {getAllDomains('eyfs', 'LKG').map(domain => (
                            <label key={domain} className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={formData.selectedCurriculumTargets.includes(`eyfs-${domain.toLowerCase().replace(/\s+/g, '-')}`)}
                                onChange={(e) => {
                                  const targetId = `eyfs-${domain.toLowerCase().replace(/\s+/g, '-')}`;
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedCurriculumTargets: e.target.checked
                                      ? [...prev.selectedCurriculumTargets, targetId]
                                      : prev.selectedCurriculumTargets.filter(id => id !== targetId)
                                  }));
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-900">{domain}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Music Curriculum Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Music Curriculum (Year 1-6)</h4>
                        <div className="space-y-1">
                          {getAllYearGroups('music').map(yearGroup => (
                            <label key={yearGroup} className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={formData.selectedCurriculumTargets.includes(`music-${yearGroup.toLowerCase().replace(/\s+/g, '-')}`)}
                                onChange={(e) => {
                                  const targetId = `music-${yearGroup.toLowerCase().replace(/\s+/g, '-')}`;
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedCurriculumTargets: e.target.checked
                                      ? [...prev.selectedCurriculumTargets, targetId]
                                      : prev.selectedCurriculumTargets.filter(id => id !== targetId)
                                  }));
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-900">{yearGroup} Music</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Custom Assessment Statements */}
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-800">Custom Assessment Statements</h4>
                          <button
                            type="button"
                            onClick={() => setShowCreateAssessment(true)}
                            className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Custom</span>
                          </button>
                        </div>
                        <div className="space-y-1">
                          {formData.customAssessmentStatements?.map((statement, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                              <input
                                type="checkbox"
                                checked={formData.selectedCurriculumTargets.includes(`custom-${index}`)}
                                onChange={(e) => {
                                  const targetId = `custom-${index}`;
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedCurriculumTargets: e.target.checked
                                      ? [...prev.selectedCurriculumTargets, targetId]
                                      : prev.selectedCurriculumTargets.filter(id => id !== targetId)
                                  }));
                                }}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700 flex-1">{statement}</span>
                              <button
                                type="button"
                                onClick={() => removeCustomAssessment(index)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {(!formData.customAssessmentStatements || formData.customAssessmentStatements.length === 0) && (
                            <p className="text-xs text-gray-500 italic">No custom assessment statements added yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Select which assessment statements will be available for this class
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingClass ? handleUpdateClass : handleCreateClass}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{editingClass ? 'Update Class' : 'Create Class'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Classes List */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">Existing Classes</h4>
                </div>
                
                {classes.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                    <p className="text-gray-600">Create your first class to get started</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {classes.map(cls => (
                      <div key={cls.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cls.color }}
                            ></div>
                            <div>
                              <h5 className="font-medium text-gray-900">{cls.displayName}</h5>
                              <p className="text-sm text-gray-600">{cls.name}</p>
                              {cls.description && (
                                <p className="text-sm text-gray-500 mt-1">{cls.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {(cls.categories || []).length} categories
                              </p>
                              <p className="text-xs text-gray-500">assigned</p>
                            </div>
                            
                            <button
                              onClick={() => handleEditClass(cls)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteClass(cls)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Categories Preview */}
                        {(cls.categories || []).length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-gray-700 mb-2">Assigned Categories:</p>
                            <div className="flex flex-wrap gap-2">
                              {(cls.categories || []).map(category => (
                                <span
                                  key={category.id}
                                  className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${category.color}20`,
                                    color: category.color,
                                    border: `1px solid ${category.color}40`
                                  }}
                                >
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                  <span>{category.name}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Class-Specific Category</h3>
              <button
                onClick={() => setShowCreateCategory(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newCategoryData.color}
                    onChange={(e) => setNewCategoryData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{newCategoryData.color}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateCategory(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addClassSpecificCategory}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Assessment Statement Modal */}
      {showCreateAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Custom Assessment Statement</h3>
              <button
                onClick={() => setShowCreateAssessment(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAssessmentStatement}
                  onChange={(e) => setNewAssessmentStatement(e.target.value)}
                  placeholder="Enter your custom assessment statement..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This statement will be available for assessment in this class
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateAssessment(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addCustomAssessmentStatement}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Add Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
