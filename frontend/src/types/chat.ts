export type ChatSource = {
  chunk_id: number;
  source_type?: string;
  source_id?: number;
  source_title?: string;
  document_id?: number;
  document_title?: string;
  document_type?: string;
  content: string;
  chunk_index: number;
  distance: number;
};

export type ChatMessage = {
  id: number;
  session_id: number;
  role: "USER" | "ASSISTANT";
  content: string;
  sources: ChatSource[] | null;
  created_at: string;
};

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
  messages: ChatMessage[];
};
