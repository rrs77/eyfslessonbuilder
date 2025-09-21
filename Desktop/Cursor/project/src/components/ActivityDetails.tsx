import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  Video, 
  Music, 
  FileText, 
  Link as LinkIcon, 
  Image, 
  Volume2, 
  Save, 
  X, 
  GripVertical,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Tag,
  Edit3,
  Plus
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { RichTextEditor } from './RichTextEditor';
import { EyfsStandardsSelector } from './EyfsStandardsSelector';
import type { Activity } from '../contexts/DataContext';

interface ActivityDetailsProps {
  activity: Activity;
  onUpdate?: (updatedActivity: Activity) => void;
  onDelete?: (activityId: string) => void;
  onDuplicate?: (activity: Activity) => void;
  onAddToLesson?: () => void;
  onClose: () => void;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
  onResourceClick?: (url: string, title: string, type: string) => void;
}

// Character limit for truncated description
const DESCRIPTION_CHAR_LIMIT = 150;

export function ActivityDetails({ 
  activity, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAddToLesson,
  onClose,
  theme = {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
  },
  onResourceClick
}: ActivityDetailsProps) {
  const { getCategoryColor } = useSettings();
  const [editedActivity, setEditedActivity] = useState<Activity>(activity);
  const [showResources, setShowResources] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedActivity(activity);
  }, [activity]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedActivity);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedActivity(activity);
    setIsEditing(false);
  };

  // Format description with line breaks
  const formatDescription = (text: string) => {
    if (!text) return '';
    
    // If already HTML, return as is
    if (text.includes('<')) {
      return text;
    }
    
    // Replace newlines with <br> tags
    return text.replace(/\n/g, '<br>');
  };

  // Check if description is long enough to truncate
  const isDescriptionLong = activity.description && 
    (activity.description.length > DESCRIPTION_CHAR_LIMIT || 
     activity.description.includes('\n') || 
     activity.description.includes('<br>') ||
     activity.description.includes('<li>'));

  // Get truncated description
  const getTruncatedDescription = () => {
    if (!activity.description) return '';
    
    // If it's HTML, try to extract text
    if (activity.description.includes('<')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = activity.description;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      return textContent.substring(0, DESCRIPTION_CHAR_LIMIT) + (textContent.length > DESCRIPTION_CHAR_LIMIT ? '...' : '');
    }
    
    // Otherwise just truncate the text
    return activity.description.substring(0, DESCRIPTION_CHAR_LIMIT) + 
           (activity.description.length > DESCRIPTION_CHAR_LIMIT ? '...' : '');
  };

  const resources = [
    { label: 'Video', url: activity.videoLink, icon: Video, color: 'text-red-600 bg-red-50 border-red-200', type: 'video' },
    { label: 'Music', url: activity.musicLink, icon: Music, color: 'text-green-600 bg-green-50 border-green-200', type: 'music' },
    { label: 'Backing', url: activity.backingLink, icon: Volume2, color: 'text-blue-600 bg-blue-50 border-blue-200', type: 'backing' },
    { label: 'Resource', url: activity.resourceLink, icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-200', type: 'resource' },
    { label: 'Link', url: activity.link, icon: LinkIcon, color: 'text-gray-600 bg-gray-50 border-gray-200', type: 'link' },
    { label: 'Vocals', url: activity.vocalsLink, icon: Volume2, color: 'text-orange-600 bg-orange-50 border-orange-200', type: 'vocals' },
    { label: 'Image', url: activity.imageLink, icon: Image, color: 'text-pink-600 bg-pink-50 border-pink-200', type: 'image' },
  ].filter(resource => resource.url && resource.url.trim());

  // Get category color from context
  const cardColor = getCategoryColor(activity.category) || '#6B7280';

  const yearGroups = ['LKG', 'UKG', 'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}CC 100%)` 
          }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedActivity.activity}
                    onChange={(e) => setEditedActivity(prev => ({ ...prev, activity: e.target.value }))}
                    className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 rounded-lg px-3 py-2 text-xl font-bold"
                    placeholder="Activity name"
                    dir="ltr"
                  />
                ) : (
                  <h2 className="text-2xl font-bold leading-tight" dir="ltr">{activity.activity}</h2>
                )}
                
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm opacity-90" dir="ltr">{activity.category}</span>
                  {activity.level && (
                    <span className="px-2 py-1 bg-white bg-opacity-20 text-xs font-medium rounded-full">
                      {activity.level}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-3">
                {activity.time > 0 && (
                  <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{activity.time}m</span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {/* Duration */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Duration: {activity.time} minutes</span>
            </div>
          </div>

          {/* Activity Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity</h3>
            {isEditing ? (
              <RichTextEditor
                value={editedActivity.description}
                onChange={(value) => setEditedActivity(prev => ({ ...prev, description: value }))}
                placeholder="Enter activity description..."
                minHeight="120px"
              />
            ) : (
              <div 
                className="text-gray-700 leading-relaxed prose prose-lg max-w-none text-base"
                dangerouslySetInnerHTML={{ __html: formatDescription(activity.description) }}
                dir="ltr"
              />
            )}
          </div>

          {/* Year Groups */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span>Year Groups</span>
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Select all applicable year groups for this activity:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {yearGroups.map(yearGroup => {
                    const isSelected = editedActivity.yearGroups?.includes(yearGroup) || false;
                    return (
                      <label
                        key={yearGroup}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentYearGroups = editedActivity.yearGroups || [];
                            if (e.target.checked) {
                              setEditedActivity(prev => ({
                                ...prev,
                                yearGroups: [...currentYearGroups, yearGroup]
                              }));
                            } else {
                              setEditedActivity(prev => ({
                                ...prev,
                                yearGroups: currentYearGroups.filter(yg => yg !== yearGroup)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="font-medium text-gray-900">{yearGroup}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(activity.yearGroups || []).length > 0 ? (
                  (activity.yearGroups || []).map(yearGroup => (
                    <span 
                      key={yearGroup}
                      className="px-4 py-2 text-white text-sm font-medium rounded-full shadow-sm"
                      style={{ backgroundColor: cardColor }}
                    >
                      {yearGroup}
                    </span>
                  ))
                ) : (
                  <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    No year groups selected
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Unit Name */}
          {(activity.unitName || isEditing) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Unit</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedActivity.unitName}
                  onChange={(e) => setEditedActivity(prev => ({ ...prev, unitName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Unit name"
                  dir="ltr"
                />
              ) : (
                <p className="text-gray-700 font-medium" dir="ltr">{activity.unitName}</p>
              )}
            </div>
          )}

          {/* EYFS Standards */}
          {activity.eyfsStandards && activity.eyfsStandards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>EYFS Standards</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activity.eyfsStandards.map((standard, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full" dir="ltr">
                    {standard.split(':')[1] || standard}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              {!isEditing && resources.length > 0 && (
                <button
                  onClick={() => setShowResources(!showResources)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{showResources ? 'Hide' : 'Show'}</span>
                  {showResources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                {[
                  { key: 'videoLink', label: 'Video', icon: Video },
                  { key: 'musicLink', label: 'Music', icon: Music },
                  { key: 'backingLink', label: 'Backing Track', icon: Volume2 },
                  { key: 'resourceLink', label: 'Resource', icon: FileText },
                  { key: 'link', label: 'General Link', icon: LinkIcon },
                  { key: 'vocalsLink', label: 'Vocals', icon: Volume2 },
                  { key: 'imageLink', label: 'Image', icon: Image },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <input
                      type="url"
                      value={editedActivity[key as keyof Activity] as string}
                      onChange={(e) => setEditedActivity(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder={`${label} URL`}
                      dir="ltr"
                    />
                  </div>
                ))}
              </div>
            ) : (
              showResources && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.map((resource, index) => {
                    const IconComponent = resource.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (onResourceClick) {
                            onResourceClick(resource.url, `${activity.activity} - ${resource.label}`, resource.type);
                          }
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-sm ${resource.color}`}
                      >
                        <IconComponent className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium truncate" dir="ltr">{resource.label}</span>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-60" />
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(activity)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(activity.id || activity._id || '')}
                className="px-3 py-2 text-red-600 hover:text-red-800 font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                {onAddToLesson && (
                  <button
                    onClick={onAddToLesson}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Lesson</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;