// ============================================================================
// SETTINGS SERVICE - Implements settings-related service interfaces
// ============================================================================

import { BaseService, Injectable } from './base.service';
import { 
  ISubjectService, 
  IThemeService, 
  ISettingsService, 
  IPermissionService 
} from '../interfaces';
import { 
  Subject, 
  Category, 
  Theme, 
  UserRole,
  SearchParams
} from '../types';
import { ErrorFactory, PermissionService } from '../utils';
import { DB_TABLES, THEME_CONFIG } from '../constants';

// ============================================================================
// SUBJECT SERVICE IMPLEMENTATION
// ============================================================================

export class SubjectService extends BaseService implements ISubjectService {
  /**
   * Get all subjects
   */
  async getAll(): Promise<Subject[]> {
    try {
      const response = await this.get<Subject[]>(`/rest/v1/${DB_TABLES.SUBJECTS}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch subjects');
    }
  }

  /**
   * Get subject by ID
   */
  async getById(id: string): Promise<Subject | null> {
    try {
      const response = await this.get<Subject[]>(`/rest/v1/${DB_TABLES.SUBJECTS}?id=eq.${id}`);
      const subjects = this.handleResponse(response);
      return subjects.length > 0 ? subjects[0] : null;
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch subject');
    }
  }

  /**
   * Create new subject
   */
  async create(subject: Omit<Subject, 'id'>): Promise<Subject> {
    try {
      const response = await this.post<Subject>(`/rest/v1/${DB_TABLES.SUBJECTS}`, subject);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to create subject');
    }
  }

  /**
   * Update existing subject
   */
  async update(id: string, subject: Partial<Subject>): Promise<Subject> {
    try {
      const response = await this.put<Subject>(`/rest/v1/${DB_TABLES.SUBJECTS}?id=eq.${id}`, subject);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to update subject');
    }
  }

  /**
   * Delete subject
   */
  async delete(id: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.SUBJECTS}?id=eq.${id}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete subject');
    }
  }

  /**
   * Search subjects
   */
  async search(params: SearchParams): Promise<Subject[]> {
    try {
      const searchParams = this.buildSearchParams(params);
      const response = await this.get<Subject[]>(`/rest/v1/${DB_TABLES.SUBJECTS}`, searchParams);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to search subjects');
    }
  }

  /**
   * Get active subjects
   */
  async getActive(): Promise<Subject[]> {
    try {
      const response = await this.get<Subject[]>(`/rest/v1/${DB_TABLES.SUBJECTS}?is_active=eq.true`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch active subjects');
    }
  }

  /**
   * Get categories for a subject
   */
  async getCategories(subjectId: string): Promise<Category[]> {
    try {
      const response = await this.get<Category[]>(`/rest/v1/${DB_TABLES.SUBJECT_CATEGORIES}?subject_id=eq.${subjectId}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch subject categories');
    }
  }

  /**
   * Add category to subject
   */
  async addCategory(subjectId: string, category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const response = await this.post<Category>(`/rest/v1/${DB_TABLES.SUBJECT_CATEGORIES}`, {
        ...category,
        subject_id: subjectId
      });
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to add category to subject');
    }
  }

  /**
   * Update category in subject
   */
  async updateCategory(subjectId: string, categoryId: string, category: Partial<Category>): Promise<Category> {
    try {
      const response = await this.put<Category>(
        `/rest/v1/${DB_TABLES.SUBJECT_CATEGORIES}?id=eq.${categoryId}&subject_id=eq.${subjectId}`, 
        category
      );
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to update category');
    }
  }

  /**
   * Delete category from subject
   */
  async deleteCategory(subjectId: string, categoryId: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.SUBJECT_CATEGORIES}?id=eq.${categoryId}&subject_id=eq.${subjectId}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete category');
    }
  }
}

// ============================================================================
// THEME SERVICE IMPLEMENTATION
// ============================================================================

export class ThemeService extends BaseService implements IThemeService {
  private currentTheme: Theme = THEME_CONFIG.DEFAULT_THEME;

  constructor() {
    super();
    this.loadStoredTheme();
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.storeTheme(theme);
  }

  /**
   * Get theme for a specific class
   */
  getThemeForClass(className: string): Theme {
    const classTheme = THEME_CONFIG.CLASS_THEMES[className as keyof typeof THEME_CONFIG.CLASS_THEMES];
    return classTheme || this.currentTheme;
  }

