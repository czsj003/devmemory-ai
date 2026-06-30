export interface ProjectDocument {
  id: number;
  project_id: number;
  title: string;
  type: string;
  content: string;
  source?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreatePayload {
  title: string;
  type: string;
  content: string;
  source?: string | null;
}

export interface DocumentUpdatePayload {
  title?: string;
  type?: string;
  content?: string;
  source?: string | null;
}
