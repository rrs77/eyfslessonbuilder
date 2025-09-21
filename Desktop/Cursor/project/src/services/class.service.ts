// ============================================================================
// CLASS SERVICE - Implements class-related service interfaces
// ============================================================================

import { BaseService, Injectable } from './base.service';
import { 
  IClassService, 
  IUserClassService, 
  ICategoryService 
} from '../interfaces';
import { 
  Class, 
  ClassCategory, 
  ClassSpecificCategory, 
  UserRole,
  SearchParams,
  CreateClassData,
  UpdateClassData
} from '../types';
import { ErrorFactory } from '../utils';
import { DB_TABLES } from '../constants';

// ============================================================================
// CLASS SERVICE IMPLEMENTATION
// ============================================================================

export class ClassService extends BaseService implements IClassService {
  /**
   * Get all classes
   */
  async getAll(): Promise<Class[]> {
    try {
      const response = await this.get<Class[]>(`/rest/v1/${DB_TABLES.CLASSES}`);
      return this.handleResponse(response);
    } catch (error) {
      console.log('Classes table not found, returning default classes');
      // Return default classes if table doesn't exist
      return [
        { id: 'LKG', name: 'LKG', displayName: 'Lower Kindergarten', description: 'Lower Kindergarten class', color: '#10B981', isActive: true, categories: [], curriculumTargets: [] },
        { id: 'UKG', name: 'UKG', displayName: 'Upper Kindergarten', description: 'Upper Kindergarten class', color: '#3B82F6', isActive: true, categories: [], curriculumTargets: [] },
        { id: 'Reception', name: 'Reception', displayName: 'Reception', description: 'Reception class', color: '#8B5CF6', isActive: true, categories: [], curriculumTargets: [] }
      ];
    }
  }

  /**
   * Get class by ID
   */
  async getById(id: string): Promise<Class | null> {
    try {
      const response = await this.get<Class[]>(`/rest/v1/${DB_TABLES.CLASSES}?id=eq.${id}`);
      const classes = this.handleResponse(response);
      return classes.length > 0 ? classes[0] : null;
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch class');
    }
  }

  /**
   * Create new class
   */
  async create(classData: CreateClassData): Promise<Class> {
    try {
      const response = await this.post<Class>(`/rest/v1/${DB_TABLES.CLASSES}`, {
        name: classData.name,
        display_name: classData.displayName,
        description: classData.description || '',
        color: classData.color || '#6B7280',
        is_active: true,
        custom_assessment_statements: classData.customAssessmentStatements || [],
        class_specific_categories: classData.classSpecificCategories || []
      });
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to create class');
    }
  }

