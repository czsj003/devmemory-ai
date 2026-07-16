import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { ChatMessage, ChatResponse, ChatSource } from "../types/chat";
import type { Project } from "../types/project";

export default function ChatPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [topK, setTopK] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadChat() {
      if (!projectId) return;

      try {
        const [projectResponse, messagesResponse] = await Promise.all([
          apiClient.get<Project>(`/api/projects/${projectId}`),
          apiClient.get<ChatMessage[]>(`/api/projects/${projectId}/chat/messages`),
        ]);

        setProject(projectResponse.data);
        setMessages(messagesResponse.data);
      } catch {
        setError("Could not load chat history.");
      } finally {
        setIsLoading(false);
      }
    }

    loadChat();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId || !message.trim()) return;

    setError("");
    setIsSending(true);

    try {
      const response = await apiClient.post<ChatResponse>(
        `/api/projects/${projectId}/chat`,
        {
          message: message.trim(),
          top_k: topK,
        },
      );

      setMessages(response.data.messages);
      setMessage("");
    } catch {
      setError(
        "Could not generate AI response. Re-index unified memory and check OpenAI API configuration.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col">
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="mt-2 text-slate-600">
            {isLoading
              ? "Loading project chat..."
              : project
                ? `Ask source-backed questions about ${project.name}.`
                : "Ask source-backed questions about this project."}
          </p>
        </div>

        <label className="w-full max-w-40">
          <span className="text-sm font-medium text-slate-700">Sources</span>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            onChange={(event) => setTopK(Number(event.target.value))}
            value={topK}
          >
            {[3, 5, 8, 10].map((value) => (
              <option key={value} value={value}>
                Top {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <p className="font-medium">Source-backed project AI</p>
        <p className="mt-1">
          AI Chat searches unified project memory first, then generates an
          answer with OpenAI. Each response includes sources from documents,
          notes, bugs, or architecture decisions.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-6 flex min-h-0 flex-1 flex-col rounded-lg bg-white shadow">
        <div className="min-h-96 flex-1 space-y-5 overflow-y-auto p-5">
          {isLoading ? (
            <p className="text-slate-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <EmptyState setMessage={setMessage} />
          ) : (
            messages.map((chatMessage) => (
              <MessageBubble
                key={chatMessage.id}
                message={chatMessage}
                projectId={projectId ?? ""}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="border-t bg-slate-50 p-4"
          onSubmit={handleSend}
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            <textarea
              className="min-h-24 flex-1 rounded-lg border px-4 py-3"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about this project's indexed memory..."
              required
              value={message}
            />

            <button
              className="rounded-lg bg-slate-900 px-8 py-3 font-medium text-white disabled:opacity-60 lg:self-end"
              disabled={isSending}
              type="submit"
            >
              {isSending ? "Generating AI response..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function EmptyState({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <h2 className="text-lg font-semibold">No messages yet</h2>
      <p className="mt-2 text-slate-500">
        Start by asking a question about this project's indexed memory.
      </p>

      <button
        className="mt-4 rounded-lg border px-4 py-2"
        onClick={() => setMessage("What is this project about?")}
        type="button"
      >
        Try an example
      </button>

      <div className="mx-auto mt-4 grid max-w-xl gap-2 text-left md:grid-cols-2">
        {[
          "What is this project about?",
          "What did I build on Day 7?",
          "What bugs have I fixed?",
          "Why did I choose PostgreSQL and pgvector?",
          "What are the most important architecture decisions?",
          "How should I explain this project in an interview?",
        ].map((example) => (
          <button
            className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-slate-50"
            key={example}
            onClick={() => setMessage(example)}
            type="button"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  projectId,
}: {
  message: ChatMessage;
  projectId: string;
}) {
  const isUser = message.role === "USER";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-lg px-5 py-4 ${
          isUser ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap leading-7">{message.content}</p>

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesList sources={message.sources} projectId={projectId} />
        )}

        <p className={`mt-3 text-xs ${isUser ? "text-slate-300" : "text-slate-500"}`}>
          {new Date(message.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function SourcesList({
  sources,
  projectId,
}: {
  sources: ChatSource[];
  projectId: string;
}) {
  return (
    <div className="mt-5 border-t border-slate-300 pt-4">
      <p className="text-sm font-semibold">Sources</p>

      <div className="mt-3 space-y-3">
        {sources.map((source, index) => (
          <div
            className="rounded-lg border bg-white p-3"
            key={`${source.chunk_id}-${index}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{getSourceTitle(source)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {getSourceType(source)} - Chunk {source.chunk_index} - Distance{" "}
                  {source.distance.toFixed(4)}
                </p>
              </div>

              <Link
                className="shrink-0 text-xs text-slate-600 underline"
                to={getSourceLink(projectId, source)}
              >
                Open
              </Link>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-600">
              {source.content.length > 360
                ? `${source.content.slice(0, 360)}...`
                : source.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSourceTitle(source: ChatSource) {
  return source.source_title ?? source.document_title ?? "Unknown source";
}

function getSourceType(source: ChatSource) {
  return source.source_type ?? source.document_type ?? "DOCUMENT";
}

function getSourceId(source: ChatSource) {
  return source.source_id ?? source.document_id;
}

function getSourceLink(projectId: string, source: ChatSource) {
  const sourceType = getSourceType(source);
  const sourceId = getSourceId(source);

  if (!sourceId) {
    return `/projects/${projectId}`;
  }

  if (sourceType === "DOCUMENT") {
    return `/projects/${projectId}/documents/${sourceId}`;
  }

  if (sourceType === "DAILY_NOTE") {
    return `/projects/${projectId}/notes/${sourceId}`;
  }

  if (sourceType === "BUG") {
    return `/projects/${projectId}/bugs/${sourceId}`;
  }

  if (sourceType === "DECISION") {
    return `/projects/${projectId}/decisions/${sourceId}`;
  }

  return `/projects/${projectId}`;
}
