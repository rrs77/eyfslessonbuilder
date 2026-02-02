export type LevelId = 
  | 'bronze_star'
  | 'silver_star'
  | 'gold_star'
  | 'white_belt'
  | 'yellow_belt'
  | 'orange_belt'
  | 'blue_belt'
  | 'purple_belt'
  | 'red_belt'
  | 'black_belt';

export type ResourceType = 
  | 'video'
  | 'pdf'
  | 'printable'
  | 'game'
  | 'assessment'
  | 'teacher_script'
  | 'visual_cues'
  | 'pattern_cards';

export type ProgressStatus = 'locked' | 'in_progress' | 'achieved';

export interface Level {
  id: LevelId;
  title: string;
  sort_order: number;
  theme_color: string;
  icon_key: string;
  summary: string;
  goal: string;
  setup_json: {
    bells: number;
    grouping: string;
    notes?: string;
  };
  skills_json: string[];
  pass_criteria_json: string[];
  lesson_sequence_json: Array<{
    lesson: number;
    title: string;
    duration: string;
    outline: string[];
  }>;
  pdf_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Resource {
  id: string;
  level_id: LevelId;
  type: ResourceType;
  title: string;
  description: string;
  url: string;
  tags_json: string[];
  metadata_json: Record<string, any>;
  sort_order: number;
  created_at: Date;
}

export interface UserProgress {
  user_id: string;
  level_id: LevelId;
  status: ProgressStatus;
  achieved_at: Date | null;
  notes: string;
  evidence_json: Record<string, any>;
  updated_at: Date;
}

export interface UserFavourite {
  user_id: string;
  resource_id: string;
  created_at: Date;
}

export interface ResourceWithFavourite extends Resource {
  is_favourite: boolean;
}
