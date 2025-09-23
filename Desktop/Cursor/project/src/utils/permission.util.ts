// ============================================================================
// PERMISSION UTILITIES - Following DRY principles
// ============================================================================

import { UserRole, User } from '../types';

// ============================================================================
// ROLE HIERARCHY
// ============================================================================

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'administrator': 4,
  'slt': 3,
  'teacher': 2,
  'ta': 1
};

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',
  
  // Class Management
  CLASS_CREATE: 'class:create',
  CLASS_READ: 'class:read',
  CLASS_UPDATE: 'class:update',
  CLASS_DELETE: 'class:delete',
  CLASS_MANAGE: 'class:manage',
  
  // Activity Management
  ACTIVITY_CREATE: 'activity:create',
  ACTIVITY_READ: 'activity:read',
  ACTIVITY_UPDATE: 'activity:update',
  ACTIVITY_DELETE: 'activity:delete',
  ACTIVITY_MANAGE: 'activity:manage',
  
  // Lesson Management
  LESSON_CREATE: 'lesson:create',
  LESSON_READ: 'lesson:read',
  LESSON_UPDATE: 'lesson:update',
  LESSON_DELETE: 'lesson:delete',
  LESSON_MANAGE: 'lesson:manage',
  
  // Settings Management
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_MANAGE: 'settings:manage',
  
  // System Management
  SYSTEM_MANAGE: 'system:manage',
  SYSTEM_READ: 'system:read'
} as const;

// ============================================================================
// ROLE PERMISSIONS MAPPING
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'administrator': [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.CLASS_CREATE,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.CLASS_UPDATE,
    PERMISSIONS.CLASS_DELETE,
    PERMISSIONS.CLASS_MANAGE,
    PERMISSIONS.ACTIVITY_CREATE,
    PERMISSIONS.ACTIVITY_READ,
    PERMISSIONS.ACTIVITY_UPDATE,
    PERMISSIONS.ACTIVITY_DELETE,
    PERMISSIONS.ACTIVITY_MANAGE,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_READ,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.LESSON_MANAGE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.SYSTEM_MANAGE,
    PERMISSIONS.SYSTEM_READ
  ],
  
  'slt': [
    PERMISSIONS.USER_READ,
    PERMISSIONS.CLASS_CREATE,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.CLASS_UPDATE,
    PERMISSIONS.CLASS_MANAGE,
    PERMISSIONS.ACTIVITY_CREATE,
    PERMISSIONS.ACTIVITY_READ,
    PERMISSIONS.ACTIVITY_UPDATE,
    PERMISSIONS.ACTIVITY_DELETE,
    PERMISSIONS.ACTIVITY_MANAGE,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_READ,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.LESSON_MANAGE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.SYSTEM_READ
  ],
  
  'teacher': [
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.ACTIVITY_CREATE,
    PERMISSIONS.ACTIVITY_READ,
    PERMISSIONS.ACTIVITY_UPDATE,
    PERMISSIONS.ACTIVITY_DELETE,
    PERMISSIONS.LESSON_CREATE,
    PERMISSIONS.LESSON_READ,
    PERMISSIONS.LESSON_UPDATE,
    PERMISSIONS.LESSON_DELETE,
    PERMISSIONS.SETTINGS_READ
  ],
  
  'ta': [
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.ACTIVITY_READ,
    PERMISSIONS.LESSON_READ,
    PERMISSIONS.SETTINGS_READ
  ]
};

// ============================================================================
// PERMISSION UTILITIES
// ============================================================================

export class PermissionService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: User, permission: string): boolean {
    if (!user || !user.role) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: User, permissions: string[]): boolean {
    if (!user || !user.role) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: User, permissions: string[]): boolean {
    if (!user || !user.role) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Get all permissions for a user role
   */
  static getRolePermissions(role: UserRole): string[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Check if one role is higher than another
   */
  static isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
    return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
  }

  /**
   * Check if a manager role can manage a target role
   */
  static canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
  }

  /**
   * Check if user is admin
   */
  static isAdmin(user: User): boolean {
    return user?.role === 'administrator';
  }

  /**
   * Check if user is SLT or higher
   */
  static isSLTOrHigher(user: User): boolean {
    return user?.role === 'slt' || user?.role === 'administrator';
  }

  /**
   * Check if user is teacher or higher
   */
  static isTeacherOrHigher(user: User): boolean {
    return ['teacher', 'slt', 'administrator'].includes(user?.role || '');
  }
}

// ============================================================================
// PERMISSION HOOKS
// ============================================================================

export function usePermissions(user: User) {
  return {
    hasPermission: (permission: string) => PermissionService.hasPermission(user, permission),
    hasAnyPermission: (permissions: string[]) => PermissionService.hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: string[]) => PermissionService.hasAllPermissions(user, permissions),
    isAdmin: () => PermissionService.isAdmin(user),
    isSLTOrHigher: () => PermissionService.isSLTOrHigher(user),
    isTeacherOrHigher: () => PermissionService.isTeacherOrHigher(user),
    canManageRole: (targetRole: UserRole) => PermissionService.canManageRole(user.role, targetRole)
  };
}

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const ADMIN_EMAIL = 'rob.reichstorer@gmail.com';

export function isAdminUser(user: User): boolean {
  return user?.email === ADMIN_EMAIL || user?.role === 'administrator';
}

// ============================================================================
// PERMISSION GUARDS
// ============================================================================

export function requirePermission(user: User, permission: string): boolean {
  if (!PermissionService.hasPermission(user, permission)) {
    throw new Error(`Access denied. Required permission: ${permission}`);
  }
  return true;
}

export function requireRole(user: User, requiredRole: UserRole): boolean {
  if (!user || ROLE_HIERARCHY[user.role] < ROLE_HIERARCHY[requiredRole]) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }
  return true;
}






