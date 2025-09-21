import React, { useState, useEffect } from 'react';
import { 
  School, 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Save,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useCurriculum } from '../contexts/CurriculumContext';
import { useClass } from '../contexts/ClassContext';

interface CurriculumTargetsManagementProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
}

export function CurriculumTargetsManagement({ isOpen, onClose, embedded = false }: CurriculumTargetsManagementProps) {
  const { getAllSubjects, getAllYearGroups, getAllDomains, getTargetsForDomain } = useCurriculum();
  const { classes } = useClass();
  
  // Check if user is admin
  const isAdmin = true; // TODO: Get from auth context
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [newTargetText, setNewTargetText] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'manage' | 'assign'>('manage');

  const subjects = getAllSubjects();


  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleTarget = (targetId: string) => {
    setSelectedTargets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(targetId)) {
        newSet.delete(targetId);
      } else {
        newSet.add(targetId);
      }
      return newSet;
    });
  };

  const handleEditTarget = (targetId: string, currentText: string) => {
    setEditingTarget(targetId);
    setNewTargetText(currentText);
  };

  const handleSaveTarget = () => {
    // TODO: Implement save functionality
    setEditingTarget(null);
    setNewTargetText('');
  };

  const handleCancelEdit = () => {
    setEditingTarget(null);
    setNewTargetText('');
  };

  const assignTargetsToClass = () => {
    if (!selectedClass) return;
    // TODO: Implement assigning selected targets to class
    console.log('Assigning targets to class:', selectedClass, Array.from(selectedTargets));
  };

  const getClassTargets = (classId: string) => {
    // TODO: Get targets assigned to specific class
    return new Set<string>();
  };

  const deleteTarget = (targetId: string) => {
    // TODO: Implement target deletion in service layer
    console.log('Deleting target:', targetId);
  };

  if (!isOpen) return null;

  const content = (
    <>
      {!embedded && (
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <School className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Curriculum Targets Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Targets
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assign'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assign to Classes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'manage' ? (
            <div className="space-y-6">
              {/* EYFS Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <button
                onClick={() => toggleSection('eyfs')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h3 className="text-xl font-bold text-gray-900">Early Years Foundation Stage (EYFS)</h3>
                {expandedSections.has('eyfs') ? (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has('eyfs') && (
                <div className="space-y-6">
                  {/* Prime Areas */}
                  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-base font-bold text-gray-900">Prime Areas of Learning</h4>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Communication and Language */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">1. Communication and Language</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Listening, Attention and Understanding</h6>
                            <div className="space-y-2">
                              {[
                                "Listen attentively and respond appropriately.",
                                "Make comments and ask questions.",
                                "Hold conversations about stories, instructions, or discussions."
                              ].map((statement, index) => {
                                const targetId = `eyfs-communication-listening-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Speaking</h6>
                            <div className="space-y-2">
                              {[
                                "Participate in small group/class/1:1 discussions.",
                                "Offer explanations and express ideas using full sentences.",
                                "Use past, present, and future tenses and connectives."
                              ].map((statement, index) => {
                                const targetId = `eyfs-communication-speaking-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Physical Development */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">2. Physical Development</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Gross Motor Skills</h6>
                            <div className="space-y-2">
                              {[
                                "Show strength, balance, and coordination.",
                                "Move energetically (running, jumping, dancing, climbing).",
                                "Negotiate space and obstacles safely."
                              ].map((statement, index) => {
                                const targetId = `eyfs-physical-gross-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Fine Motor Skills</h6>
                            <div className="space-y-2">
                              {[
                                "Hold and use tools effectively (pencil, scissors).",
                                "Develop accuracy and care with writing and small movements."
                              ].map((statement, index) => {
                                const targetId = `eyfs-physical-fine-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Personal, Social and Emotional Development */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">3. Personal, Social and Emotional Development (PSED)</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Self-Regulation</h6>
                            <div className="space-y-2">
                              {[
                                "Show understanding of feelings (self and others).",
                                "Set and work towards goals.",
                                "Manage behaviour and attention."
                              ].map((statement, index) => {
                                const targetId = `eyfs-psed-self-regulation-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Managing Self</h6>
                            <div className="space-y-2">
                              {[
                                "Manage personal hygiene and dressing independently.",
                                "Show independence, confidence, and resilience.",
                                "Understand right/wrong and manage responsibility."
                              ].map((statement, index) => {
                                const targetId = `eyfs-psed-managing-self-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Building Relationships</h6>
                            <div className="space-y-2">
                              {[
                                "Work and play cooperatively.",
                                "Form positive attachments with peers/adults.",
                                "Show sensitivity to others' needs."
                              ].map((statement, index) => {
                                const targetId = `eyfs-psed-relationships-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specific Areas */}
                  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-base font-bold text-gray-900">Specific Areas of Learning</h4>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Literacy */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">4. Literacy</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Comprehension</h6>
                            <div className="space-y-2">
                              {[
                                "Demonstrate understanding of what has been read/heard.",
                                "Retell stories and anticipate key events.",
                                "Use knowledge of vocabulary, texts, and language."
                              ].map((statement, index) => {
                                const targetId = `eyfs-literacy-comprehension-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Word Reading</h6>
                            <div className="space-y-2">
                              {[
                                "Say a sound for each letter in the alphabet and digraphs taught.",
                                "Read words consistent with phonic knowledge.",
                                "Read aloud simple sentences/books."
                              ].map((statement, index) => {
                                const targetId = `eyfs-literacy-reading-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Writing</h6>
                            <div className="space-y-2">
                              {[
                                "Write recognisable letters, most correctly formed.",
                                "Spell words by identifying sounds and writing corresponding letters.",
                                "Write simple phrases and sentences."
                              ].map((statement, index) => {
                                const targetId = `eyfs-literacy-writing-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mathematics */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">5. Mathematics</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Number</h6>
                            <div className="space-y-2">
                              {[
                                "Have a deep understanding of numbers to 10.",
                                "Subitise (recognise quantities without counting).",
                                "Recall number bonds to 5 (and some to 10)."
                              ].map((statement, index) => {
                                const targetId = `eyfs-maths-number-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Numerical Patterns</h6>
                            <div className="space-y-2">
                              {[
                                "Verbally count beyond 20.",
                                "Compare quantities (greater than, less than, equal).",
                                "Explore and represent patterns within numbers (odds/evens, doubles, shared equally)."
                              ].map((statement, index) => {
                                const targetId = `eyfs-maths-patterns-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Understanding the World */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">6. Understanding the World</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Past and Present</h6>
                            <div className="space-y-2">
                              {[
                                "Talk about the lives of people around them.",
                                "Know similarities/differences between past and present.",
                                "Understand key historical figures/events."
                              ].map((statement, index) => {
                                const targetId = `eyfs-world-past-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">People, Culture and Communities</h6>
                            <div className="space-y-2">
                              {[
                                "Describe their immediate environment.",
                                "Know similarities/differences among cultures, religions, and communities.",
                                "Understand and celebrate diversity."
                              ].map((statement, index) => {
                                const targetId = `eyfs-world-people-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">The Natural World</h6>
                            <div className="space-y-2">
                              {[
                                "Explore the natural world.",
                                "Understand seasonal changes and processes.",
                                "Show care for living things and the environment."
                              ].map((statement, index) => {
                                const targetId = `eyfs-world-natural-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expressive Arts and Design */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h5 className="text-sm font-semibold text-gray-800">7. Expressive Arts and Design</h5>
                        </div>
                        <div className="ml-4 space-y-4">
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Creating with Materials</h6>
                            <div className="space-y-2">
                              {[
                                "Safely use and explore a range of materials, tools, and techniques.",
                                "Share creations, explaining the process.",
                                "Make use of props/materials in role play."
                              ].map((statement, index) => {
                                const targetId = `eyfs-arts-creating-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-gray-700">Being Imaginative and Expressive</h6>
                            <div className="space-y-2">
                              {[
                                "Invent, adapt, and recount narratives and stories.",
                                "Sing a range of songs and rhymes.",
                                "Perform, share, and move to music."
                              ].map((statement, index) => {
                                const targetId = `eyfs-arts-imaginative-${index}`;
                                return (
                                  <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100">
                                    <input
                                      type="checkbox"
                                      checked={selectedTargets.has(targetId)}
                                      onChange={() => toggleTarget(targetId)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Music & Drama Curriculum Sections */}
            {subjects.filter(subject => ['music', 'drama'].includes(subject.toLowerCase())).map(subject => (
              <div key={subject} className="bg-gray-50 rounded-lg p-6">
                <button
                  onClick={() => toggleSection(subject)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h3 className="text-xl font-bold text-gray-900 capitalize">{subject} Curriculum (Year 1-6)</h3>
                  {expandedSections.has(subject) ? (
                    <ChevronDown className="h-6 w-6 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-6 w-6 text-gray-500" />
                  )}
                </button>
                
                {expandedSections.has(subject) && (
                  <div className="space-y-6">
                    {getAllYearGroups(subject).map(yearGroup => (
                      <div key={yearGroup} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                        {/* Year Group Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                          <h4 className="text-base font-bold text-gray-900">{yearGroup}</h4>
                        </div>
                        
                        {/* Domains and Targets */}
                        <div className="p-6 space-y-6">
                          {getAllDomains(subject, yearGroup).map((domain, domainIndex) => {
                            const targetStatements = getTargetsForDomain(subject, yearGroup, domain) || [];
                            return (
                              <div key={domain} className="space-y-3">
                                {/* Domain Header */}
                                <div className="flex items-center space-x-3">
                                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                  <h5 className="text-sm font-semibold text-gray-800">{domain}</h5>
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {targetStatements.length} targets
                                  </span>
                                </div>
                                
                                {/* Individual "I can" statements */}
                                <div className="ml-4 space-y-2">
                                  {targetStatements.map((statement, index) => {
                                    const targetId = `${subject}-${yearGroup}-${domain}-${statement}`;
                                    return (
                                      <div key={targetId} className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors">
                                        <input
                                          type="checkbox"
                                          checked={selectedTargets.has(targetId)}
                                          onChange={() => toggleTarget(targetId)}
                                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <span className="text-sm text-gray-900 leading-relaxed">{statement}</span>
                                        </div>
                                        {isAdmin && (
                                          <div className="flex items-center space-x-1 ml-2">
                                            <button
                                              onClick={() => handleEditTarget(targetId, statement)}
                                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                              <Edit3 className="h-3 w-3" />
                                            </button>
                                            <button
                                              onClick={() => deleteTarget(targetId)}
                                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Separator between domains */}
                                {domainIndex < getAllDomains(subject, yearGroup).length - 1 && (
                                  <div className="border-b border-gray-100"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          ) : (
            <div className="space-y-6">
              {/* Class Selection */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((classItem) => (
                    <button
                      key={classItem.id}
                      onClick={() => setSelectedClass(classItem.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedClass === classItem.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {classItem.yearGroup} • {classItem.students?.length || 0} students
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Selection for Selected Class */}
              {selectedClass && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select Targets for {classes.find(c => c.id === selectedClass)?.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {selectedTargets.size} targets selected
                    </div>
                  </div>

                  {/* Music & Drama Targets */}
                  <div className="space-y-4">
                    {subjects.filter(subject => ['music', 'drama'].includes(subject.toLowerCase())).map(subject => (
                      <div key={subject} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 capitalize">{subject}</h4>
                        <div className="space-y-3">
                          {getAllYearGroups(subject).map(yearGroup => (
                            <div key={yearGroup} className="bg-gray-50 rounded-lg p-3">
                              <h5 className="font-medium text-gray-800 mb-2">{yearGroup}</h5>
                              <div className="space-y-2">
                                {getAllDomains(subject, yearGroup).map(domain => {
                                  const targets = getTargetsForDomain(subject, yearGroup, domain) || [];
                                  return (
                                    <div key={domain} className="space-y-1">
                                      <h6 className="text-sm font-medium text-gray-700">{domain}</h6>
                                      <div className="space-y-1">
                                        {targets.map((statement, index) => {
                                          const targetId = `${subject}-${yearGroup}-${domain}-${statement}`;
                                          return (
                                            <label key={targetId} className="flex items-start space-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={selectedTargets.has(targetId)}
                                                onChange={() => toggleTarget(targetId)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                                              />
                                              <span className="text-sm text-gray-900">{statement}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Footer */}
      {!embedded && (
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          {activeTab === 'manage' ? (
            <button
              onClick={() => {
                // TODO: Implement save functionality
                onClose();
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={assignTargetsToClass}
              disabled={!selectedClass || selectedTargets.size === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Assign to Class</span>
            </button>
          )}
        </div>
      )}
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {content}
      </div>
    </div>
  );
}

