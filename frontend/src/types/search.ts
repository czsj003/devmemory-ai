export interface SemanticSearchResult {
  chunk_id: number;
  project_id: number;
  document_id: number;
  document_title: string;
  document_type: string;
  content: string;
  chunk_index: number;
  distance: number;
}

export interface SemanticSearchResponse {
  query: string;
  top_k: number;
  results: SemanticSearchResult[];
}
