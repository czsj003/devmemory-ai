import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type {
  MemoryChunk,
  MemoryReindexResponse,
  MemoryStats,
} from "../types/memory";
import type { Project } from "../types/project";

const SOURCE_TYPES = ["DOCUMENT", "DAILY_NOTE", "BUG", "DECISION"];

export default function MemoryPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [chunks, setChunks] = useState<MemoryChunk[]>([]);
  const [sourceType, setSourceType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReindexing, setIsReindexing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMemoryData(selectedSourceType = sourceType) {
    if (!projectId) return;

    setError("");
    setIsLoading(true);

    try {
      const chunksUrl = selectedSourceType
        ? `/api/projects/${projectId}/memory/chunks?source_type=${selectedSourceType}`
        : `/api/projects/${projectId}/memory/chunks`;

      const [projectResponse, statsResponse, chunksResponse] = await Promise.all([
        apiClient.get<Project>(`/api/projects/${projectId}`),
        apiClient.get<MemoryStats>(`/api/projects/${projectId}/memory/stats`),
        apiClient.get<MemoryChunk[]>(chunksUrl),
      ]);

      setProject(projectResponse.data);
      setStats(statsResponse.data);
      setChunks(chunksResponse.data);
    } catch {
      setError("Could not load unified memory index.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMemoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleSourceTypeChange(value: string) {
    setSourceType(value);
    await loadMemoryData(value);
  }

  async function handleReindexMemory() {
    if (!projectId) return;

    setError("");
    setMessage("");
    setIsReindexing(true);

    try {
      const response = await apiClient.post<MemoryReindexResponse>(
        `/api/projects/${projectId}/memory/reindex`,
      );

      setMessage(
        `Re-indexed ${response.data.chunks_created} chunks from ${response.data.documents_indexed} documents, ${response.data.notes_indexed} notes, ${response.data.bugs_indexed} bugs, and ${response.data.decisions_indexed} decisions.`,
      );

      await loadMemoryData(sourceType);
    } catch {
      setError("Could not re-index memory. Check the backend, database, and OpenAI API configuration.");
    } finally {
      setIsReindexing(false);
    }
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unified Memory Index</h1>
          <p className="mt-2 text-slate-600">
            {project
              ? `Index documents, notes, bugs, and decisions inside ${project.name}.`
              : "Index documents, notes, bugs, and decisions into one memory layer."}
          </p>
        </div>

        <button
          className="rounded-lg bg-slate-900 px-5 py-3 text-white disabled:opacity-60"
          disabled={isReindexing}
          onClick={handleReindexMemory}
          type="button"
        >
          {isReindexing ? "Re-indexing..." : "Re-index Memory"}
        </button>
      </div>

      {message && (
        <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Chunks" value={stats?.total_chunks ?? "..."} />
        <StatCard label="Documents" value={stats?.document_chunks ?? "..."} />
        <StatCard label="Notes" value={stats?.daily_note_chunks ?? "..."} />
        <StatCard label="Bugs" value={stats?.bug_chunks ?? "..."} />
        <StatCard label="Decisions" value={stats?.decision_chunks ?? "..."} />
      </section>

      <section className="mt-8 rounded-lg bg-white p-5 shadow">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Source Type</span>
            <select
              className="rounded-lg border px-4 py-2"
              onChange={(event) => handleSourceTypeChange(event.target.value)}
              value={sourceType}
            >
              <option value="">All source types</option>
              {SOURCE_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button
            className="rounded-lg border px-4 py-2"
            onClick={() => handleSourceTypeChange("")}
            type="button"
          >
            Clear Filter
          </button>
        </div>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-slate-500">Loading memory chunks...</p>
          </div>
        ) : chunks.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-slate-500">
              No memory chunks yet. Click Re-index Memory to build the unified index.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {chunks.map((chunk) => (
              <MemoryChunkCard chunk={chunk} key={chunk.id} projectId={projectId || ""} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MemoryChunkCard({
  chunk,
  projectId,
}: {
  chunk: MemoryChunk;
  projectId: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{chunk.source_title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {chunk.source_type} - Source ID {chunk.source_id} - Chunk {chunk.chunk_index}
          </p>
        </div>

        <SourceLink chunk={chunk} projectId={projectId} />
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {chunk.content.length > 900 ? `${chunk.content.slice(0, 900)}...` : chunk.content}
      </p>

      <p className="mt-4 text-xs text-slate-400">
        Created {new Date(chunk.created_at).toLocaleString()}
      </p>
    </div>
  );
}

function SourceLink({
  chunk,
  projectId,
}: {
  chunk: MemoryChunk;
  projectId: string;
}) {
  let to = `/projects/${projectId}`;

  if (chunk.source_type === "DOCUMENT") {
    to = `/projects/${projectId}/documents/${chunk.source_id}`;
  }

  if (chunk.source_type === "DAILY_NOTE") {
    to = `/projects/${projectId}/notes/${chunk.source_id}`;
  }

  if (chunk.source_type === "BUG") {
    to = `/projects/${projectId}/bugs/${chunk.source_id}`;
  }

  if (chunk.source_type === "DECISION") {
    to = `/projects/${projectId}/decisions/${chunk.source_id}`;
  }

  return (
    <Link className="text-sm text-slate-600 underline" to={to}>
      Open Source
    </Link>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