  /**
   * Update existing class
   */
  async update(id: string, updates: UpdateClassData): Promise<Class> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.customAssessmentStatements !== undefined) {
        updateData.custom_assessment_statements = updates.customAssessmentStatements;
      }
      if (updates.classSpecificCategories !== undefined) {
        updateData.class_specific_categories = updates.classSpecificCategories;
      }

      const response = await this.put<Class>(`/rest/v1/${DB_TABLES.CLASSES}?id=eq.${id}`, updateData);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to update class');
    }
  }

  /**
   * Delete class
   */
  async delete(id: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.CLASSES}?id=eq.${id}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete class');
    }
  }

  /**
   * Search classes
   */
  async search(params: SearchParams): Promise<Class[]> {
    try {
      const searchParams = this.buildSearchParams(params);
      const response = await this.get<Class[]>(`/rest/v1/${DB_TABLES.CLASSES}`, searchParams);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to search classes');
    }
  }

  /**
   * Get classes by role
   */
  async getByRole(role: UserRole): Promise<Class[]> {
    try {
      const response = await this.get<Class[]>(`/rest/v1/${DB_TABLES.CLASSES}?role=eq.${role}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch classes by role');
    }
  }

  /**
   * Get categories for a class
   */
  async getCategories(classId: string): Promise<ClassCategory[]> {
    try {
      const response = await this.get<ClassCategory[]>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?class_id=eq.${classId}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch class categories');
    }
  }

  /**
   * Add category to class
   */
  async addCategory(classId: string, categoryId: string): Promise<void> {
    try {
      await this.post(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}`, {
        class_id: classId,
        category_id: categoryId
      });
    } catch (error) {
      throw ErrorFactory.server('Failed to add category to class');
    }
  }

  /**
   * Remove category from class
   */
  async removeCategory(classId: string, categoryId: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?class_id=eq.${classId}&category_id=eq.${categoryId}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to remove category from class');
    }
  }

  /**
   * Add custom category to class
   */
  async addCustomCategory(classId: string, category: ClassSpecificCategory): Promise<void> {
    try {
      // Get current class
      const currentClass = await this.getById(classId);
      if (!currentClass) {
        throw ErrorFactory.notFound('Class not found');
      }

      // Add custom category to existing list
      const updatedCategories = [
        ...(currentClass.classSpecificCategories || []),
        category
      ];

      await this.update(classId, { classSpecificCategories: updatedCategories });
    } catch (error) {
      throw ErrorFactory.server('Failed to add custom category');
    }
  }

  /**
   * Remove custom category from class
   */
  async removeCustomCategory(classId: string, categoryName: string): Promise<void> {
    try {
      // Get current class
      const currentClass = await this.getById(classId);
      if (!currentClass) {
        throw ErrorFactory.notFound('Class not found');
      }

      // Remove custom category from list
      const updatedCategories = (currentClass.classSpecificCategories || [])
        .filter(cat => cat.name !== categoryName);

      await this.update(classId, { classSpecificCategories: updatedCategories });
    } catch (error) {
      throw ErrorFactory.server('Failed to remove custom category');
    }
  }

  /**
   * Add assessment statement to class
   */
  async addAssessmentStatement(classId: string, statement: string): Promise<void> {
    try {
      // Get current class
      const currentClass = await this.getById(classId);
      if (!currentClass) {
        throw ErrorFactory.notFound('Class not found');
      }

      // Add statement to existing list
      const updatedStatements = [
        ...(currentClass.customAssessmentStatements || []),
        statement
      ];

      await this.update(classId, { customAssessmentStatements: updatedStatements });
    } catch (error) {
      throw ErrorFactory.server('Failed to add assessment statement');
    }
  }

  /**
   * Remove assessment statement from class
   */
  async removeAssessmentStatement(classId: string, statement: string): Promise<void> {
    try {
      // Get current class
      const currentClass = await this.getById(classId);
      if (!currentClass) {
        throw ErrorFactory.notFound('Class not found');
      }

      // Remove statement from list
      const updatedStatements = (currentClass.customAssessmentStatements || [])
        .filter(stmt => stmt !== statement);

      await this.update(classId, { customAssessmentStatements: updatedStatements });
    } catch (error) {
      throw ErrorFactory.server('Failed to remove assessment statement');
    }
  }

  /**
   * Update assessment statements for class
   */
  async updateAssessmentStatements(classId: string, statements: string[]): Promise<void> {
    try {
      await this.update(classId, { customAssessmentStatements: statements });
    } catch (error) {
      throw ErrorFactory.server('Failed to update assessment statements');
    }
  }
}

// ============================================================================
// USER CLASS SERVICE IMPLEMENTATION
// ============================================================================

export class UserClassService extends BaseService implements IUserClassService {
  /**
   * Assign user to class
   */
  async assignUserToClass(userId: string, classId: string): Promise<void> {
    try {
      await this.post(`/rest/v1/${DB_TABLES.USER_CLASSES}`, {
        user_id: userId,
        class_id: classId
      });
    } catch (error) {
      throw ErrorFactory.server('Failed to assign user to class');
    }
  }

