export interface SemanticSearchResult {
  chunk_id: number;
  project_id: number;
  source_type: string;
  source_id: number;
  source_title: string;
  content: string;
  chunk_index: number;
  distance: number;
}

export interface SemanticSearchResponse {
  query: string;
  top_k: number;
  source_type?: string | null;
  results: SemanticSearchResult[];
}

export interface SemanticSearchHealthResponse {
  status: string;
  message: string;
  project_id: number;
  use_fake_embeddings: boolean;
  embedding_model: string;
}
