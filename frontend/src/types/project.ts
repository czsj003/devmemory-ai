export type Project = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  tech_stack: string | null;
  status: string;
  repo_url: string | null;
  live_url: string | null;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectCreate = {
  name: string;
  description?: string | null;
  tech_stack?: string | null;
  status?: string;
  repo_url?: string | null;
  live_url?: string | null;
  start_date?: string | null;
  target_date?: string | null;
};
