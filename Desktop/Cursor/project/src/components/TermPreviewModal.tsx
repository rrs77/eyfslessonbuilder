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
  EyeOff,
  Calendar,
  List
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useSettings } from '../contexts/SettingsContext';
import type { Activity } from '../contexts/DataContext';

interface TermPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  halfTermId: string;
  halfTermName: string;
  halfTermColor: string;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
}

export function TermPreviewModal({ 
  isOpen, 
  onClose, 
  halfTermId,
  halfTermName,
  halfTermColor,
  theme = {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
  }
}: TermPreviewModalProps) {
  const { allLessonsData, getLessonsForHalfTerm } = useData();
  const { getCategoryColor } = useSettings();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showActivityDetails, setShowActivityDetails] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [viewMode, setViewMode] = useState<'lesson' | 'overview'>('lesson');

  const lessonNumbers = getLessonsForHalfTerm(halfTermId);
  const lessons = lessonNumbers.map(num => allLessonsData[num]).filter(Boolean);
  
  if (!lessons.length) return null;

  const currentLesson = lessons[currentLessonIndex];
  const allActivities: Activity[] = Object.values(currentLesson.grouped || {}).flat();
  const currentActivity = allActivities[currentActivityIndex];

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvance && isPlaying) {
      const timer = setTimeout(() => {
        if (currentActivityIndex < allActivities.length - 1) {
          setCurrentActivityIndex(prev => prev + 1);
        } else if (currentLessonIndex < lessons.length - 1) {
          setCurrentLessonIndex(prev => prev + 1);
          setCurrentActivityIndex(0);
        } else {
          setIsPlaying(false);
          setAutoAdvance(false);
        }
      }, 10000); // 10 seconds per activity
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, isPlaying, currentActivityIndex, currentLessonIndex, allActivities.length, lessons.length]);

  const nextActivity = () => {
    if (currentActivityIndex < allActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setCurrentActivityIndex(0);
    }
  };

  const prevActivity = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      const prevLesson = lessons[currentLessonIndex - 1];
      const prevActivities = Object.values(prevLesson.grouped || {}).flat();
      setCurrentActivityIndex(prevActivities.length - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setAutoAdvance(true);
    } else {
      setAutoAdvance(false);
    }
  };

  const resetTerm = () => {
    setCurrentLessonIndex(0);
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
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden ${
        isFullscreen ? 'h-screen max-h-screen' : ''
      }`}>
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${halfTermColor} 0%, ${halfTermColor}CC 100%)` 
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" dir="ltr">
                  {halfTermName} - {viewMode === 'lesson' ? 'Lesson View' : 'Overview'}
                </h1>
                <div className="flex items-center space-x-4 text-lg">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>Lesson {currentLessonIndex + 1} of {lessons.length}</span>
                  </span>
                  {viewMode === 'lesson' && (
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-5 w-5" />
                      <span>Activity {currentActivityIndex + 1} of {allActivities.length}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{currentActivity?.time || 0} minutes</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode(viewMode === 'lesson' ? 'overview' : 'lesson')}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  title={viewMode === 'lesson' ? 'Switch to Overview' : 'Switch to Lesson View'}
                >
                  {viewMode === 'lesson' ? <List className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                </button>
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
                disabled={currentLessonIndex === 0 && currentActivityIndex === 0}
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
                disabled={currentLessonIndex === lessons.length - 1 && currentActivityIndex === allActivities.length - 1}
                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              <button
                onClick={resetTerm}
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
          {viewMode === 'lesson' && currentActivity ? (
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
          ) : (
            /* Overview Mode */
            <div className="p-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Term Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson, lessonIndex) => {
                    const lessonActivities = Object.values(lesson.grouped || {}).flat();
                    return (
                      <div 
                        key={lessonIndex}
                        className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                          lessonIndex === currentLessonIndex ? 'ring-4 ring-blue-300 border-blue-500' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setCurrentLessonIndex(lessonIndex);
                          setCurrentActivityIndex(0);
                          setViewMode('lesson');
                        }}
                      >
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2" dir="ltr">
                            {lesson.title || `Lesson ${lessonIndex + 1}`}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {lessonActivities.length} activities
                          </p>
                          
                          <div className="space-y-2">
                            {lessonActivities.slice(0, 3).map((activity, activityIndex) => (
                              <div key={activityIndex} className="text-left">
                                <div className="flex items-center space-x-2">
                                  <span 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getCategoryColor(activity.category) || theme.primary }}
                                  ></span>
                                  <span className="text-sm font-medium text-gray-700 truncate" dir="ltr">
                                    {activity.activity}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {lessonActivities.length > 3 && (
                              <p className="text-xs text-gray-500">
                                +{lessonActivities.length - 3} more activities
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Progress */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Lesson {currentLessonIndex + 1} of {lessons.length}
                {viewMode === 'lesson' && ` • Activity ${currentActivityIndex + 1} of ${allActivities.length}`}
              </span>
              {isPlaying && (
                <span className="text-sm text-blue-600 font-medium">
                  Auto-advancing in 10s
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {lessons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentLessonIndex(index);
                    setCurrentActivityIndex(0);
                    setViewMode('lesson');
                  }}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentLessonIndex 
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

export default TermPreviewModal;




