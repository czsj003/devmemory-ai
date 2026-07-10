import type { AISummary } from "./aiSummary";
import type { Bug } from "./bug";
import type { DailyNote } from "./dailyNote";
import type { Decision } from "./decision";
import type { ProjectDocument } from "./document";
import type { Project } from "./project";

export interface ProjectOverviewCounts {
  documents_count: number;
  notes_count: number;
  bugs_count: number;
  open_bugs_count: number;
  decisions_count: number;
  summaries_count: number;
}

export interface ProjectMemoryCoverage {
  has_documents: boolean;
  has_notes: boolean;
  has_bugs: boolean;
  has_decisions: boolean;
  has_ai_summary: boolean;
}

export interface ProjectOverview {
  project: Project;
  counts: ProjectOverviewCounts;
  coverage: ProjectMemoryCoverage;
  latest_documents: ProjectDocument[];
  latest_notes: DailyNote[];
  latest_bugs: Bug[];
  latest_decisions: Decision[];
  latest_summary: AISummary | null;
  generated_at: string;
}
