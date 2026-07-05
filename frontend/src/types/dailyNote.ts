export interface DailyNote {
  id: number;
  project_id: number;
  title: string;
  note_date?: string | null;
  content: string;
  completed_tasks?: string | null;
  blockers?: string | null;
  next_steps?: string | null;
  ai_summary?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyNoteCreatePayload {
  title: string;
  note_date?: string | null;
  content: string;
  completed_tasks?: string | null;
  blockers?: string | null;
  next_steps?: string | null;
  ai_summary?: string | null;
}

export interface DailyNoteUpdatePayload {
  title?: string;
  note_date?: string | null;
  content?: string;
  completed_tasks?: string | null;
  blockers?: string | null;
  next_steps?: string | null;
  ai_summary?: string | null;
}
