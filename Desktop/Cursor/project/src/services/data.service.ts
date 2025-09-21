// ============================================================================
// DATA SERVICE - Implements data-related service interfaces
// ============================================================================

import { BaseService, Injectable } from './base.service';
import { 
  IActivityService, 
  ILessonService, 
  IUnitService, 
  IHalfTermService, 
  IEyfsService 
} from '../interfaces';
import { 
  Activity, 
  LessonData, 
  LessonPlan, 
  Unit, 
  HalfTerm, 
  EyfsData,
  SearchParams,
  ApiResponse 
} from '../types';
import { ErrorFactory } from '../utils';
import { DB_TABLES } from '../constants';

// ============================================================================
// ACTIVITY SERVICE IMPLEMENTATION
// ============================================================================

export class ActivityService extends BaseService implements IActivityService {
  /**
   * Get all activities
   */
  async getAll(): Promise<Activity[]> {
    try {
      const response = await this.get<any[]>(`/rest/v1/${DB_TABLES.ACTIVITIES}`);
      const result = this.handleResponse(response);
      
      // Map database field names back to frontend field names
      return result.map(activity => ({
        id: activity.id,
        _id: activity.id,
        activity: activity.activity,
        description: activity.description,
        activityText: activity.activity_text,
        time: activity.time,
        videoLink: activity.video_link,
        musicLink: activity.music_link,
        backingLink: activity.backing_link,
        resourceLink: activity.resource_link,
        link: activity.link,
        vocalsLink: activity.vocals_link,
        imageLink: activity.image_link,
        teachingUnit: activity.teaching_unit,
        category: activity.category,
        level: activity.level,
        unitName: activity.unit_name,
        lessonNumber: activity.lesson_number,
        eyfsStandards: activity.eyfs_standards
      }));
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch activities');
    }
  }

  /**
   * Get activity by ID
   */
  async getById(id: string): Promise<Activity | null> {
    try {
      const response = await this.get<any[]>(`/rest/v1/${DB_TABLES.ACTIVITIES}?id=eq.${id}`);
      const result = this.handleResponse(response);
      
      if (result.length === 0) return null;
      
      const activity = result[0];
      
      // Map database field names back to frontend field names
      return {
        id: activity.id,
        _id: activity.id,
        activity: activity.activity,
        description: activity.description,
        activityText: activity.activity_text,
        time: activity.time,
        videoLink: activity.video_link,
        musicLink: activity.music_link,
        backingLink: activity.backing_link,
        resourceLink: activity.resource_link,
        link: activity.link,
        vocalsLink: activity.vocals_link,
        imageLink: activity.image_link,
        teachingUnit: activity.teaching_unit,
        category: activity.category,
        level: activity.level,
        unitName: activity.unit_name,
        lessonNumber: activity.lesson_number,
        eyfsStandards: activity.eyfs_standards
      };
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch activity');
    }
  }

  /**
   * Create new activity
   */
  async create(activity: Omit<Activity, 'id' | '_id'>): Promise<Activity> {
    try {
      // Map frontend field names to database field names
      const dbActivity = {
        activity: activity.activity,
        description: activity.description,
        activity_text: activity.activityText,
        time: activity.time,
        video_link: activity.videoLink,
        music_link: activity.musicLink,
        backing_link: activity.backingLink,
        resource_link: activity.resourceLink,
        link: activity.link,
        vocals_link: activity.vocalsLink,
        image_link: activity.imageLink,
        teaching_unit: activity.teachingUnit,
        category: activity.category,
        level: activity.level,
        unit_name: activity.unitName,
        lesson_number: activity.lessonNumber,
        eyfs_standards: activity.eyfsStandards
      };

      const response = await this.post<Activity>(`/rest/v1/${DB_TABLES.ACTIVITIES}`, dbActivity);
      const result = this.handleResponse(response);
      
      // Map database field names back to frontend field names
      return {
        id: result.id,
        _id: result.id,
        activity: result.activity,
        description: result.description,
        activityText: result.activity_text,
        time: result.time,
        videoLink: result.video_link,
        musicLink: result.music_link,
        backingLink: result.backing_link,
        resourceLink: result.resource_link,
        link: result.link,
        vocalsLink: result.vocals_link,
        imageLink: result.image_link,
        teachingUnit: result.teaching_unit,
        category: result.category,
        level: result.level,
        unitName: result.unit_name,
        lessonNumber: result.lesson_number,
        eyfsStandards: result.eyfs_standards
      };
    } catch (error) {
      throw ErrorFactory.server('Failed to create activity');
    }
  }

