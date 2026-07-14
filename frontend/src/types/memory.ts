export interface MemoryChunk {
  id: number;
  project_id: number;
  source_type: string;
  source_id: number;
  source_title: string;
  content: string;
  chunk_index: number;
  created_at: string;
}

export interface MemoryReindexResponse {
  project_id: number;
  chunks_created: number;
  documents_indexed: number;
  notes_indexed: number;
  bugs_indexed: number;
  decisions_indexed: number;
}

export interface MemoryStats {
  project_id: number;
  total_chunks: number;
  document_chunks: number;
  daily_note_chunks: number;
  bug_chunks: number;
  decision_chunks: number;
}

export interface MemorySearchResult {
  chunk_id: number;
  project_id: number;
  source_type: string;
  source_id: number;
  source_title: string;
  content: string;
  chunk_index: number;
  distance: number;
}

export interface MemorySearchResponse {
  query: string;
  top_k: number;
  source_type: string | null;
  results: MemorySearchResult[];
}
