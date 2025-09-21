import React, { useState } from 'react';
import { FileText, Edit3, Save, X, StickyNote } from 'lucide-react';

interface PostItNoteProps {
  notes: string;
  onNotesUpdate: (notes: string) => void;
  isEditing?: boolean;
  className?: string;
  placeholder?: string;
}

export function PostItNote({ 
  notes, 
  onNotesUpdate, 
  isEditing = false, 
  className = '',
  placeholder = "Add your lesson notes here..."
}: PostItNoteProps) {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes);

  const handleEdit = () => {
    setTempNotes(notes);
    setIsEditingMode(true);
  };

  const handleSave = () => {
    onNotesUpdate(tempNotes);
    setIsEditingMode(false);
  };

  const handleCancel = () => {
    setTempNotes(notes);
    setIsEditingMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Post-it Note Container */}
      <div className="relative bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out border-2 border-yellow-400 group animate-in slide-in-from-bottom-4 duration-500">
        {/* Post-it Note Header */}
        <div className="flex items-center justify-between p-3 border-b border-yellow-400 border-opacity-50">
          <div className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5 text-yellow-700" />
            <h3 className="font-bold text-yellow-800 text-sm">Lesson Notes</h3>
          </div>
          
          {!isEditingMode && isEditing && (
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-yellow-300 rounded transition-all duration-200 hover:scale-110 hover:rotate-12 group-hover:opacity-100 opacity-80"
              title="Edit notes"
            >
              <Edit3 className="h-4 w-4 text-yellow-700" />
            </button>
          )}
        </div>

        {/* Post-it Note Content */}
        <div className="p-4 min-h-[120px]">
          {isEditingMode ? (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-32 bg-transparent border-none outline-none resize-none text-yellow-900 placeholder-yellow-600 text-sm leading-relaxed focus:ring-2 focus:ring-yellow-500 rounded transition-all duration-200"
                placeholder={placeholder}
                autoFocus
              />
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 animate-in fade-in duration-500 delay-150">
                <button
                  onClick={handleCancel}
                  className="p-1.5 hover:bg-yellow-300 rounded transition-all duration-200 hover:scale-110 hover:rotate-12 hover:bg-red-200"
                  title="Cancel (Esc)"
                >
                  <X className="h-4 w-4 text-yellow-700" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-1.5 hover:bg-yellow-300 rounded transition-all duration-200 hover:scale-110 hover:rotate-12 hover:bg-green-200"
                  title="Save (Ctrl+Enter)"
                >
                  <Save className="h-4 w-4 text-yellow-700" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-yellow-900 text-sm leading-relaxed animate-in fade-in duration-300">
              {notes ? (
                <div className="whitespace-pre-wrap hover:bg-yellow-50 rounded p-2 transition-colors duration-200">{notes}</div>
              ) : (
                <div className="text-yellow-600 italic hover:text-yellow-700 transition-colors duration-200">
                  {isEditing ? "Click the edit button to add notes..." : "No notes added yet"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post-it Note Corner Fold */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-yellow-500 group-hover:border-t-yellow-600 transition-colors duration-300"></div>
      </div>

      {/* Reflection Mode Indicator */}
      {notes && !isEditingMode && (
        <div className="mt-2 text-xs text-gray-500 text-center animate-in fade-in duration-500 delay-300">
          <span className="inline-block animate-pulse">💡</span> Use for lesson reflection, challenges, and improvements
        </div>
      )}
    </div>
  );
}


