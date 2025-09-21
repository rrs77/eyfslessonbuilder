import { supabase, TABLES, isSupabaseConfigured } from '../../config/supabase';
import type { Activity, LessonData, LessonPlan } from '../types';


// Define the new types here since they're used in the API
export interface HalfTerm {
  id: string;
  lessons: string[];
  isComplete: boolean;
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  lessonNumbers: string[];
  color: string;
  term?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface YearGroup {
  id: string;
  name: string;
  color: string;
  sort_order: number;
}

// API endpoints for activities
export const activitiesApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.ACTIVITIES)
        .select('id, activity, description, activity_text, time, video_link, music_link, backing_link, resource_link, link, vocals_link, image_link, teaching_unit, category, level, unit_name, lesson_number, eyfs_standards');
      if (error) throw error;
      
      // Convert snake_case to camelCase for frontend
      return (data || []).map(item => ({
        _id: item.id,
        activity: item.activity,
        description: item.description,
        activityText: item.activity_text,
        time: item.time,
        videoLink: item.video_link,
        musicLink: item.music_link,
        backingLink: item.backing_link,
        resourceLink: item.resource_link,
        link: item.link,
        vocalsLink: item.vocals_link,
        imageLink: item.image_link,
        teachingUnit: item.teaching_unit,
        category: item.category,
        level: item.level,
        unitName: item.unit_name,
        lessonNumber: item.lesson_number,
        eyfsStandards: item.eyfs_standards
      }));
    } catch (error) {
      console.warn('Failed to get activities from Supabase:', error);
      throw error;
    }
  },
  
  create: async (activity: Activity) => {
    try {
      // Convert camelCase to snake_case for database
      const { uniqueId, ...activityData } = activity;
      const dbActivity = {
        activity: activityData.activity,
        description: activityData.description,
        activity_text: activityData.activityText,
        time: activityData.time,
        video_link: activityData.videoLink,
        music_link: activityData.musicLink,
        backing_link: activityData.backingLink,
        resource_link: activityData.resourceLink,
        link: activityData.link,
        vocals_link: activityData.vocalsLink,
        image_link: activityData.imageLink,
        teaching_unit: activityData.teachingUnit,
        category: activityData.category,
        level: activityData.level,
        unit_name: activityData.unitName,
        lesson_number: activityData.lessonNumber,
        eyfs_standards: activityData.eyfsStandards
      };
      
      const { data, error } = await supabase
        .from(TABLES.ACTIVITIES)
        .insert([dbActivity])
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to camelCase for frontend
      return {
        _id: data.id,
        activity: data.activity,
        description: data.description,
        activityText: data.activity_text,
        time: data.time,
        videoLink: data.video_link,
        musicLink: data.music_link,
        backingLink: data.backing_link,
        resourceLink: data.resource_link,
        link: data.link,
        vocalsLink: data.vocals_link,
        imageLink: data.image_link,
        teachingUnit: data.teaching_unit,
        category: data.category,
        level: data.level,
        unitName: data.unit_name,
        lessonNumber: data.lesson_number,
        eyfsStandards: data.eyfs_standards
      };
    } catch (error) {
      console.warn('Failed to create activity in Supabase:', error);
      throw error;
    }
  },
  
  update: async (id: string, activity: Activity) => {
    try {
      // Convert camelCase to snake_case for database
      const { uniqueId, ...activityData } = activity;
      const dbActivity = {
        activity: activityData.activity,
        description: activityData.description,
        activity_text: activityData.activityText,
        time: activityData.time,
        video_link: activityData.videoLink,
        music_link: activityData.musicLink,
        backing_link: activityData.backingLink,
        resource_link: activityData.resourceLink,
        link: activityData.link,
        vocals_link: activityData.vocalsLink,
        image_link: activityData.imageLink,
        teaching_unit: activityData.teachingUnit,
        category: activityData.category,
        level: activityData.level,
        unit_name: activityData.unitName,
        lesson_number: activityData.lessonNumber,
        eyfs_standards: activityData.eyfsStandards
      };
      
      const { data, error } = await supabase
        .from(TABLES.ACTIVITIES)
        .update(dbActivity)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to camelCase for frontend
      return {
        _id: data.id,
        activity: data.activity,
        description: data.description,
        activityText: data.activity_text,
        time: data.time,
        videoLink: data.video_link,
        musicLink: data.music_link,
        backingLink: data.backing_link,
        resourceLink: data.resource_link,
        link: data.link,
        vocalsLink: data.vocals_link,
        imageLink: data.image_link,
        teachingUnit: data.teaching_unit,
        category: data.category,
        level: data.level,
        unitName: data.unit_name,
        lessonNumber: data.lesson_number,
        eyfsStandards: data.eyfs_standards
      };
    } catch (error) {
      console.warn('Failed to update activity in Supabase:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.ACTIVITIES)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('Failed to delete activity from Supabase:', error);
      throw error;
    }
  },
  
  import: async (activities: Activity[]) => {
    try {
      // Convert camelCase to snake_case for database
      const cleanedActivities = activities.map(({ uniqueId, ...activity }) => ({
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
      }));
      
      // Use upsert with the correct constraint
      const { data, error } = await supabase
        .from(TABLES.ACTIVITIES)
        .upsert(cleanedActivities, { 
          onConflict: 'activity,category,lesson_number',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Failed to import activities to Supabase:', error);
      throw error;
    }
  }
};

// API endpoints for lessons
export const lessonsApi = {
  getBySheet: async (sheet: string) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.LESSONS)
        .select('*')
        .eq('sheet_name', sheet)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) {
        // No data found for this sheet
        return null;
      }
      
      return {
        allLessonsData: data.data || {},
        lessonNumbers: data.lesson_numbers || [],
        teachingUnits: data.teaching_units || [],
        eyfsStatements: data.eyfs_statements_map || {}
      };
    } catch (error) {
      console.warn(`Failed to get lessons for ${sheet} from Supabase:`, error);
      throw error;
    }
  },
  
  updateSheet: async (sheet: string, data: any) => {
    try {
      const { error } = await supabase
        .from(TABLES.LESSONS)
        .upsert({
          sheet_name: sheet,
          data: data.allLessonsData,
          lesson_numbers: data.lessonNumbers,
          teaching_units: data.teachingUnits,
          eyfs_statements_map: data.eyfsStatements
        }, { onConflict: 'sheet_name' });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn(`Failed to update lessons for ${sheet} in Supabase:`, error);
      throw error;
    }
  }
};

