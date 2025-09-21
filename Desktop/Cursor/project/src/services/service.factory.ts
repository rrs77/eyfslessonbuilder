// ============================================================================
// SERVICE FACTORY - Dependency injection and service management
// ============================================================================

import { ServiceFactory as BaseServiceFactory } from './base.service';
import { AuthService, PermissionService, RoleService } from './auth.service';
import { ActivityService, LessonService, UnitService, HalfTermService, EyfsService } from './data.service';
import { ClassService, UserClassService, CategoryService } from './class.service';
import { SubjectService, ThemeService, SettingsService, SettingsPermissionService } from './settings.service';

// ============================================================================
// SERVICE REGISTRY
// ============================================================================

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Initialize all services
   */
  private initializeServices(): void {
    // Authentication Services
    this.register('authService', new AuthService());
    this.register('permissionService', new PermissionService());
    this.register('roleService', new RoleService());

    // Data Services
    this.register('activityService', new ActivityService());
    this.register('lessonService', new LessonService());
    this.register('unitService', new UnitService());
    this.register('halfTermService', new HalfTermService());
    this.register('eyfsService', new EyfsService());

    // Class Services
    this.register('classService', new ClassService());
    this.register('userClassService', new UserClassService());
    this.register('categoryService', new CategoryService());

    // Settings Services
    this.register('subjectService', new SubjectService());
    this.register('themeService', new ThemeService());
    this.register('settingsService', new SettingsService());
    this.register('settingsPermissionService', new SettingsPermissionService());
  }

  /**
   * Register a service
   */
  register<T>(key: string, service: T): void {
    this.services.set(key, service);
    BaseServiceFactory.register(key, service as any);
  }

  /**
   * Get a service by key
   */
  get<T>(key: string): T | undefined {
    return this.services.get(key) as T;
  }

  /**
   * Get all services
   */
  getAll(): Map<string, any> {
    return new Map(this.services);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    BaseServiceFactory.clear();
  }

  /**
   * Check if service exists
   */
  has(key: string): boolean {
    return this.services.has(key);
  }
}

// ============================================================================
// SERVICE LOCATOR
// ============================================================================

export class ServiceLocator {
  private static registry = ServiceRegistry.getInstance();

  /**
   * Get authentication service
   */
  static getAuthService(): AuthService {
    return this.registry.get<AuthService>('authService')!;
  }

  /**
   * Get permission service
   */
  static getPermissionService(): PermissionService {
    return this.registry.get<PermissionService>('permissionService')!;
  }

  /**
   * Get role service
   */
  static getRoleService(): RoleService {
    return this.registry.get<RoleService>('roleService')!;
  }

  /**
   * Get activity service
   */
  static getActivityService(): ActivityService {
    return this.registry.get<ActivityService>('activityService')!;
  }

  /**
   * Get lesson service
   */
  static getLessonService(): LessonService {
    return this.registry.get<LessonService>('lessonService')!;
  }

  /**
   * Get unit service
   */
  static getUnitService(): UnitService {
    return this.registry.get<UnitService>('unitService')!;
  }

  /**
   * Get half-term service
   */
  static getHalfTermService(): HalfTermService {
    return this.registry.get<HalfTermService>('halfTermService')!;
  }

  /**
   * Get EYFS service
   */
  static getEyfsService(): EyfsService {
    return this.registry.get<EyfsService>('eyfsService')!;
  }

  /**
   * Get class service
   */
  static getClassService(): ClassService {
    return this.registry.get<ClassService>('classService')!;
  }

  /**
   * Get user class service
   */
  static getUserClassService(): UserClassService {
    return this.registry.get<UserClassService>('userClassService')!;
  }

  /**
   * Get category service
   */
  static getCategoryService(): CategoryService {
    return this.registry.get<CategoryService>('categoryService')!;
  }

  /**
   * Get subject service
   */
  static getSubjectService(): SubjectService {
    return this.registry.get<SubjectService>('subjectService')!;
  }

  /**
   * Get theme service
   */
  static getThemeService(): ThemeService {
    return this.registry.get<ThemeService>('themeService')!;
  }

  /**
   * Get settings service
   */
  static getSettingsService(): SettingsService {
    return this.registry.get<SettingsService>('settingsService')!;
  }

  /**
   * Get settings permission service
   */
  static getSettingsPermissionService(): SettingsPermissionService {
    return this.registry.get<SettingsPermissionService>('settingsPermissionService')!;
  }
}

// ============================================================================
// SERVICE HOOKS
// ============================================================================

export function useService<T>(serviceKey: string): T {
  const service = ServiceLocator.registry.get<T>(serviceKey);
  if (!service) {
    throw new Error(`Service not found: ${serviceKey}`);
  }
  return service;
}

// ============================================================================
// SERVICE PROVIDER
// ============================================================================

import React from 'react';

export interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  // Initialize services when provider mounts
  React.useEffect(() => {
    ServiceRegistry.getInstance();
  }, []);

  return React.createElement(React.Fragment, null, children);
}

// ============================================================================
// SERVICE MOCKING FOR TESTING
// ============================================================================

export class ServiceMocker {
  private static mocks: Map<string, any> = new Map();

  /**
   * Mock a service
   */
  static mock<T>(serviceKey: string, mockImplementation: T): void {
    this.mocks.set(serviceKey, mockImplementation);
    ServiceLocator.registry.register(serviceKey, mockImplementation);
  }

  /**
   * Clear all mocks
   */
  static clearMocks(): void {
    this.mocks.clear();
    ServiceLocator.registry.clear();
    ServiceRegistry.getInstance().initializeServices();
  }

  /**
   * Restore original service
   */
  static restore(serviceKey: string): void {
    this.mocks.delete(serviceKey);
    ServiceRegistry.getInstance().initializeServices();
  }
}