  /**
   * Update existing activity
   */
  async update(id: string, activity: Partial<Activity>): Promise<Activity> {
    try {
      // Map frontend field names to database field names
      const dbActivity: any = {};
      
      if (activity.activity !== undefined) dbActivity.activity = activity.activity;
      if (activity.description !== undefined) dbActivity.description = activity.description;
      if (activity.activityText !== undefined) dbActivity.activity_text = activity.activityText;
      if (activity.time !== undefined) dbActivity.time = activity.time;
      if (activity.videoLink !== undefined) dbActivity.video_link = activity.videoLink;
      if (activity.musicLink !== undefined) dbActivity.music_link = activity.musicLink;
      if (activity.backingLink !== undefined) dbActivity.backing_link = activity.backingLink;
      if (activity.resourceLink !== undefined) dbActivity.resource_link = activity.resourceLink;
      if (activity.link !== undefined) dbActivity.link = activity.link;
      if (activity.vocalsLink !== undefined) dbActivity.vocals_link = activity.vocalsLink;
      if (activity.imageLink !== undefined) dbActivity.image_link = activity.imageLink;
      if (activity.teachingUnit !== undefined) dbActivity.teaching_unit = activity.teachingUnit;
      if (activity.category !== undefined) dbActivity.category = activity.category;
      if (activity.level !== undefined) dbActivity.level = activity.level;
      if (activity.unitName !== undefined) dbActivity.unit_name = activity.unitName;
      if (activity.lessonNumber !== undefined) dbActivity.lesson_number = activity.lessonNumber;
      if (activity.eyfsStandards !== undefined) dbActivity.eyfs_standards = activity.eyfsStandards;

      const response = await this.patch<Activity>(`/rest/v1/${DB_TABLES.ACTIVITIES}?id=eq.${id}`, dbActivity);
      const result = this.handleResponse(response);
      
      // If PATCH returns null (204 No Content), fetch the updated activity
      if (result === null) {
        return await this.getById(id);
      }
      
      // Map database field names back to frontend field names
      return {
        id: result.id,
        _id: result.id,
        activity: result.activity,
        description: result.description,
        activityText: result.activity_text,
        time: result.time,
        videoLink: result.video_link,
        musicLink: result.music_link,
        backingLink: result.backing_link,
        resourceLink: result.resource_link,
        link: result.link,
        vocalsLink: result.vocals_link,
        imageLink: result.image_link,
        teachingUnit: result.teaching_unit,
        category: result.category,
        level: result.level,
        unitName: result.unit_name,
        lessonNumber: result.lesson_number,
        eyfsStandards: result.eyfs_standards
      };
    } catch (error) {
      throw ErrorFactory.server('Failed to update activity');
    }
  }