// API endpoints for lesson plans
export const lessonPlansApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.LESSON_PLANS)
        .select('*');
      
      if (error) throw error;
      
      // Convert dates from strings to Date objects
      return (data || []).map(plan => ({
        ...plan,
        date: new Date(plan.date),
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      }));
    } catch (error) {
      console.warn('Failed to get lesson plans from Supabase:', error);
      throw error;
    }
  },
  
  create: async (plan: LessonPlan) => {
    try {
      // Convert to snake_case for database
      const { data, error } = await supabase
        .from(TABLES.LESSON_PLANS)
        .insert([{
          date: plan.date.toISOString(),
          week: plan.week,
          class_name: plan.className,
          activities: plan.activities,
          duration: plan.duration,
          notes: plan.notes,
          status: plan.status,
          unit_id: plan.unitId,
          unit_name: plan.unitName,
          lesson_number: plan.lessonNumber,
          title: plan.title,
          term: plan.term,
          time: plan.time
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to camelCase for frontend
      return {
        ...data,
        id: data.id,
        className: data.class_name,
        unitId: data.unit_id,
        unitName: data.unit_name,
        lessonNumber: data.lesson_number,
        date: new Date(data.date),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.warn('Failed to create lesson plan in Supabase:', error);
      throw error;
    }
  },
  
  update: async (id: string, plan: LessonPlan) => {
    try {
      // Convert to snake_case for database
      const { data, error } = await supabase
        .from(TABLES.LESSON_PLANS)
        .update({
          date: plan.date.toISOString(),
          week: plan.week,
          class_name: plan.className,
          activities: plan.activities,
          duration: plan.duration,
          notes: plan.notes,
          status: plan.status,
          unit_id: plan.unitId,
          unit_name: plan.unitName,
          lesson_number: plan.lessonNumber,
          title: plan.title,
          term: plan.term,
          time: plan.time
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to camelCase for frontend
      return {
        ...data,
        id: data.id,
        className: data.class_name,
        unitId: data.unit_id,
        unitName: data.unit_name,
        lessonNumber: data.lesson_number,
        date: new Date(data.date),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.warn('Failed to update lesson plan in Supabase:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.LESSON_PLANS)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('Failed to delete lesson plan from Supabase:', error);
      throw error;
    }
  }
};

// API endpoints for EYFS standards
export const eyfsApi = {
  getBySheet: async (sheet: string) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EYFS_STATEMENTS)
        .select('*')
        .eq('sheet_name', sheet)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) {
        // No data found for this sheet
        return null;
      }
      
      return {
        allStatements: data.all_statements || [],
        structuredStatements: data.structured_statements || {}
      };
    } catch (error) {
      console.warn(`Failed to get EYFS standards for ${sheet} from Supabase:`, error);
      throw error;
    }
  },
  
  updateSheet: async (sheet: string, data: any) => {
    try {
      const { error } = await supabase
        .from(TABLES.EYFS_STATEMENTS)
        .upsert({
          sheet_name: sheet,
          all_statements: data.allStatements,
          structured_statements: data.structuredStatements
        }, { onConflict: 'sheet_name' });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn(`Failed to update EYFS standards for ${sheet} in Supabase:`, error);
      throw error;
    }
  }
};

// API endpoints for Year Groups
export const yearGroupsApi = {
  getAll: async (): Promise<YearGroup[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.YEAR_GROUPS)
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Failed to get year groups from Supabase:', error);
      throw error;
    }
  },

  create: async (yearGroup: Omit<YearGroup, 'sort_order'>): Promise<YearGroup> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.YEAR_GROUPS)
        .insert([{ ...yearGroup, sort_order: Date.now() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Failed to create year group in Supabase:', error);
      throw error;
    }
  },

  update: async (id: string, yearGroup: Partial<YearGroup>): Promise<YearGroup> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.YEAR_GROUPS)
        .update(yearGroup)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Failed to update year group in Supabase:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.YEAR_GROUPS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('Failed to delete year group from Supabase:', error);
      throw error;
    }
  },

  reorder: async (orderedIds: string[]): Promise<void> => {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        sort_order: index
      }));

      const { error } = await supabase
        .from(TABLES.YEAR_GROUPS)
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.warn('Failed to reorder year groups in Supabase:', error);
      throw error;
    }
  }
};

