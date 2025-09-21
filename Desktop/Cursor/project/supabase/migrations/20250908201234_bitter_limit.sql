/*
  # Create missing tables for curriculum designer

  1. New Tables
    - `subjects` - Different curriculum subjects (Music, Drama, etc.)
    - `subject_categories` - Categories within each subject
    - `user_lesson_plans` - User-created lesson plans

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  color text NOT NULL DEFAULT '#6b7280',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subject_categories table
CREATE TABLE IF NOT EXISTS subject_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  color text NOT NULL DEFAULT '#6b7280',
  is_locked boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(subject_id, name)
);

-- Create user_lesson_plans table (for lesson builder)
CREATE TABLE IF NOT EXISTS user_lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  lesson_number text,
  class_name text NOT NULL,
  activities jsonb DEFAULT '[]',
  duration integer DEFAULT 0,
  notes text DEFAULT '',
  status text DEFAULT 'draft',
  term text,
  week integer,
  date timestamptz,
  unit_id uuid,
  unit_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage subject_categories"
  ON subject_categories
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage user_lesson_plans"
  ON user_lesson_plans
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default subject (Music)
INSERT INTO subjects (name, description, color, is_active)
VALUES ('Music', 'Music curriculum activities and lessons', '#8b5cf6', true)
ON CONFLICT (name) DO NOTHING;

-- Get the music subject ID for inserting categories
DO $$
DECLARE
  music_subject_id uuid;
BEGIN
  SELECT id INTO music_subject_id FROM subjects WHERE name = 'Music';
  
  IF music_subject_id IS NOT NULL THEN
    -- Insert default categories for Music subject
    INSERT INTO subject_categories (subject_id, name, color, sort_order, is_active)
    VALUES
      (music_subject_id, 'Welcome', '#F59E0B', 0, true),
      (music_subject_id, 'Kodaly Songs', '#8B5CF6', 1, true),
      (music_subject_id, 'Action/Games Songs', '#F97316', 2, true),
      (music_subject_id, 'Rhythm Sticks', '#D97706', 3, true),
      (music_subject_id, 'Scarf Songs', '#10B981', 4, true),
      (music_subject_id, 'General Game', '#3B82F6', 5, true),
      (music_subject_id, 'Core Songs', '#84CC16', 6, true),
      (music_subject_id, 'Parachute Games', '#EF4444', 7, true),
      (music_subject_id, 'Percussion Games', '#06B6D4', 8, true),
      (music_subject_id, 'Teaching Units', '#6366F1', 9, true),
      (music_subject_id, 'Goodbye', '#14B8A6', 10, true),
      (music_subject_id, 'Drama Activities', '#A855F7', 11, true),
      (music_subject_id, 'Vocal Warm-Ups', '#F472B6', 12, true)
    ON CONFLICT (subject_id, name) DO NOTHING;
  END IF;
END $$;