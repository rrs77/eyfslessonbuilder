/*
  # Create class management system with category selection

  1. New Tables
    - `classes` - Different classes (LKG, UKG, Reception, etc.)
    - `class_categories` - Categories assigned to each class
    - `user_classes` - User class assignments

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage classes
    - Add policies for users to view their assigned classes
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

-- Create class_categories table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS class_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES subject_categories(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, category_id)
);

-- Create user_classes table (user assignments to classes)
CREATE TABLE IF NOT EXISTS user_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  assigned_by uuid,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, class_id)
);

-- Enable RLS on all tables
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_classes ENABLE ROW LEVEL SECURITY;

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

-- Create policies for class_categories
CREATE POLICY "Authenticated users can view class categories"
  ON class_categories
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admin users can manage class categories"
  ON class_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'rob.reichstorer@gmail.com' OR auth.users.raw_user_meta_data->>'role' = 'administrator')
    )
  );

-- Create policies for user_classes
CREATE POLICY "Users can view their own class assignments"
  ON user_classes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin users can manage user class assignments"
  ON user_classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.email = 'rob.reichstorer@gmail.com' OR auth.users.raw_user_meta_data->>'role' = 'administrator')
    )
  );

-- Insert default classes
INSERT INTO classes (name, display_name, description, color, is_active)
VALUES 
  ('LKG', 'Lower Kindergarten', 'Lower Kindergarten class', '#10B981', true),
  ('UKG', 'Upper Kindergarten', 'Upper Kindergarten class', '#3B82F6', true),
  ('Reception', 'Reception', 'Reception class', '#8B5CF6', true)
ON CONFLICT (name) DO NOTHING;

-- Get the music subject ID and class IDs for setting up default category assignments
DO $$
DECLARE
  music_subject_id uuid;
  lkg_class_id uuid;
  ukg_class_id uuid;
  reception_class_id uuid;
BEGIN
  -- Get music subject ID
  SELECT id INTO music_subject_id FROM subjects WHERE name = 'Music';
  
  -- Get class IDs
  SELECT id INTO lkg_class_id FROM classes WHERE name = 'LKG';
  SELECT id INTO ukg_class_id FROM classes WHERE name = 'UKG';
  SELECT id INTO reception_class_id FROM classes WHERE name = 'Reception';
  
  IF music_subject_id IS NOT NULL AND lkg_class_id IS NOT NULL THEN
    -- Assign all categories to LKG by default
    INSERT INTO class_categories (class_id, category_id, is_active)
    SELECT lkg_class_id, sc.id, true
    FROM subject_categories sc
    WHERE sc.subject_id = music_subject_id
    ON CONFLICT (class_id, category_id) DO NOTHING;
  END IF;
  
  IF music_subject_id IS NOT NULL AND ukg_class_id IS NOT NULL THEN
    -- Assign all categories to UKG by default
    INSERT INTO class_categories (class_id, category_id, is_active)
    SELECT ukg_class_id, sc.id, true
    FROM subject_categories sc
    WHERE sc.subject_id = music_subject_id
    ON CONFLICT (class_id, category_id) DO NOTHING;
  END IF;
  
  IF music_subject_id IS NOT NULL AND reception_class_id IS NOT NULL THEN
    -- Assign all categories to Reception by default
    INSERT INTO class_categories (class_id, category_id, is_active)
    SELECT reception_class_id, sc.id, true
    FROM subject_categories sc
    WHERE sc.subject_id = music_subject_id
    ON CONFLICT (class_id, category_id) DO NOTHING;
  END IF;
END $$;