// API endpoints for Units
export const unitsApi = {
  getAll: async (sheetName: string): Promise<Unit[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.UNITS)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      console.warn('Failed to get units from Supabase:', error);
      throw error;
    }
  },

  create: async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'> & { sheet_name: string }): Promise<Unit> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.UNITS)
        .insert([unit])
        .select()
        .single();

      if (error) throw error;
      return { ...data, createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) };
    } catch (error) {
      console.warn('Failed to create unit in Supabase:', error);
      throw error;
    }
  },

  update: async (id: string, unit: Partial<Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Unit> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.UNITS)
        .update({ ...unit, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) };
    } catch (error) {
      console.warn('Failed to update unit in Supabase:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.UNITS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('Failed to delete unit from Supabase:', error);
      throw error;
    }
  }
};

// API endpoints for Half Terms
export const halfTermsApi = {
  getAll: async (sheetName: string): Promise<HalfTerm[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.HALF_TERMS)
        .select('*')
        .eq('sheet_name', sheetName)
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Failed to get half terms from Supabase:', error);
      throw error;
    }
  },

  update: async (halfTerm: HalfTerm & { sheet_name: string }): Promise<HalfTerm> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.HALF_TERMS)
        .upsert(halfTerm, { onConflict: 'id,sheet_name' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Failed to update half term in Supabase:', error);
      throw error;
    }
  }
};

