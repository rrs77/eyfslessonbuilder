import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Check, Plus, Target, BookOpen } from 'lucide-react';
import { useCurriculum } from '../contexts/CurriculumContext';
import type { CurriculumTarget } from '../contexts/CurriculumContext';

interface CurriculumTargetsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (targets: CurriculumTarget[]) => void;
  selectedTargets?: CurriculumTarget[];
  subject?: string;
  yearGroup?: string;
}

export function CurriculumTargetsSelector({
  isOpen,
  onClose,
  onSelect,
  selectedTargets = [],
  subject: initialSubject,
  yearGroup: initialYearGroup
}: CurriculumTargetsSelectorProps) {
  const { getAllSubjects, getAllYearGroups, getAllDomains, getTargetsForDomain, searchTargets } = useCurriculum();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || '');
  const [selectedYearGroup, setSelectedYearGroup] = useState(initialYearGroup || '');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [localSelectedTargets, setLocalSelectedTargets] = useState<CurriculumTarget[]>(selectedTargets);

  const subjects = getAllSubjects();
  const yearGroups = selectedSubject ? getAllYearGroups(selectedSubject) : [];
  const domains = selectedSubject && selectedYearGroup ? getAllDomains(selectedSubject, selectedYearGroup) : [];

  // Get available targets based on current filters
  const availableTargets = useMemo(() => {
    if (searchQuery) {
      return searchTargets(searchQuery, selectedSubject || undefined, selectedYearGroup || undefined);
    }

    if (selectedSubject && selectedYearGroup && selectedDomain) {
      const statements = getTargetsForDomain(selectedSubject, selectedYearGroup, selectedDomain);
      if (!statements) return [];

      return statements.map((statement, index) => ({
        id: `${selectedSubject}-${selectedYearGroup}-${selectedDomain}-${index}`,
        subject: selectedSubject,
        yearGroup: selectedYearGroup,
        domain: selectedDomain,
        statement: statement
      }));
    }

    return [];
  }, [searchQuery, selectedSubject, selectedYearGroup, selectedDomain, searchTargets, getTargetsForDomain]);

  const handleTargetToggle = (target: CurriculumTarget) => {
    const isSelected = localSelectedTargets.some(t => t.id === target.id);
    
    if (isSelected) {
      setLocalSelectedTargets(localSelectedTargets.filter(t => t.id !== target.id));
    } else {
      setLocalSelectedTargets([...localSelectedTargets, target]);
    }
  };

  const handleSelectAll = () => {
    const newTargets = availableTargets.filter(target => 
      !localSelectedTargets.some(t => t.id === target.id)
    );
    setLocalSelectedTargets([...localSelectedTargets, ...newTargets]);
  };

  const handleDeselectAll = () => {
    const availableTargetIds = availableTargets.map(t => t.id);
    setLocalSelectedTargets(localSelectedTargets.filter(t => !availableTargetIds.includes(t.id)));
  };

  const handleConfirm = () => {
    onSelect(localSelectedTargets);
    onClose();
  };

  const handleReset = () => {
    setLocalSelectedTargets(selectedTargets);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Select Curriculum Targets</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search targets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedYearGroup('');
                  setSelectedDomain('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Year Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Group</label>
              <select
                value={selectedYearGroup}
                onChange={(e) => {
                  setSelectedYearGroup(e.target.value);
                  setSelectedDomain('');
                }}
                disabled={!selectedSubject}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">All Year Groups</option>
                {yearGroups.map(yearGroup => (
                  <option key={yearGroup} value={yearGroup}>{yearGroup}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Domain Filter (only show when not searching) */}
          {!searchQuery && selectedSubject && selectedYearGroup && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Domains</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Selected Targets Summary */}
          {localSelectedTargets.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-900">Selected Targets ({localSelectedTargets.length})</h3>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localSelectedTargets.map(target => (
                  <span
                    key={target.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1"
                  >
                    <span>{target.subject} - {target.yearGroup} - {target.domain}</span>
                    <button
                      onClick={() => handleTargetToggle(target)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Targets */}
          <div className="space-y-4">
            {availableTargets.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    Available Targets ({availableTargets.length})
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {availableTargets.map(target => {
                    const isSelected = localSelectedTargets.some(t => t.id === target.id);
                    return (
                      <div
                        key={target.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleTargetToggle(target)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {isSelected ? (
                              <Check className="h-5 w-5 text-blue-600" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {target.subject}
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                {target.yearGroup}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                {target.domain}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{target.statement}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No targets found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search terms or filters'
                    : 'Select a subject and year group to view available targets'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-500">
            {localSelectedTargets.length} target{localSelectedTargets.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}









