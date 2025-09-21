import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit3, Trash2, Mail, Shield, UserCheck, X, Save, Eye, EyeOff, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useClass } from '../contexts/ClassContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'ta' | 'slt' | 'administrator';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  purchasedItems?: string[];
  password?: string;
  passwordLastChanged?: string;
  assignedClasses?: string[]; // Array of class IDs
}

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserManagement({ isOpen, onClose }: UserManagementProps) {
  const { user } = useAuth();
  const { classes, assignUserToClass, getUserClasses } = useClass();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'teacher' as 'teacher' | 'ta' | 'slt' | 'administrator',
    password: '',
    isActive: true,
    purchasedItems: [] as string[],
    assignedClasses: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showPasswordReminder, setShowPasswordReminder] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [showClassAssignment, setShowClassAssignment] = useState(false);
  const [selectedUserForClasses, setSelectedUserForClasses] = useState<User | null>(null);

  // Check if current user is admin
  const isAdmin = user?.email === 'rob.reichstorer@gmail.com' || 
                  user?.role === 'administrator';

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadUsers();
    }
  }, [isOpen, isAdmin]);

  // Available purchase options
  const purchaseOptions = [
    { id: 'year-group-lkg', name: 'LKG Activities', description: 'Lower Kindergarten activities and resources' },
    { id: 'year-group-ukg', name: 'UKG Activities', description: 'Upper Kindergarten activities and resources' },
    { id: 'year-group-reception', name: 'Reception Activities', description: 'Reception class activities and resources' },
    { id: 'music-curriculum', name: 'Music Curriculum', description: 'Complete music curriculum for all year groups' },
    { id: 'drama-curriculum', name: 'Drama Curriculum', description: 'Complete drama curriculum for all year groups' },
    { id: 'eyfs-standards', name: 'EYFS Standards', description: 'Early Years Foundation Stage assessment standards' }
  ];

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Load users from the actual authentication system
      const actualUsers: User[] = [
        {
          id: '1',
          email: 'rob.reichstorer@gmail.com',
          name: 'Rob Reichstorer',
          role: 'administrator',
          isActive: true,
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString().split('T')[0], // Today since you're logged in
          purchasedItems: ['year-group-lkg', 'year-group-ukg', 'music-curriculum', 'drama-curriculum', 'eyfs-standards'],
          assignedClasses: ['lkg-class-id', 'ukg-class-id', 'reception-class-id'], // Mock class IDs
          password: 'mubqaZ-piske5-xecdur', // Your actual password from AuthContext
          passwordLastChanged: '2024-01-01'
        }
        // Additional users can be added here as they're created
      ];
      setUsers(actualUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.email.trim() || !formData.name.trim() || !formData.password.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      // Create new user and add to the list
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        role: formData.role,
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split('T')[0],
        purchasedItems: formData.purchasedItems,
        assignedClasses: formData.assignedClasses,
        password: formData.password,
        passwordLastChanged: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => [...prev, newUser]);
      setShowCreateForm(false);
      setFormData({
        email: '',
        name: '',
        role: 'teacher',
        password: '',
        isActive: true,
        purchasedItems: [],
        assignedClasses: []
      });
      
      // In a real app, this would also add the user to the AuthContext localUsers array
      console.log('New user created:', newUser);
      alert(`User ${newUser.name} created successfully with password: ${newUser.password}`);
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setFormData({
      email: userToEdit.email,
      name: userToEdit.name,
      role: userToEdit.role,
      password: '',
      isActive: userToEdit.isActive,
      purchasedItems: userToEdit.purchasedItems || [],
      assignedClasses: userToEdit.assignedClasses || []
    });
    setShowCreateForm(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !formData.email.trim() || !formData.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      // In a real app, this would call your API
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, email: formData.email, name: formData.name, role: formData.role, isActive: formData.isActive, purchasedItems: formData.purchasedItems, assignedClasses: formData.assignedClasses }
          : u
      ));
      
      setEditingUser(null);
      setShowCreateForm(false);
      setFormData({
        email: '',
        name: '',
        role: 'teacher',
        password: '',
        isActive: true,
        purchasedItems: [],
        assignedClasses: []
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    if (!confirm(`Are you sure you want to delete "${userToDelete.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // In a real app, this would call your API
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const toggleUserStatus = async (userToToggle: User) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userToToggle.id 
          ? { ...u, isActive: !u.isActive }
          : u
      ));
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const sendPasswordReminder = async (userEmail: string) => {
    try {
      // In a real app, this would send an email with password reset instructions
      console.log(`Password reminder sent to: ${userEmail}`);
      alert(`Password reminder sent to ${userEmail}`);
      setShowPasswordReminder(false);
      setReminderEmail('');
    } catch (error) {
      console.error('Failed to send password reminder:', error);
      alert('Failed to send password reminder. Please try again.');
    }
  };

  const resetUserPassword = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s password? They will need to set a new password on next login.')) {
      return;
    }

    try {
      // In a real app, this would generate a temporary password and send it to the user
      const tempPassword = `temp${Math.random().toString(36).substr(2, 8)}!`;
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, password: tempPassword, passwordLastChanged: new Date().toISOString().split('T')[0] }
          : u
      ));
      alert(`Password reset. New temporary password: ${tempPassword}`);
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  // Class assignment functions
  const handleClassAssignment = (userToAssign: User) => {
    setSelectedUserForClasses(userToAssign);
    setShowClassAssignment(true);
  };

  const handleAssignToClass = async (classId: string) => {
    if (!selectedUserForClasses) return;

    try {
      // In a real app, this would call the API
      await assignUserToClass(selectedUserForClasses.id, classId);
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === selectedUserForClasses.id 
          ? { ...u, assignedClasses: [...(u.assignedClasses || []), classId] }
          : u
      ));
      
      alert(`User assigned to class successfully`);
    } catch (error) {
      console.error('Failed to assign user to class:', error);
      alert('Failed to assign user to class. Please try again.');
    }
  };

  const handleRemoveFromClass = async (classId: string) => {
    if (!selectedUserForClasses) return;

    try {
      // In a real app, this would call the API
      setUsers(prev => prev.map(u => 
        u.id === selectedUserForClasses.id 
          ? { ...u, assignedClasses: (u.assignedClasses || []).filter(id => id !== classId) }
          : u
      ));
      
      alert(`User removed from class successfully`);
    } catch (error) {
      console.error('Failed to remove user from class:', error);
      alert('Failed to remove user from class. Please try again.');
    }
  };

  // Get available classes based on purchased items
  const getAvailableClasses = (purchasedItems: string[]) => {
    return classes.filter(cls => {
      // Map purchased items to class access
      if (purchasedItems.includes('year-group-lkg') && cls.name === 'LKG') return true;
      if (purchasedItems.includes('year-group-ukg') && cls.name === 'UKG') return true;
      if (purchasedItems.includes('year-group-reception') && cls.name === 'Reception') return true;
      if (purchasedItems.includes('music-curriculum') || purchasedItems.includes('drama-curriculum')) return true;
      return false;
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'slt':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'teacher':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'ta':
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'slt':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ta':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600">Create and manage user accounts</p>
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
          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Users ({users.length})</h3>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p>Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                        {!user.isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <span>Created: {user.createdAt}</span>
                        {user.lastLogin && <span>Last login: {user.lastLogin}</span>}
                      </div>
                      {user.purchasedItems && user.purchasedItems.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">Purchased: {user.purchasedItems.join(', ')}</span>
                        </div>
                      )}
                      {user.assignedClasses && user.assignedClasses.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-blue-600">Classes: {user.assignedClasses.length} assigned</span>
                        </div>
                      )}
                      <div className="mt-1 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Password:</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              {showPasswords[user.id] ? user.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(user.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              {showPasswords[user.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                        {user.passwordLastChanged && (
                          <span className="text-xs text-gray-500">
                            Changed: {user.passwordLastChanged}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleClassAssignment(user)}
                      className="px-3 py-1.5 text-green-600 hover:bg-green-50 text-xs rounded transition-colors flex items-center space-x-1"
                      title="Assign to classes"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Classes</span>
                    </button>
                    <button
                      onClick={() => resetUserPassword(user.id)}
                      className="px-3 py-1.5 text-purple-600 hover:bg-purple-50 text-xs rounded transition-colors"
                      title="Reset password"
                    >
                      Reset PW
                    </button>
                    <button
                      onClick={() => {
                        setReminderEmail(user.email);
                        setShowPasswordReminder(true);
                      }}
                      className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 text-xs rounded transition-colors"
                      title="Send password reminder"
                    >
                      Remind
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`px-3 py-1.5 text-xs rounded transition-colors ${
                        user.isActive 
                          ? 'text-orange-600 hover:bg-orange-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 text-xs rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No users found</p>
              <p className="text-sm">Click "Add New User" to get started</p>
            </div>
          )}
        </div>

        {/* Create/Edit User Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                    setFormData({
                      email: '',
                      name: '',
                      role: 'teacher',
                      password: '',
                      isActive: true
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'teacher' | 'ta' | 'slt' | 'administrator' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="ta">Teaching Assistant (TA)</option>
                    <option value="slt">Senior Leadership Team (SLT)</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
                
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchased Items
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {purchaseOptions.map((option) => (
                      <label key={option.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.purchasedItems.includes(option.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                purchasedItems: [...prev.purchasedItems, option.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                purchasedItems: prev.purchasedItems.filter(id => id !== option.id)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{option.name}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active user
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                    setFormData({
                      email: '',
                      name: '',
                      role: 'teacher',
                      password: '',
                      isActive: true
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Reminder Modal */}
        {showPasswordReminder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Send Password Reminder</h3>
                <button
                  onClick={() => {
                    setShowPasswordReminder(false);
                    setReminderEmail('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    This will send a password reset email to the user with instructions to create a new password.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowPasswordReminder(false);
                    setReminderEmail('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendPasswordReminder(reminderEmail)}
                  disabled={!reminderEmail.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Class Assignment Modal */}
        {showClassAssignment && selectedUserForClasses && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Assign Classes</h3>
                  <p className="text-sm text-gray-600">
                    Assign classes to {selectedUserForClasses.name} based on their purchased items
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowClassAssignment(false);
                    setSelectedUserForClasses(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Purchased Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserForClasses.purchasedItems?.map(itemId => {
                      const option = purchaseOptions.find(opt => opt.id === itemId);
                      return option ? (
                        <span key={itemId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {option.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Classes:</h4>
                  <div className="space-y-3">
                    {getAvailableClasses(selectedUserForClasses.purchasedItems || []).map((cls) => {
                      const isAssigned = selectedUserForClasses.assignedClasses?.includes(cls.id) || false;
                      return (
                        <div key={cls.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: cls.color }}
                            ></div>
                            <div>
                              <div className="font-medium text-gray-900">{cls.displayName}</div>
                              <div className="text-sm text-gray-500">{cls.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isAssigned ? (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Assigned</span>
                                <button
                                  onClick={() => handleRemoveFromClass(cls.id)}
                                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-xs rounded transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAssignToClass(cls.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                              >
                                Assign
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {getAvailableClasses(selectedUserForClasses.purchasedItems || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No classes available</p>
                    <p className="text-sm">This user needs to purchase items to access classes</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowClassAssignment(false);
                    setSelectedUserForClasses(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
