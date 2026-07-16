export interface InterviewPrep {
  id: number;
  project_id: number;
  type: string;
  project_pitch?: string | null;
  technical_explanation?: string | null;
  resume_bullets?: string | null;
  debugging_story?: string | null;
  architecture_explanation?: string | null;
  star_answer?: string | null;
  created_at: string;
}

export interface InterviewPrepGenerateResponse {
  prep: InterviewPrep;
}
