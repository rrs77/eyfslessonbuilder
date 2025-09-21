import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Check, 
  X,
  Music,
  Drama,
  Edit3,
  Trash2
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
  position: number;
  isActive: boolean;
}

interface HierarchicalCategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoriesChange: (categories: Category[]) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  isAdmin: boolean;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  categories: Category[];
  isExpanded: boolean;
}

export function HierarchicalCategorySelector({
  categories,
  selectedCategories,
  onCategoriesChange,
  onSelectionChange,
  isAdmin
}: HierarchicalCategorySelectorProps) {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryGroup, setNewCategoryGroup] = useState<string>('');

  // Organize categories into hierarchical groups
  useEffect(() => {
    const eyfsCategories = categories.filter(cat => 
      !['Drama Games', 'Drama Activities', 'Vocal Warm-Ups'].includes(cat.name)
    );
    
    const dramaCategories = categories.filter(cat => 
      ['Drama Games', 'Drama Activities', 'Vocal Warm-Ups'].includes(cat.name)
    );

    const newGroups: CategoryGroup[] = [
      {
        id: 'eyfs-music',
        name: 'EYFS Music',
        icon: <Music className="h-5 w-5" />,
        color: '#3B82F6',
        categories: eyfsCategories,
        isExpanded: false
      },
      {
        id: 'general-drama',
        name: 'General Drama',
        icon: <Drama className="h-5 w-5" />,
        color: '#8B5CF6',
        categories: dramaCategories,
        isExpanded: false
      }
    ];

    setGroups(newGroups);
  }, [categories]);

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleCategorySelection = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onSelectionChange(newSelection);
  };

  const addCustomCategory = (groupId: string) => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      color: groups.find(g => g.id === groupId)?.color || '#6B7280',
      position: categories.length,
      isActive: true
    };

    const updatedCategories = [...categories, newCategory];
    onCategoriesChange(updatedCategories);
    setNewCategoryName('');
    setNewCategoryGroup('');
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    onCategoriesChange(updatedCategories);
  };

  const deleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      onCategoriesChange(updatedCategories);
      
      // Remove from selection if it was selected
      const updatedSelection = selectedCategories.filter(id => id !== categoryId);
      onSelectionChange(updatedSelection);
    }
  };

  const startEditing = (categoryId: string) => {
    setEditingCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setNewCategoryName(category.name);
    }
  };

  const saveEdit = () => {
    if (editingCategory && newCategoryName.trim()) {
      updateCategory(editingCategory, { name: newCategoryName.trim() });
      setEditingCategory(null);
      setNewCategoryName('');
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Category management is only available to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Hierarchical Category Selection</h3>
        <div className="text-sm text-gray-500">
          {selectedCategories.length} of {categories.length} categories selected
        </div>
      </div>

      <div className="space-y-3">
        {groups.map(group => (
          <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroupExpansion(group.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {expandedGroups.has(group.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                ></div>
                {group.icon}
                <span className="font-medium text-gray-900">{group.name}</span>
                <span className="text-sm text-gray-500">
                  ({group.categories.length} categories)
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {group.categories.filter(cat => selectedCategories.includes(cat.id)).length} selected
              </div>
            </button>

            {/* Group Content */}
            {expandedGroups.has(group.id) && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="space-y-2">
                  {group.categories.map(category => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleCategorySelection(category.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedCategories.includes(category.id)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {selectedCategories.includes(category.id) && (
                          <Check className="h-3 w-3" />
                        )}
                      </button>

                      {/* Category Color */}
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>

                      {/* Category Name */}
                      <div className="flex-1 min-w-0">
                        {editingCategory === category.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <button
                              onClick={saveEdit}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className={`font-medium ${
                            selectedCategories.includes(category.id) 
                              ? 'text-blue-900' 
                              : 'text-gray-900'
                          }`}>
                            {category.name}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {editingCategory !== category.id && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditing(category.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit category name"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Custom Category */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Add custom ${group.name.toLowerCase()} category...`}
                        value={newCategoryGroup === group.id ? newCategoryName : ''}
                        onChange={(e) => {
                          setNewCategoryName(e.target.value);
                          setNewCategoryGroup(group.id);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addCustomCategory(group.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => addCustomCategory(group.id)}
                        disabled={!newCategoryName.trim() || newCategoryGroup !== group.id}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg flex items-center space-x-1 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedCategories.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selected Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(categoryId => {
              const category = categories.find(cat => cat.id === categoryId);
              return category ? (
                <div
                  key={categoryId}
                  className="flex items-center space-x-2 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-blue-900">{category.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

