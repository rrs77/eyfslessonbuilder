import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wiudrzdkbpyziaodqoog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdWRyemRrYnB5emlhb2Rxb29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MzgxNzcsImV4cCI6MjA2NjUxNDE3N30.LpD82hY_1wYzroA09nYfaz13iNx5gRJzmPTt0gPCLMI';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Database table names
export const TABLES = {
  ACTIVITIES: 'activities',
  LESSONS: 'lessons',
  LESSON_PLANS: 'lesson_plans',
  EYFS_STATEMENTS: 'eyfs_statements',
  YEAR_GROUPS: 'year_groups',
  UNITS: 'units',
  HALF_TERMS: 'half_terms',
  SUBJECTS: 'subjects',
  SUBJECT_CATEGORIES: 'subject_categories',
  CLASSES: 'classes',
  CLASS_CATEGORIES: 'class_categories',
  USER_CLASSES: 'user_classes'
};

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};