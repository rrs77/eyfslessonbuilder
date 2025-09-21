import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid environment variables
export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const TABLES = {
  ACTIVITIES: 'activities',
  LESSONS: 'lessons',
  LESSON_PLANS: 'user_lesson_plans',
  EYFS_STATEMENTS: 'eyfs_statements',
  YEAR_GROUPS: 'year_groups',
  UNITS: 'units',
  HALF_TERMS: 'half_terms',
  SUBJECTS: 'subjects',
  SUBJECT_CATEGORIES: 'subject_categories'
}

export const isSupabaseConfigured = () => {
  return supabase !== null && 
         supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co') &&
         supabaseAnonKey.length > 50
}