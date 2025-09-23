// ============================================================================
// AUTHENTICATION INTERFACES - Following Interface Segregation Principle
// ============================================================================

import { User, AuthState, UserRole } from '../types';

// ============================================================================
// AUTHENTICATION SERVICE INTERFACE
// ============================================================================

export interface IAuthService {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<string>;
  validateToken(token: string): Promise<boolean>;
}

// ============================================================================
// AUTHENTICATION CONTEXT INTERFACE
// ============================================================================

export interface IAuthContext {
  // State
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Utilities
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
}

// ============================================================================
// PERMISSION SERVICE INTERFACE
// ============================================================================

export interface IPermissionService {
  canAccess: (resource: string, action: string, user: User) => boolean;
  getUserPermissions: (user: User) => string[];
  hasPermission: (permission: string, user: User) => boolean;
}

// ============================================================================
// ROLE SERVICE INTERFACE
// ============================================================================

export interface IRoleService {
  getRolePermissions: (role: UserRole) => string[];
  isRoleHigherThan: (role1: UserRole, role2: UserRole) => boolean;
  canManageRole: (managerRole: UserRole, targetRole: UserRole) => boolean;
}