  /**
   * Delete activity
   */
  async delete(id: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.ACTIVITIES}?id=eq.${id}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete activity');
    }
  }

  /**
   * Search activities
   */
  async search(params: SearchParams): Promise<Activity[]> {
    try {
      const searchParams = this.buildSearchParams(params);
      const response = await this.get<Activity[]>(`/rest/v1/${DB_TABLES.ACTIVITIES}`, searchParams);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to search activities');
    }
  }

  /**
   * Get activities by category
   */
  async getByCategory(category: string): Promise<Activity[]> {
    try {
      const response = await this.get<Activity[]>(`/rest/v1/${DB_TABLES.ACTIVITIES}?category=eq.${category}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch activities by category');
    }
  }

  /**
   * Get activities by level
   */
  async getByLevel(level: string): Promise<Activity[]> {
    try {
      const response = await this.get<Activity[]>(`/rest/v1/${DB_TABLES.ACTIVITIES}?level=eq.${level}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch activities by level');
    }
  }

  /**
   * Create multiple activities
   */
  async createMany(activities: Omit<Activity, 'id' | '_id'>[]): Promise<Activity[]> {
    try {
      const response = await this.post<Activity[]>(`/rest/v1/${DB_TABLES.ACTIVITIES}`, activities);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to create activities');
    }
  }

  /**
   * Delete multiple activities
   */
  async deleteMany(ids: string[]): Promise<void> {
    try {
      const idList = ids.join(',');
      await this.delete(`/rest/v1/${DB_TABLES.ACTIVITIES}?id=in.(${idList})`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete activities');
    }
  }
}

// ============================================================================
// LESSON SERVICE IMPLEMENTATION
// ============================================================================

export class LessonService extends BaseService implements ILessonService {
  /**
   * Get all lessons
   */
  async getAll(): Promise<Record<string, LessonData>> {
    try {
      const response = await this.get<Record<string, LessonData>>(`/rest/v1/${DB_TABLES.LESSONS}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch lessons');
    }
  }

  /**
   * Get lesson by number
   */
  async getByNumber(lessonNumber: string): Promise<LessonData | null> {
    try {
      const response = await this.get<LessonData[]>(`/rest/v1/${DB_TABLES.LESSONS}?lesson_number=eq.${lessonNumber}`);
      const lessons = this.handleResponse(response);
      return lessons.length > 0 ? lessons[0] : null;
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch lesson');
    }
  }

  /**
   * Update lesson title
   */
  async updateTitle(lessonNumber: string, title: string): Promise<void> {
    try {
      await this.put(`/rest/v1/${DB_TABLES.LESSONS}?lesson_number=eq.${lessonNumber}`, { title });
    } catch (error) {
      throw ErrorFactory.server('Failed to update lesson title');
    }
  }

  /**
   * Update lesson data
   */
  async updateData(lessonNumber: string, data: LessonData): Promise<void> {
    try {
      await this.put(`/rest/v1/${DB_TABLES.LESSONS}?lesson_number=eq.${lessonNumber}`, data);
    } catch (error) {
      throw ErrorFactory.server('Failed to update lesson data');
    }
  }

  /**
   * Delete lesson
   */
  async delete(lessonNumber: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.LESSONS}?lesson_number=eq.${lessonNumber}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete lesson');
    }
  }

  /**
   * Get lesson plans
   */
  async getLessonPlans(): Promise<LessonPlan[]> {
    try {
      const response = await this.get<any[]>(`/rest/v1/${DB_TABLES.LESSON_PLANS}`);
      const result = this.handleResponse(response);
      
      // Map database field names back to frontend field names
      return result.map(plan => ({
        id: plan.id,
        title: plan.title,
        lessonNumber: plan.lesson_number,
        className: plan.class_name,
        activities: plan.activities || [],
        duration: plan.duration || 0,
        notes: plan.notes || '',
        status: plan.status || 'draft',
        term: plan.term,
        week: plan.week || 1,
        date: plan.date ? new Date(plan.date) : new Date(),
        unitId: plan.unit_id,
        unitName: plan.unit_name,
        createdAt: plan.created_at ? new Date(plan.created_at) : new Date(),
        updatedAt: plan.updated_at ? new Date(plan.updated_at) : new Date()
      }));
    } catch (error) {
      console.log('Lesson plans table not found, returning empty array');
      return [];
    }
  }

  /**
   * Create lesson plan
   */
  async createLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<LessonPlan> {
    try {
      // Map frontend field names to database field names
      const dbPlan = {
        title: plan.title,
        lesson_number: plan.lessonNumber,
        class_name: plan.className,
        activities: plan.activities,
        duration: plan.duration,
        notes: plan.notes,
        status: plan.status,
        term: plan.term,
        week: plan.week,
        date: plan.date,
        unit_id: plan.unitId,
        unit_name: plan.unitName,
        created_at: new Date(),
        updated_at: new Date()
      };

      const response = await this.post<LessonPlan>(`/rest/v1/${DB_TABLES.LESSON_PLANS}`, dbPlan);
      const result = this.handleResponse(response);
      
      // Map database field names back to frontend field names
      return {
        id: result.id,
        title: result.title,
        lessonNumber: result.lesson_number,
        className: result.class_name,
        activities: result.activities,
        duration: result.duration,
        notes: result.notes,
        status: result.status,
        term: result.term,
        week: result.week,
        date: result.date,
        unitId: result.unit_id,
        unitName: result.unit_name,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      throw ErrorFactory.server('Failed to create lesson plan');
    }
  }

  /**
   * Update lesson plan
   */
  async updateLessonPlan(id: string, plan: Partial<LessonPlan>): Promise<LessonPlan> {
    try {
      // Map frontend field names to database field names
      const dbPlan: any = {
        updated_at: new Date()
      };
      
      if (plan.title !== undefined) dbPlan.title = plan.title;
      if (plan.lessonNumber !== undefined) dbPlan.lesson_number = plan.lessonNumber;
      if (plan.className !== undefined) dbPlan.class_name = plan.className;
      if (plan.activities !== undefined) dbPlan.activities = plan.activities;
      if (plan.duration !== undefined) dbPlan.duration = plan.duration;
      if (plan.notes !== undefined) dbPlan.notes = plan.notes;
      if (plan.status !== undefined) dbPlan.status = plan.status;
      if (plan.term !== undefined) dbPlan.term = plan.term;
      if (plan.week !== undefined) dbPlan.week = plan.week;
      if (plan.date !== undefined) dbPlan.date = plan.date;
      if (plan.unitId !== undefined) dbPlan.unit_id = plan.unitId;
      if (plan.unitName !== undefined) dbPlan.unit_name = plan.unitName;

      const response = await this.put<LessonPlan>(`/rest/v1/${DB_TABLES.LESSON_PLANS}?id=eq.${id}`, dbPlan);
      const result = this.handleResponse(response);
      
      // Map database field names back to frontend field names
      return {
        id: result.id,
        title: result.title,
        lessonNumber: result.lesson_number,
        className: result.class_name,
        activities: result.activities,
        duration: result.duration,
        notes: result.notes,
        status: result.status,
        term: result.term,
        week: result.week,
        date: result.date,
        unitId: result.unit_id,
        unitName: result.unit_name,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      throw ErrorFactory.server('Failed to update lesson plan');
    }
  }

  /**
   * Delete lesson plan
   */
  async deleteLessonPlan(id: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.LESSON_PLANS}?id=eq.${id}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete lesson plan');
    }
  }
}

// ============================================================================
// UNIT SERVICE IMPLEMENTATION
// ============================================================================

export class UnitService extends BaseService implements IUnitService {
  /**
   * Get all units for a sheet
   */
  async getAll(sheetName: string): Promise<Unit[]> {
    try {
      // Try to get units with sheet_name filter first
      const response = await this.get<Unit[]>(`/rest/v1/${DB_TABLES.UNITS}?sheet_name=eq.${sheetName}`);
      return this.handleResponse(response);
    } catch (error) {
      // If sheet_name column doesn't exist, try to get all units
      try {
        console.log('Sheet_name column not found, fetching all units');
        const response = await this.get<Unit[]>(`/rest/v1/${DB_TABLES.UNITS}`);
        return this.handleResponse(response);
      } catch (fallbackError) {
        console.log('Units table not found, returning empty array');
        return [];
      }
    }
  }

  /**
   * Get unit by ID
   */
  async getById(id: string): Promise<Unit | null> {
    try {
      const response = await this.get<Unit[]>(`/rest/v1/${DB_TABLES.UNITS}?id=eq.${id}`);
      const units = this.handleResponse(response);
      return units.length > 0 ? units[0] : null;
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch unit');
    }
  }

  /**
   * Create new unit
   */
  async create(unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
    try {
      const response = await this.post<Unit>(`/rest/v1/${DB_TABLES.UNITS}`, {
        ...unit,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to create unit');
    }
  }

  /**
   * Update existing unit
   */
  async update(id: string, unit: Partial<Unit>): Promise<Unit> {
    try {
      const response = await this.put<Unit>(`/rest/v1/${DB_TABLES.UNITS}?id=eq.${id}`, {
        ...unit,
        updatedAt: new Date()
      });
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to update unit');
    }
  }

  /**
   * Delete unit
   */
  async delete(id: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.UNITS}?id=eq.${id}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to delete unit');
    }
  }
}

// ============================================================================
// HALF-TERM SERVICE IMPLEMENTATION
// ============================================================================

export class HalfTermService extends BaseService implements IHalfTermService {
  /**
   * Get all half-terms for a sheet
   */
  async getAll(sheetName: string): Promise<HalfTerm[]> {
    try {
      const response = await this.get<HalfTerm[]>(`/rest/v1/${DB_TABLES.HALF_TERMS}?sheet_name=eq.${sheetName}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch half-terms');
    }
  }

  /**
   * Get half-term by ID
   */
  async getById(id: string, sheetName: string): Promise<HalfTerm | null> {
    try {
      const response = await this.get<HalfTerm[]>(`/rest/v1/${DB_TABLES.HALF_TERMS}?id=eq.${id}&sheet_name=eq.${sheetName}`);
      const halfTerms = this.handleResponse(response);
      return halfTerms.length > 0 ? halfTerms[0] : null;
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch half-term');
    }
  }

  /**
   * Update half-term
   */
  async update(id: string, lessons: string[], isComplete: boolean): Promise<HalfTerm> {
    try {
      const response = await this.put<HalfTerm>(`/rest/v1/${DB_TABLES.HALF_TERMS}?id=eq.${id}`, {
        lessons,
        isComplete
      });
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to update half-term');
    }
  }

  /**
   * Add lesson to half-term
   */
  async addLesson(id: string, lessonNumber: string): Promise<void> {
    try {
      // First get current lessons
      const current = await this.getById(id, '');
      if (current) {
        const updatedLessons = [...current.lessons, lessonNumber];
        await this.update(id, updatedLessons, current.isComplete);
      }
    } catch (error) {
      throw ErrorFactory.server('Failed to add lesson to half-term');
    }
  }

  /**
   * Remove lesson from half-term
   */
  async removeLesson(id: string, lessonNumber: string): Promise<void> {
    try {
      // First get current lessons
      const current = await this.getById(id, '');
      if (current) {
        const updatedLessons = current.lessons.filter(lesson => lesson !== lessonNumber);
        await this.update(id, updatedLessons, current.isComplete);
      }
    } catch (error) {
      throw ErrorFactory.server('Failed to remove lesson from half-term');
    }
  }

  /**
   * Clear all lessons from half-term
   */
  async clearAll(id: string): Promise<void> {
    try {
      await this.update(id, [], false);
    } catch (error) {
      throw ErrorFactory.server('Failed to clear half-term');
    }
  }
}

// ============================================================================
// EYFS SERVICE IMPLEMENTATION
// ============================================================================

export class EyfsService extends BaseService implements IEyfsService {
  /**
   * Get all EYFS statements
   */
  async getAllStatements(): Promise<string[]> {
    try {
      const response = await this.get<string[]>(`/rest/v1/${DB_TABLES.EYFS_STATEMENTS}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch EYFS statements');
    }
  }

  /**
   * Get structured EYFS statements
   */
  async getStructuredStatements(): Promise<Record<string, string[]>> {
    try {
      const response = await this.get<Record<string, string[]>>(`/rest/v1/${DB_TABLES.EYFS_STATEMENTS}/structured`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch structured EYFS statements');
    }
  }

  /**
   * Get EYFS data by sheet
   */
  async getBySheet(sheetName: string): Promise<EyfsData | null> {
    try {
      const response = await this.get<EyfsData>(`/rest/v1/${DB_TABLES.EYFS_STATEMENTS}?sheet_name=eq.${sheetName}`);
      return this.handleResponse(response);
    } catch (error) {
      throw ErrorFactory.server('Failed to fetch EYFS data');
    }
  }

  /**
   * Add EYFS statement
   */
  async addStatement(statement: string): Promise<void> {
    try {
      await this.post(`/rest/v1/${DB_TABLES.EYFS_STATEMENTS}`, { statement });
    } catch (error) {
      throw ErrorFactory.server('Failed to add EYFS statement');
    }
  }

  /**
   * Remove EYFS statement
   */
  async removeStatement(statement: string): Promise<void> {
    try {
      await this.delete(`/rest/v1/${DB_TABLES.EYFS_STATEMENTS}?statement=eq.${statement}`);
    } catch (error) {
      throw ErrorFactory.server('Failed to remove EYFS statement');
    }
  }

  /**
   * Update EYFS statements
   */
  async updateStatements(statements: string[]): Promise<void> {
    try {
      await this.put(`/rest/v1/${DB_TABLES.EYFS_STATEMENTS}`, { statements });
    } catch (error) {
      throw ErrorFactory.server('Failed to update EYFS statements');
    }
  }
}
