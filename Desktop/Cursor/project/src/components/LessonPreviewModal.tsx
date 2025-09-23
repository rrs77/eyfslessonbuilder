import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  ExternalLink,
  Clock,
  BookOpen,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import type { Activity } from '../contexts/DataContext';

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonNumber: string;
  lessonData?: any;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
}

export function LessonPreviewModal({ 
  isOpen, 
  onClose, 
  lessonNumber, 
  lessonData,
  theme = {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
  }
}: LessonPreviewModalProps) {
  const { allLessonsData } = useData();
  const { getCategoryColor } = useSettings();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showActivityDetails, setShowActivityDetails] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const lesson = lessonData || allLessonsData[lessonNumber];
  
  if (!lesson) return null;

  // Get all activities from the lesson
  const allActivities: Activity[] = Object.values(lesson.grouped || {}).flat();

  const currentActivity = allActivities[currentActivityIndex];

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvance && isPlaying && allActivities.length > 1) {
      const timer = setTimeout(() => {
        setCurrentActivityIndex(prev => (prev + 1) % allActivities.length);
      }, 10000); // 10 seconds per activity
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, isPlaying, currentActivityIndex, allActivities.length]);

  const nextActivity = () => {
    setCurrentActivityIndex(prev => (prev + 1) % allActivities.length);
  };

  const prevActivity = () => {
    setCurrentActivityIndex(prev => (prev - 1 + allActivities.length) % allActivities.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setAutoAdvance(true);
    } else {
      setAutoAdvance(false);
    }
  };

  const resetLesson = () => {
    setCurrentActivityIndex(0);
    setIsPlaying(false);
    setAutoAdvance(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleResourceClick = (url: string, title: string, type: string) => {
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden ${
        isFullscreen ? 'h-screen max-h-screen' : ''
      }`}>
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" dir="ltr">
                  {lesson.title || `Lesson ${lessonNumber}`}
                </h1>
                <div className="flex items-center space-x-4 text-lg">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-5 w-5" />
                    <span>Activity {currentActivityIndex + 1} of {allActivities.length}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{currentActivity?.time || 0} minutes</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowActivityDetails(!showActivityDetails)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  title={showActivityDetails ? 'Hide Details' : 'Show Details'}
                >
                  {showActivityDetails ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevActivity}
                disabled={allActivities.length <= 1}
                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors duration-200"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </button>
              
              <button
                onClick={nextActivity}
                disabled={allActivities.length <= 1}
                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              <button
                onClick={resetLesson}
                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors duration-200"
                title="Reset to Beginning"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentActivity && (
            <div className="p-8">
              {/* Activity Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4" dir="ltr">
                  {currentActivity.activity}
                </h2>
                <div className="flex items-center justify-center space-x-4 text-xl">
                  <span 
                    className="px-4 py-2 text-white font-medium rounded-full"
                    style={{ backgroundColor: getCategoryColor(currentActivity.category) || theme.primary }}
                  >
                    {currentActivity.category}
                  </span>
                  {currentActivity.level && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-full">
                      {currentActivity.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Activity Description */}
              <div className="max-w-4xl mx-auto mb-8">
                <div 
                  className="text-2xl leading-relaxed text-gray-800 prose prose-xl max-w-none text-center"
                  dangerouslySetInnerHTML={{ 
                    __html: currentActivity.description?.replace(/\n/g, '<br>') || '' 
                  }}
                  dir="ltr"
                />
              </div>

              {/* Activity Details (if enabled) */}
              {showActivityDetails && (
                <div className="max-w-4xl mx-auto">
                  {/* Unit Name */}
                  {currentActivity.unitName && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Unit</h3>
                      <p className="text-blue-800 text-lg" dir="ltr">{currentActivity.unitName}</p>
                    </div>
                  )}

                  {/* EYFS Standards */}
                  {currentActivity.eyfsStandards && currentActivity.eyfsStandards.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
                        <Tag className="h-5 w-5" />
                        <span>EYFS Standards</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentActivity.eyfsStandards.map((standard: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full" dir="ltr">
                            {standard.split(':')[1] || standard}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {(() => {
                    const resources = [
                      { label: 'Video', url: currentActivity.videoLink, icon: Volume2, color: 'text-red-600 bg-red-50 border-red-200' },
                      { label: 'Music', url: currentActivity.musicLink, icon: Volume2, color: 'text-green-600 bg-green-50 border-green-200' },
                      { label: 'Backing', url: currentActivity.backingLink, icon: Volume2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                      { label: 'Resource', url: currentActivity.resourceLink, icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                      { label: 'Link', url: currentActivity.link, icon: ExternalLink, color: 'text-gray-600 bg-gray-50 border-gray-200' },
                      { label: 'Vocals', url: currentActivity.vocalsLink, icon: Volume2, color: 'text-orange-600 bg-orange-50 border-orange-200' },
                      { label: 'Image', url: currentActivity.imageLink, icon: BookOpen, color: 'text-pink-600 bg-pink-50 border-pink-200' },
                    ].filter(resource => resource.url && resource.url.trim());

                    if (resources.length === 0) return null;

                    return (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {resources.map((resource, index) => {
                            const IconComponent = resource.icon;
                            return (
                              <button
                                key={index}
                                onClick={() => handleResourceClick(resource.url, `${currentActivity.activity} - ${resource.label}`, resource.label.toLowerCase())}
                                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-sm ${resource.color}`}
                              >
                                <IconComponent className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium text-sm truncate" dir="ltr">{resource.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Progress */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Activity {currentActivityIndex + 1} of {allActivities.length}
              </span>
              {isPlaying && (
                <span className="text-sm text-blue-600 font-medium">
                  Auto-advancing in 10s
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {allActivities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentActivityIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentActivityIndex 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPreviewModal;









