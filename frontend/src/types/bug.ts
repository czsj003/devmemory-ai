export interface Bug {
  id: number;
  project_id: number;
  title: string;
  severity: string;
  status: string;
  tech_stack?: string | null;
  error_message?: string | null;
  logs?: string | null;
  root_cause?: string | null;
  fix_summary?: string | null;
  ai_analysis?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BugCreatePayload {
  title: string;
  severity?: string;
  status?: string;
  tech_stack?: string | null;
  error_message?: string | null;
  logs?: string | null;
  root_cause?: string | null;
  fix_summary?: string | null;
  ai_analysis?: string | null;
}

export interface BugUpdatePayload {
  title?: string;
  severity?: string;
  status?: string;
  tech_stack?: string | null;
  error_message?: string | null;
  logs?: string | null;
  root_cause?: string | null;
  fix_summary?: string | null;
  ai_analysis?: string | null;
}