// Export/Import all data
export const dataApi = {
  exportAll: async () => {
    try {
      // Get all data from all tables
      const [activities, lessons, lessonPlans, eyfsStatements, yearGroups, units, halfTerms] = await Promise.all([
        supabase.from(TABLES.ACTIVITIES).select('*'),
        supabase.from(TABLES.LESSONS).select('*'),
        supabase.from(TABLES.LESSON_PLANS).select('*'),
        supabase.from(TABLES.EYFS_STATEMENTS).select('*'),
        supabase.from(TABLES.YEAR_GROUPS).select('*'),
        supabase.from(TABLES.UNITS).select('*'),
        supabase.from(TABLES.HALF_TERMS).select('*')
      ]);
      
      if (activities.error) throw activities.error;
      if (lessons.error) throw lessons.error;
      if (lessonPlans.error) throw lessonPlans.error;
      if (eyfsStatements.error) throw eyfsStatements.error;
      if (yearGroups.error) throw yearGroups.error;
      if (units.error) throw units.error;
      if (halfTerms.error) throw halfTerms.error;
      
      return {
        activities: activities.data || [],
        lessons: lessons.data || [],
        lessonPlans: lessonPlans.data || [],
        eyfsStatements: eyfsStatements.data || [],
        yearGroups: yearGroups.data || [],
        units: units.data || [],
        halfTerms: halfTerms.data || []
      };
    } catch (error) {
      console.warn('Failed to export data from Supabase:', error);
      throw error;
    }
  },
  
  importAll: async (data: any) => {
    try {
      // Start a transaction to import all data
      const promises = [];
      
      if (data.activities && data.activities.length > 0) {
        // Clean activities data (remove uniqueId and convert to snake_case)
        const cleanedActivities = data.activities.map(({ uniqueId, ...activity }: any) => ({
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
        }));
        promises.push(
          supabase
            .from(TABLES.ACTIVITIES)
            .upsert(cleanedActivities, { 
              onConflict: 'activity,category,lesson_number',
              ignoreDuplicates: false 
            })
        );
      }
      
      if (data.lessons) {
        const lessonsData = Object.entries(data.lessons).map(([sheet, sheetData]: [string, any]) => ({
          sheet_name: sheet,
          data: sheetData.allLessonsData || {},
          lesson_numbers: sheetData.lessonNumbers || [],
          teaching_units: sheetData.teachingUnits || [],
          eyfs_statements_map: sheetData.eyfsStatements || {}
        }));
        
        promises.push(
          supabase
            .from(TABLES.LESSONS)
            .upsert(lessonsData, { onConflict: 'sheet_name' })
        );
      }
      
      if (data.lessonPlans && data.lessonPlans.length > 0) {
        // Convert lesson plans to snake_case
        const lessonPlansData = data.lessonPlans.map((plan: any) => ({
          id: plan.id,
          date: new Date(plan.date).toISOString(),
          week: plan.week,
          class_name: plan.className,
          activities: plan.activities,
          duration: plan.duration,
          notes: plan.notes,
          status: plan.status,
          unit_id: plan.unitId,
          unit_name: plan.unitName,
          lesson_number: plan.lessonNumber,
          title: plan.title,
          term: plan.term,
          time: plan.time
        }));
        
        promises.push(
          supabase
            .from(TABLES.LESSON_PLANS)
            .upsert(lessonPlansData, { onConflict: 'id' })
        );
      }
      
      if (data.eyfs) {
        const eyfsData = Object.entries(data.eyfs).map(([sheet, sheetData]: [string, any]) => ({
          sheet_name: sheet,
          all_statements: sheetData.allStatements || [],
          structured_statements: sheetData.structuredStatements || {}
        }));
        
        promises.push(
          supabase
            .from(TABLES.EYFS_STATEMENTS)
            .upsert(eyfsData, { onConflict: 'sheet_name' })
        );
      }
      
      if (data.yearGroups && data.yearGroups.length > 0) {
        promises.push(
          supabase
            .from(TABLES.YEAR_GROUPS)
            .upsert(data.yearGroups, { onConflict: 'id' })
        );
      }
      
      if (data.units && data.units.length > 0) {
        promises.push(
          supabase
            .from(TABLES.UNITS)
            .upsert(data.units, { onConflict: 'id' })
        );
      }
      
      if (data.halfTerms && data.halfTerms.length > 0) {
        promises.push(
          supabase
            .from(TABLES.HALF_TERMS)
            .upsert(data.halfTerms, { onConflict: 'id,sheet_name' })
        );
      }
      
      // Execute all promises
      await Promise.all(promises);
      
      return { success: true };
    } catch (error) {
      console.warn('Failed to import data to Supabase:', error);
      throw error;
    }
  }
};

// WordPress API Configuration
const WORDPRESS_CONFIG = {
  BASE_URL: import.meta.env.VITE_WORDPRESS_URL || 'https://your-wordpress-site.com',
  API_ENDPOINT: '/wp-json/wp/v2',
  AUTH_ENDPOINT: '/wp-json/jwt-auth/v1/token',
  VALIDATE_ENDPOINT: '/wp-json/jwt-auth/v1/token/validate',
};

