/*
  # Create year groups, units, and half terms tables

  1. New Tables
    - `year_groups`
      - `id` (text, primary key) - Year group identifier (e.g., 'LKG', 'UKG')
      - `name` (text) - Display name (e.g., 'Lower Kindergarten')
      - `color` (text) - Theme color for the year group
      - `sort_order` (integer) - Display order
    - `units`
      - `id` (uuid, primary key)
      - `name` (text) - Unit name
      - `description` (text) - Unit description
      - `lesson_numbers` (text[]) - Array of lesson numbers in this unit
      - `color` (text) - Unit color
      - `term` (text) - Half-term assignment (A1, A2, SP1, etc.)
      - `sheet_name` (text) - Year group this unit belongs to
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `half_terms`
      - `id` (text) - Half-term identifier (A1, A2, SP1, etc.)
      - `sheet_name` (text) - Year group this half-term belongs to
      - `lessons` (text[]) - Array of lesson numbers assigned to this half-term
      - `is_complete` (boolean) - Whether the half-term is marked as complete

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
    
  3. Initial Data
    - Insert default year groups (LKG, UKG, Reception)
    - Insert default half-terms for each year group
*/

-- Create year_groups table
CREATE TABLE IF NOT EXISTS year_groups (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#6b7280',
  sort_order integer NOT NULL DEFAULT 0
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  lesson_numbers text[] DEFAULT '{}',
  color text NOT NULL DEFAULT '#6b7280',
  term text,
  sheet_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create half_terms table
CREATE TABLE IF NOT EXISTS half_terms (
  id text NOT NULL,
  sheet_name text NOT NULL,
  lessons text[] DEFAULT '{}',
  is_complete boolean DEFAULT false,
  PRIMARY KEY (id, sheet_name)
);

-- Enable RLS on all tables
ALTER TABLE year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE half_terms ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage year_groups"
  ON year_groups
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage units"
  ON units
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage half_terms"
  ON half_terms
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default year groups
INSERT INTO year_groups (id, name, color, sort_order)
VALUES
  ('LKG', 'Lower Kindergarten', '#10B981', 0),
  ('UKG', 'Upper Kindergarten', '#3B82F6', 1),
  ('Reception', 'Reception', '#8B5CF6', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert default half-terms for each year group
INSERT INTO half_terms (id, sheet_name, lessons, is_complete)
VALUES
  ('A1', 'LKG', '{}', false),
  ('A2', 'LKG', '{}', false),
  ('SP1', 'LKG', '{}', false),
  ('SP2', 'LKG', '{}', false),
  ('SM1', 'LKG', '{}', false),
  ('SM2', 'LKG', '{}', false),
  ('A1', 'UKG', '{}', false),
  ('A2', 'UKG', '{}', false),
  ('SP1', 'UKG', '{}', false),
  ('SP2', 'UKG', '{}', false),
  ('SM1', 'UKG', '{}', false),
  ('SM2', 'UKG', '{}', false),
  ('A1', 'Reception', '{}', false),
  ('A2', 'Reception', '{}', false),
  ('SP1', 'Reception', '{}', false),
  ('SP2', 'Reception', '{}', false),
  ('SM1', 'Reception', '{}', false),
  ('SM2', 'Reception', '{}', false)
ON CONFLICT (id, sheet_name) DO NOTHING;