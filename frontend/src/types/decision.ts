export interface Decision {
  id: number;
  project_id: number;
  title: string;
  status: string;
  context: string;
  decision: string;
  alternatives?: string | null;
  consequences?: string | null;
  ai_draft?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DecisionCreatePayload {
  title: string;
  status?: string;
  context: string;
  decision: string;
  alternatives?: string | null;
  consequences?: string | null;
  ai_draft?: string | null;
}

export interface DecisionUpdatePayload {
  title?: string;
  status?: string;
  context?: string;
  decision?: string;
  alternatives?: string | null;
  consequences?: string | null;
  ai_draft?: string | null;
}
