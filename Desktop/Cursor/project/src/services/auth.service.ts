// ============================================================================
// AUTHENTICATION SERVICE - Implements IAuthService interface
// ============================================================================

import { BaseService, Injectable } from './base.service';
import { IAuthService, IPermissionService, IRoleService } from '../interfaces';
import { User, UserRole } from '../types';
import { ErrorFactory, PermissionService } from '../utils';
import { ADMIN_EMAIL } from '../constants';

// ============================================================================
// AUTHENTICATION SERVICE IMPLEMENTATION
// ============================================================================

export class AuthService extends BaseService implements IAuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    super();
    this.loadStoredAuth();
  }

  /**
   * Authenticate user with username and password
   */
  async login(username: string, password: string): Promise<User> {
    try {
      // For demo purposes, we'll use mock authentication
      // In production, this would make an API call to your auth server
      const user = await this.mockAuthenticate(username, password);
      
      this.currentUser = user;
      this.token = user.token || null;
      
      // Store authentication data
      this.storeAuth(user);
      
      return user;
    } catch (error) {
      throw ErrorFactory.authentication('Invalid credentials');
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.currentUser = null;
    this.token = null;
    this.clearStoredAuth();
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to load from storage
    this.loadStoredAuth();
    return this.currentUser;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    if (!this.token) {
      throw ErrorFactory.authentication('No token to refresh');
    }

    try {
      // In production, this would make an API call to refresh the token
      const response = await this.post<{ token: string }>('/auth/refresh', {
        token: this.token
      });

      if (response.success && response.data) {
        this.token = response.data.token;
        this.storeAuth(this.currentUser!);
        return this.token;
      }

      throw ErrorFactory.authentication('Token refresh failed');
    } catch (error) {
      throw ErrorFactory.authentication('Token refresh failed');
    }
  }

  /**
   * Validate authentication token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.post<{ valid: boolean }>('/auth/validate', {
        token
      });

      return response.success && response.data?.valid === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate user with local users or WordPress
   */
  private async mockAuthenticate(username: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Local users database
    const localUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'rob.reichstorer@gmail.com',
        password: 'mubqaZ-piske5-xecdur',
        name: 'Rob Reichstorer',
        avatar: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        role: 'administrator' as UserRole
      }
    ];

    // First, check local users
    const localUser = localUsers.find(u => u.email === username && u.password === password);
    
    if (localUser) {
      const userData: User = {
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        avatar: localUser.avatar,
        role: localUser.role,
        token: `rhythmstix_local_${localUser.id}`,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      return userData;
    }

    // If not found in local users, try WordPress authentication
    const wordpressUrl = import.meta.env.VITE_WORDPRESS_URL;
    
    if (wordpressUrl && wordpressUrl !== 'https://your-wordpress-site.com') {
      try {
        // Import wordpressAPI dynamically to avoid circular dependencies
        const { wordpressAPI } = await import('../config/api');
        const authResponse = await wordpressAPI.authenticate(username, password);
        
        if (authResponse.token) {
          const userInfo = await wordpressAPI.getUserInfo(authResponse.token);
          
          const userData: User = {
            id: userInfo.id.toString(),
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.avatar_urls?.['96'] || userInfo.avatar_urls?.['48'],
            role: (userInfo.roles?.[0] || 'subscriber') as UserRole,
            token: authResponse.token,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          return userData;
        } else {
          throw new Error('No token received from WordPress');
        }
      } catch (wpError) {
        console.warn('WordPress authentication failed:', wpError);
        // Fall through to generic error
      }
    }

    // If we get here, authentication failed
    throw new Error('Invalid credentials. Please check your email and password.');
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuth(user: User): void {
    try {
      localStorage.setItem('rhythmstix_auth_token', user.token || '');
      localStorage.setItem('rhythmstix_auth_user', JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to store authentication data:', error);
    }
  }

  /**
   * Load authentication data from localStorage
   */
  private loadStoredAuth(): void {
    try {
      const storedToken = localStorage.getItem('rhythmstix_auth_token');
      const storedUser = localStorage.getItem('rhythmstix_auth_user');

      if (storedToken && storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.token = storedToken;
      }
    } catch (error) {
      console.warn('Failed to load stored authentication data:', error);
      this.clearStoredAuth();
    }
  }

  /**
   * Clear stored authentication data
   */
  private clearStoredAuth(): void {
    try {
      localStorage.removeItem('rhythmstix_auth_token');
      localStorage.removeItem('rhythmstix_auth_user');
    } catch (error) {
      console.warn('Failed to clear stored authentication data:', error);
    }
  }
}

// ============================================================================
// PERMISSION SERVICE IMPLEMENTATION
// ============================================================================

export class PermissionService extends BaseService implements IPermissionService {
  /**
   * Check if user can access a specific resource and action
   */
  canAccess(resource: string, action: string, user: User): boolean {
    if (!user || !user.role) return false;

    const permission = `${resource}:${action}`;
    return PermissionService.hasPermission(user, permission);
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(user: User): string[] {
    if (!user || !user.role) return [];
    return PermissionService.getRolePermissions(user.role);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string, user: User): boolean {
    return PermissionService.hasPermission(user, permission);
  }
}

// ============================================================================
// ROLE SERVICE IMPLEMENTATION
// ============================================================================

export class RoleService extends BaseService implements IRoleService {
  /**
   * Get permissions for a specific role
   */
  getRolePermissions(role: UserRole): string[] {
    return PermissionService.getRolePermissions(role);
  }

  /**
   * Check if one role is higher than another
   */
  isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
    return PermissionService.isRoleHigherThan(role1, role2);
  }

  /**
   * Check if a manager role can manage a target role
   */
  canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return PermissionService.canManageRole(managerRole, targetRole);
  }
}