// WordPress API helper
export const wordpressAPI = {
  async authenticate(username: string, password: string) {
    const baseUrl = WORDPRESS_CONFIG.BASE_URL;
    
    if (!baseUrl || baseUrl === 'https://your-wordpress-site.com') {
      throw new Error('WordPress URL not configured');
    }
    
    const response = await fetch(`${baseUrl}${WORDPRESS_CONFIG.AUTH_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Authentication failed');
    }
    
    return response.json();
  },
  
  async validateToken(token: string) {
    try {
      const baseUrl = WORDPRESS_CONFIG.BASE_URL;
      
      if (!baseUrl || baseUrl === 'https://your-wordpress-site.com') {
        return false;
      }
      
      const response = await fetch(`${baseUrl}${WORDPRESS_CONFIG.VALIDATE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },
  
  async getUserInfo(token: string) {
    const baseUrl = WORDPRESS_CONFIG.BASE_URL;
    
    if (!baseUrl || baseUrl === 'https://your-wordpress-site.com') {
      throw new Error('WordPress URL not configured');
    }
    
    const response = await fetch(`${baseUrl}${WORDPRESS_CONFIG.API_ENDPOINT}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    return response.json();
  }
};

// API endpoints for categories management
export const categoriesApi = {
  // Get all subjects with their categories
  getSubjects: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SUBJECTS)
        .select(`
          id,
          name,
          description,
          color,
          is_active,
          created_at,
          updated_at,
          subject_categories (
            id,
            name,
            description,
            color,
            is_locked,
            is_active,
            sort_order,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to match the frontend structure
      return (data || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        color: subject.color,
        isActive: subject.is_active,
        categories: (subject.subject_categories || [])
          .filter(cat => cat.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: cat.color,
            position: cat.sort_order,
            isActive: cat.is_active,
            isLocked: cat.is_locked
          }))
      }));
    } catch (error) {
      console.warn('Failed to get subjects from Supabase:', error);
      throw error;
    }
  },

  // Add a new category to a subject
  addCategory: async (subjectId: string, category: { name: string; color: string; description?: string }) => {
    try {
      // Get the current max sort_order for this subject
      const { data: maxOrderData, error: maxOrderError } = await supabase
        .from(TABLES.SUBJECT_CATEGORIES)
        .select('sort_order')
        .eq('subject_id', subjectId)
        .order('sort_order', { ascending: false })
        .limit(1);
      
      if (maxOrderError) throw maxOrderError;
      
      const nextSortOrder = maxOrderData && maxOrderData.length > 0 
        ? (maxOrderData[0].sort_order + 1) 
        : 0;

      const { data, error } = await supabase
        .from(TABLES.SUBJECT_CATEGORIES)
        .insert({
          subject_id: subjectId,
          name: category.name,
          description: category.description || '',
          color: category.color,
          sort_order: nextSortOrder,
          is_active: true,
          is_locked: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        position: data.sort_order,
        isActive: data.is_active,
        isLocked: data.is_locked
      };
    } catch (error) {
      console.warn('Failed to add category to Supabase:', error);
      throw error;
    }
  },

  // Update a category
  updateCategory: async (categoryId: string, updates: { name?: string; color?: string; description?: string; position?: number }) => {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.position !== undefined) updateData.sort_order = updates.position;
      
      const { data, error } = await supabase
        .from(TABLES.SUBJECT_CATEGORIES)
        .update(updateData)
        .eq('id', categoryId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        position: data.sort_order,
        isActive: data.is_active,
        isLocked: data.is_locked
      };
    } catch (error) {
      console.warn('Failed to update category in Supabase:', error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('subject_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.warn('Failed to delete category from Supabase:', error);
      throw error;
    }
  },

  // Reorder categories
  reorderCategories: async (categoryUpdates: { id: string; position: number }[]) => {
    try {
      const updates = categoryUpdates.map(({ id, position }) => 
        supabase
          .from('subject_categories')
          .update({ sort_order: position })
          .eq('id', id)
      );
      
      const results = await Promise.all(updates);
      
      // Check for any errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to reorder categories: ${errors[0].error?.message}`);
      }
      
      return true;
    } catch (error) {
      console.warn('Failed to reorder categories in Supabase:', error);
      throw error;
    }
  }
};

