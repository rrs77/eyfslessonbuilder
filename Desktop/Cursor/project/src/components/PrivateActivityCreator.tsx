import React, { useState, useRef } from 'react';
import { Plus, Save, X, Upload, Music, Drama, Image, Link, Clock, Users, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PrivateActivity {
  id: string;
  name: string;
  description: string;
  activityText: string;
  time: number;
  category: string;
  level: string;
  yearGroups: string[];
  videoLink: string;
  musicLink: string;
  backingLink: string;
  resourceLink: string;
  imageLink: string;
  vocalsLink: string;
  unitName: string;
  lessonNumber: string;
  teachingUnit: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
}

interface PrivateActivityCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: PrivateActivity) => void;
  availableCategories: string[];
  availableYearGroups: string[];
}

export function PrivateActivityCreator({ 
  isOpen, 
  onClose, 
  onSave, 
  availableCategories, 
  availableYearGroups 
}: PrivateActivityCreatorProps) {
  const { user } = useAuth();
  const [activity, setActivity] = useState<Omit<PrivateActivity, 'id' | 'createdBy' | 'createdAt' | 'isPrivate'>>({
    name: '',
    description: '',
    activityText: '',
    time: 0,
    category: '',
    level: 'All',
    yearGroups: [],
    videoLink: '',
    musicLink: '',
    backingLink: '',
    resourceLink: '',
    imageLink: '',
    vocalsLink: '',
    unitName: '',
    lessonNumber: '',
    teachingUnit: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const levelOptions = ['All', 'LKG', 'UKG', 'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
  
  // Check if user is admin - only admins can create activities
  const isAdmin = user?.email === 'rob.reichstorer@gmail.com' || 
                  user?.role === 'administrator';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivity(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setActivity(prev => ({ ...prev, time: isNaN(value) ? 0 : value }));
  };

  const handleYearGroupChange = (yearGroup: string) => {
    setActivity(prev => ({
      ...prev,
      yearGroups: prev.yearGroups.includes(yearGroup)
        ? prev.yearGroups.filter(yg => yg !== yearGroup)
        : [...prev.yearGroups, yearGroup]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for demo purposes
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setActivity(prev => ({
        ...prev,
        imageLink: imageUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!activity.name.trim()) {
      newErrors.name = 'Activity name is required';
    }
    if (!activity.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!activity.activityText.trim()) {
      newErrors.activityText = 'Activity text is required';
    }
    if (!activity.category) {
      newErrors.category = 'Category is required';
    }
    if (activity.time <= 0) {
      newErrors.time = 'Time must be greater than 0';
    }
    if (activity.yearGroups.length === 0) {
      newErrors.yearGroups = 'At least one year group must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    // Create the private activity
    const privateActivity: PrivateActivity = {
      ...activity,
      id: `private_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isPrivate: true,
      createdBy: user?.email || 'unknown',
      createdAt: new Date().toISOString()
    };

    onSave(privateActivity);
    setSaving(false);
    onClose();
  };

  const resetForm = () => {
    setActivity({
      name: '',
      description: '',
      activityText: '',
      time: 0,
      category: '',
      level: 'All',
      yearGroups: [],
      videoLink: '',
      musicLink: '',
      backingLink: '',
      resourceLink: '',
      imageLink: '',
      vocalsLink: '',
      unitName: '',
      lessonNumber: '',
      teachingUnit: ''
    });
    setErrors({});
  };

  if (!isOpen || !isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Private Activity</h2>
            <p className="text-sm text-gray-600">Add your own activity that only you can see</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Activity Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={activity.name}
                  onChange={handleChange}
                  placeholder="Enter activity name"
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={activity.description}
                  onChange={handleChange}
                  placeholder="Brief description of the activity"
                  rows={3}
                  className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Activity Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Instructions <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="activityText"
                  value={activity.activityText}
                  onChange={handleChange}
                  placeholder="Detailed instructions for the activity"
                  rows={4}
                  className={`w-full px-4 py-3 border ${errors.activityText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.activityText && (
                  <p className="mt-1 text-sm text-red-500">{errors.activityText}</p>
                )}
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={activity.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select category</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={activity.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {levelOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time and Year Groups */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="time"
                    value={activity.time}
                    onChange={handleTimeChange}
                    min="1"
                    className={`w-full px-4 py-3 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Groups <span className="text-red-500">*</span>
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {availableYearGroups.map(yearGroup => (
                      <label key={yearGroup} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={activity.yearGroups.includes(yearGroup)}
                          onChange={() => handleYearGroupChange(yearGroup)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{yearGroup}</span>
                      </label>
                    ))}
                  </div>
                  {errors.yearGroups && (
                    <p className="mt-1 text-sm text-red-500">{errors.yearGroups}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Resources and Links */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload image</span>
                  </button>
                  {activity.imageLink && (
                    <div className="mt-2">
                      <img src={activity.imageLink} alt="Activity" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Resources & Links</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Link
                  </label>
                  <input
                    type="url"
                    name="videoLink"
                    value={activity.videoLink}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Music Link
                  </label>
                  <input
                    type="url"
                    name="musicLink"
                    value={activity.musicLink}
                    onChange={handleChange}
                    placeholder="https://spotify.com/track/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Link
                  </label>
                  <input
                    type="url"
                    name="resourceLink"
                    value={activity.resourceLink}
                    onChange={handleChange}
                    placeholder="https://example.com/resource"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Name
                    </label>
                    <input
                      type="text"
                      name="unitName"
                      value={activity.unitName}
                      onChange={handleChange}
                      placeholder="e.g., Spring Term"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Number
                    </label>
                    <input
                      type="text"
                      name="lessonNumber"
                      value={activity.lessonNumber}
                      onChange={handleChange}
                      placeholder="e.g., Lesson 1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Unit
                  </label>
                  <input
                    type="text"
                    name="teachingUnit"
                    value={activity.teachingUnit}
                    onChange={handleChange}
                    placeholder="e.g., Music & Movement"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Reset Form
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Activity</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