  /**
   * Reset to default theme
   */
  resetToDefault(): void {
    this.currentTheme = THEME_CONFIG.DEFAULT_THEME;
    this.storeTheme(this.currentTheme);
  }

  /**
   * Get available color palette
   */
  getColorPalette(): string[] {
    return THEME_CONFIG.COLOR_PALETTE;
  }

  /**
   * Validate color format
   */
  validateColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  /**
   * Generate color scheme from base color
   */
  generateColorScheme(baseColor: string): Theme {
    if (!this.validateColor(baseColor)) {
      return this.currentTheme;
    }

    // Simple color scheme generation
    const primary = baseColor;
    const secondary = this.adjustColorBrightness(baseColor, -20);
    const accent = this.adjustColorBrightness(baseColor, 20);

    return { primary, secondary, accent };
  }

  /**
   * Store theme in localStorage
   */
  private storeTheme(theme: Theme): void {
    try {
      localStorage.setItem('app_theme', JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to store theme:', error);
    }
  }

  /**
   * Load theme from localStorage
   */
  private loadStoredTheme(): void {
    try {
      const stored = localStorage.getItem('app_theme');
      if (stored) {
        this.currentTheme = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored theme:', error);
      this.resetToDefault();
    }
  }

  /**
   * Adjust color brightness
   */
  private adjustColorBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}

// ============================================================================
// SETTINGS SERVICE IMPLEMENTATION
// ============================================================================

export class SettingsService extends BaseService implements ISettingsService {
  private readonly SETTINGS_KEY = 'app_settings';
  private readonly USER_PREFERENCES_KEY = 'user_preferences';

  /**
   * Get school name
   */
  getSchoolName(): string {
    try {
      const settings = this.getSystemSettings();
      return settings.schoolName || 'Creative Curriculum Designer';
    } catch (error) {
      return 'Creative Curriculum Designer';
    }
  }

  /**
   * Set school name
   */
  setSchoolName(name: string): void {
    try {
      const settings = this.getSystemSettings();
      settings.schoolName = name;
      this.setSystemSetting('schoolName', name);
    } catch (error) {
      console.warn('Failed to set school name:', error);
    }
  }

  /**
   * Get school logo
   */
  getSchoolLogo(): string {
    try {
      const settings = this.getSystemSettings();
      return settings.schoolLogo || '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Set school logo
   */
  setSchoolLogo(logoUrl: string): void {
    try {
      this.setSystemSetting('schoolLogo', logoUrl);
    } catch (error) {
      console.warn('Failed to set school logo:', error);
    }
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId: string): Record<string, any> {
    try {
      const key = `${this.USER_PREFERENCES_KEY}_${userId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to get user preferences:', error);
      return {};
    }
  }

  /**
   * Set user preference
   */
  setUserPreference(userId: string, key: string, value: any): void {
    try {
      const key = `${this.USER_PREFERENCES_KEY}_${userId}`;
      const preferences = this.getUserPreferences(userId);
      preferences[key] = value;
      localStorage.setItem(key, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to set user preference:', error);
    }
  }

  /**
   * Reset user preferences
   */
  resetUserPreferences(userId: string): void {
    try {
      const key = `${this.USER_PREFERENCES_KEY}_${userId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to reset user preferences:', error);
    }
  }

  /**
   * Get system settings
   */
  getSystemSettings(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to get system settings:', error);
      return {};
    }
  }

  /**
   * Set system setting
   */
  setSystemSetting(key: string, value: any): void {
    try {
      const settings = this.getSystemSettings();
      settings[key] = value;
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to set system setting:', error);
    }
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    try {
      localStorage.removeItem(this.SETTINGS_KEY);
      // Reset user preferences for all users
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.USER_PREFERENCES_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to reset to defaults:', error);
    }
  }
}

// ============================================================================
// PERMISSION SERVICE IMPLEMENTATION
// ============================================================================

export class SettingsPermissionService extends BaseService implements IPermissionService {
  /**
   * Check if user can access a resource and action
   */
  canAccess(userRole: UserRole, resource: string, action: string): boolean {
    const permission = `${resource}:${action}`;
    return PermissionService.hasPermission({ role: userRole } as any, permission);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(userRole: UserRole, permission: string): boolean {
    return PermissionService.hasPermission({ role: userRole } as any, permission);
  }

  /**
   * Check if user can manage users
   */
  canManageUsers(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'user:manage');
  }

  /**
   * Check if user can manage classes
   */
  canManageClasses(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'class:manage');
  }

  /**
   * Check if user can manage settings
   */
  canManageSettings(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'settings:manage');
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