// API endpoints for class management
export const classesApi = {
  // Get all classes with their assigned categories
  getClasses: async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          display_name,
          description,
          color,
          is_active,
          created_at,
          updated_at,
          class_categories (
            id,
            is_active,
            category_id,
            subject_categories (
              id,
              name,
              color,
              sort_order
            )
          )
        `)
        .eq('is_active', true)
        .order('display_name');
      
      if (error) throw error;
      
      // Transform the data to match the frontend structure
      return (data || []).map(cls => ({
        id: cls.id,
        name: cls.name,
        displayName: cls.display_name,
        description: cls.description,
        color: cls.color,
        isActive: cls.is_active,
        categories: (cls.class_categories || [])
          .filter(cc => cc.is_active)
          .map(cc => ({
            id: cc.category_id,
            name: cc.subject_categories.name,
            color: cc.subject_categories.color,
            sortOrder: cc.subject_categories.sort_order
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder)
      }));
    } catch (error) {
      console.warn('Failed to get classes from Supabase:', error);
      throw error;
    }
  },

  // Create a new class
  createClass: async (classData: { name: string; displayName: string; description?: string; color?: string; categoryIds?: string[]; customAssessmentStatements?: string[]; classSpecificCategories?: Array<{name: string, color: string, description?: string}> }) => {
    try {
      const { data: classResult, error: classError } = await supabase
        .from('classes')
        .insert({
          name: classData.name,
          display_name: classData.displayName,
          description: classData.description || '',
          color: classData.color || '#6b7280',
          is_active: true,
          custom_assessment_statements: classData.customAssessmentStatements || [],
          class_specific_categories: classData.classSpecificCategories || []
        })
        .select()
        .single();
      
      if (classError) throw classError;

      // Assign categories to the class
      if (classData.categoryIds && classData.categoryIds.length > 0) {
        const categoryAssignments = classData.categoryIds.map(categoryId => ({
          class_id: classResult.id,
          category_id: categoryId,
          is_active: true
        }));

        const { error: categoryError } = await supabase
          .from('class_categories')
          .insert(categoryAssignments);
        
        if (categoryError) throw categoryError;
      }

      return classResult;
    } catch (error) {
      console.warn('Failed to create class in Supabase:', error);
      throw error;
    }
  },

  // Update a class
  updateClass: async (classId: string, updates: { name?: string; displayName?: string; description?: string; color?: string; categoryIds?: string[]; customAssessmentStatements?: string[]; classSpecificCategories?: Array<{name: string, color: string, description?: string}> }) => {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.customAssessmentStatements !== undefined) updateData.custom_assessment_statements = updates.customAssessmentStatements;
      if (updates.classSpecificCategories !== undefined) updateData.class_specific_categories = updates.classSpecificCategories;
      
      const { data, error } = await supabase
        .from('classes')
        .update(updateData)
        .eq('id', classId)
        .select()
        .single();
      
      if (error) throw error;

      // Update category assignments if provided
      if (updates.categoryIds !== undefined) {
        // Remove existing assignments
        await supabase
          .from('class_categories')
          .delete()
          .eq('class_id', classId);

        // Add new assignments
        if (updates.categoryIds.length > 0) {
          const categoryAssignments = updates.categoryIds.map(categoryId => ({
            class_id: classId,
            category_id: categoryId,
            is_active: true
          }));

          await supabase
            .from('class_categories')
            .insert(categoryAssignments);
        }
      }

      return data;
    } catch (error) {
      console.warn('Failed to update class in Supabase:', error);
      throw error;
    }
  },

  // Delete a class
  deleteClass: async (classId: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.warn('Failed to delete class from Supabase:', error);
      throw error;
    }
  },

  // Assign user to class
  assignUserToClass: async (userId: string, classId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_classes')
        .insert({
          user_id: userId,
          class_id: classId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Failed to assign user to class:', error);
      throw error;
    }
  },

  // Get user's assigned classes
  getUserClasses: async (userId: string) => {
    try {
      // First get the user class assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('user_classes')
        .select('id, class_id')
        .eq('user_id', userId);
      
      if (assignmentsError) throw assignmentsError;
      
      if (!assignments || assignments.length === 0) {
        return [];
      }
      
      // Then get the class details for each assignment
      const classIds = assignments.map(a => a.class_id);
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('id, name, display_name, description, color, is_active')
        .in('id', classIds)
        .eq('is_active', true);
      
      if (classesError) throw classesError;
      
      // Combine the data
      return assignments.map(assignment => {
        const classData = classes?.find(c => c.id === assignment.class_id);
        if (!classData) return null;
        
        return {
          id: assignment.id,
          class: {
            id: classData.id,
            name: classData.name,
            displayName: classData.display_name,
            description: classData.description,
            color: classData.color,
            isActive: classData.is_active
          }
        };
      }).filter(Boolean);
    } catch (error) {
      console.warn('Failed to get user classes:', error);
      throw error;
    }
  },

  // Get available categories for assignment
  getAvailableCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('subject_categories')
        .select(`
          id,
          name,
          color,
          sort_order,
          subjects (
            id,
            name
          )
        `)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        color: category.color,
        sortOrder: category.sort_order,
        subject: {
          id: category.subjects.id,
          name: category.subjects.name
        }
      }));
    } catch (error) {
      console.warn('Failed to get available categories:', error);
      throw error;
    }
  }
};