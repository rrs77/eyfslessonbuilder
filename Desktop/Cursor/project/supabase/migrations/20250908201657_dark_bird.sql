/*
  # Fix Drama category order

  1. Changes
    - Update category sort order to put Drama Games before Drama Activities
    - Drama Games: sort_order 11
    - Drama Activities: sort_order 12  
    - Vocal Warm-Ups: sort_order 13

  2. Security
    - No changes to existing RLS policies
*/

-- Update the sort order for drama-related categories
DO $$
DECLARE
  music_subject_id uuid;
BEGIN
  -- Get the music subject ID
  SELECT id INTO music_subject_id FROM subjects WHERE name = 'Music';
  
  IF music_subject_id IS NOT NULL THEN
    -- Update Drama Games to sort_order 11
    UPDATE subject_categories 
    SET sort_order = 11 
    WHERE subject_id = music_subject_id AND name = 'Drama Games';
    
    -- Update Drama Activities to sort_order 12
    UPDATE subject_categories 
    SET sort_order = 12 
    WHERE subject_id = music_subject_id AND name = 'Drama Activities';
    
    -- Update Vocal Warm-Ups to sort_order 13
    UPDATE subject_categories 
    SET sort_order = 13 
    WHERE subject_id = music_subject_id AND name = 'Vocal Warm-Ups';
    
    -- Insert Drama Games if it doesn't exist
    INSERT INTO subject_categories (subject_id, name, color, sort_order, is_active)
    VALUES (music_subject_id, 'Drama Games', '#EC4899', 11, true)
    ON CONFLICT (subject_id, name) DO UPDATE SET 
      sort_order = 11,
      color = '#EC4899';
      
    -- Ensure Drama Activities exists with correct order
    INSERT INTO subject_categories (subject_id, name, color, sort_order, is_active)
    VALUES (music_subject_id, 'Drama Activities', '#A855F7', 12, true)
    ON CONFLICT (subject_id, name) DO UPDATE SET 
      sort_order = 12,
      color = '#A855F7';
      
    -- Ensure Vocal Warm-Ups exists with correct order
    INSERT INTO subject_categories (subject_id, name, color, sort_order, is_active)
    VALUES (music_subject_id, 'Vocal Warm-Ups', '#F472B6', 13, true)
    ON CONFLICT (subject_id, name) DO UPDATE SET 
      sort_order = 13,
      color = '#F472B6';
  END IF;
END $$;