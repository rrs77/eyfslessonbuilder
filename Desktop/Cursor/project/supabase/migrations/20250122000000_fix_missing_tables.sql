/*
  # Fix missing tables and columns

  1. Create missing tables
    - `classes` - Class management
    - `user_lesson_plans` - User-created lesson plans

  2. Fix existing tables
    - Add `sheet_name` column to `units` table

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text DEFAULT '',
  color text NOT NULL DEFAULT '#6b7280',
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_lesson_plans table
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

-- Add sheet_name column to units table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'units' AND column_name = 'sheet_name'
  ) THEN
    ALTER TABLE units ADD COLUMN sheet_name text;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for classes
CREATE POLICY "Authenticated users can view active classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admin users can manage classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'rob.reichstorer@gmail.com' OR auth.users.raw_user_meta_data->>'role' = 'administrator')
    )
  );

-- Create policies for user_lesson_plans
CREATE POLICY "Authenticated users can manage user_lesson_plans"
  ON user_lesson_plans
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default classes
INSERT INTO classes (name, display_name, description, color, is_active)
VALUES 
  ('LKG', 'Lower Kindergarten', 'Lower Kindergarten class', '#10B981', true),
  ('UKG', 'Upper Kindergarten', 'Upper Kindergarten class', '#3B82F6', true),
  ('Reception', 'Reception', 'Reception class', '#8B5CF6', true)
ON CONFLICT (name) DO NOTHING;