  /**
   * Remove user from class
   */
  async removeUserFromClass(userId: string, classId: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.USER_CLASSES}?user_id=eq.${userId}&class_id=eq.${classId}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to remove user from class');
    }
  }

  /**
   * Get classes for a user
   */
  async getUserClasses(userId: string): Promise<Class[]> {
    try {
      // First get user-class assignments
      const assignmentsResponse = await this.get<{ class_id: string }[]>(
        `/rest/v1/${DB_TABLES.USER_CLASSES}?user_id=eq.${userId}`
      );
      const assignments = this.handleResponse(assignmentsResponse);

      if (assignments.length === 0) {
        return [];
      }

      // Get class details for each assignment
      const classIds = assignments.map(a => a.class_id);
      const classesResponse = await this.get<Class[]>(
        `/rest/v1/${DB_TABLES.CLASSES}?id=in.(${classIds.join(',')})`
      );
      
      return this.handleResponse(classesResponse);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch user classes');
    }
  }

  /**
   * Get users for a class
   */
  async getClassUsers(classId: string): Promise<string[]> {
    try {
      const response = await this.get<{ user_id: string }[]>(
        `/rest/v1/${DB_TABLES.USER_CLASSES}?class_id=eq.${classId}`
      );
      const assignments = this.handleResponse(response);
      return assignments.map(a => a.user_id);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch class users');
    }
  }

  /**
   * Assign user to multiple classes
   */
  async assignUserToMultipleClasses(userId: string, classIds: string[]): Promise<void> {
    try {
      const assignments = classIds.map(classId => ({
        user_id: userId,
        class_id: classId
      }));

      await this.post(`/rest/v1/${DB_TABLES.USER_CLASSES}`, assignments);
    } catch (error) {
      throw ErrorFactory.server('Failed to assign user to multiple classes');
    }
  }

  /**
   * Remove user from multiple classes
   */
  async removeUserFromMultipleClasses(userId: string, classIds: string[]): Promise<void> {
    try {
      const classIdList = classIds.join(',');
      await this.delete(`/rest/v1/${DB_TABLES.USER_CLASSES}?user_id=eq.${userId}&class_id=in.(${classIdList})`);
    } catch (error) {
      throw ErrorFactory.server('Failed to remove user from multiple classes');
    }
  }
}

// ============================================================================
// CATEGORY SERVICE IMPLEMENTATION
// ============================================================================

export class CategoryService extends BaseService implements ICategoryService {
  /**
   * Get all categories
   */
  async getAll(): Promise<ClassCategory[]> {
    try {
      const response = await this.get<ClassCategory[]>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch categories');
    }
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<ClassCategory | null> {
    try {
      const response = await this.get<ClassCategory[]>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?id=eq.${id}`);
      const categories = this.handleResponse(response);
      return categories.length > 0 ? categories[0] : null;
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch category');
    }
  }

  /**
   * Create new category
   */
  async create(category: Omit<ClassCategory, 'id'>): Promise<ClassCategory> {
    try {
      const response = await this.post<ClassCategory>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}`, category);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to create category');
    }
  }

  /**
   * Update existing category
   */
  async update(id: string, category: Partial<ClassCategory>): Promise<ClassCategory> {
    try {
      const response = await this.put<ClassCategory>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?id=eq.${id}`, category);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to update category');
    }
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?id=eq.${id}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete category');
    }
  }

  /**
   * Search categories
   */
  async search(params: SearchParams): Promise<ClassCategory[]> {
    try {
      const searchParams = this.buildSearchParams(params);
      const response = await this.get<ClassCategory[]>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}`, searchParams);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to search categories');
    }
  }

  /**
   * Get categories by class
   */
  async getByClass(classId: string): Promise<ClassCategory[]> {
    try {
      const response = await this.get<ClassCategory[]>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?class_id=eq.${classId}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch categories by class');
    }
  }

  /**
   * Get available categories
   */
  async getAvailable(): Promise<ClassCategory[]> {
    try {
      const response = await this.get<ClassCategory[]>(`/rest/v1/${DB_TABLES.CLASS_CATEGORIES}?is_active=eq.true`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch available categories');
    }
  }
}
