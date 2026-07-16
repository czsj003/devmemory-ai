import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import type { MemorySearchResponse, MemorySearchResult } from "../types/memory";
import type { Project } from "../types/project";

const SOURCE_TYPES = ["DOCUMENT", "DAILY_NOTE", "BUG", "DECISION"];

const exampleQueries = [
  "What is this project about?",
  "What did I build on Day 7?",
  "What bugs have I fixed?",
  "Why did I choose PostgreSQL and pgvector?",
  "How should I explain this project in an interview?",
];

export default function SearchPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [query, setQuery] = useState("What is this project about?");
  const [topK, setTopK] = useState(5);
  const [sourceType, setSourceType] = useState("");
  const [results, setResults] = useState<MemorySearchResult[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [lastSourceType, setLastSourceType] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return;

      try {
        const response = await apiClient.get<Project>(`/api/projects/${projectId}`);
        setProject(response.data);
      } catch {
        setError("Could not load project.");
      } finally {
        setIsLoadingProject(false);
      }
    }

    loadProject();
  }, [projectId]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectId) return;

    setError("");
    setIsSearching(true);

    try {
      const response = await apiClient.post<MemorySearchResponse>(
        `/api/projects/${projectId}/memory/search`,
        {
          query,
          top_k: topK,
          source_type: sourceType || null,
        },
      );

      setResults(response.data.results);
      setLastQuery(response.data.query);
      setLastSourceType(response.data.source_type ?? "");
    } catch {
      setError("Could not search project memory. Re-index memory first, then try again.");
    } finally {
      setIsSearching(false);
    }
  }

  function getShortContent(content: string) {
    if (content.length <= 900) {
      return content;
    }

    return `${content.slice(0, 900)}...`;
  }

  return (
    <div>
      <Link className="text-sm text-slate-600 underline" to={`/projects/${projectId}`}>
        Back to Project
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold">Unified Memory Search</h1>
        <p className="mt-2 text-slate-600">
          {isLoadingProject
            ? "Loading project..."
            : project
              ? `Search documents, notes, bugs, and decisions inside ${project.name}.`
              : "Search indexed project memory."}
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <p className="font-medium">Unified memory enabled</p>
        <p className="mt-1">
          Search now uses the Day 12 memory index, so results can come from
          documents, daily notes, bug records, and architecture decisions.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <aside className="h-fit rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Search Project Memory</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search across the unified index for this project.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSearch}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Query</span>
              <textarea
                className="mt-1 min-h-32 w-full rounded-lg border px-4 py-2"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about this project's memory..."
                required
                value={query}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Source Type</span>
              <select
                className="mt-1 w-full rounded-lg border px-4 py-2"
                onChange={(event) => setSourceType(event.target.value)}
                value={sourceType}
              >
                <option value="">All source types</option>
                {SOURCE_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Top K</span>
              <select
                className="mt-1 w-full rounded-lg border px-4 py-2"
                onChange={(event) => setTopK(Number(event.target.value))}
                value={topK}
              >
                {[3, 5, 10, 15, 20].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="w-full rounded-lg bg-slate-900 py-2 text-white disabled:opacity-60"
              disabled={isSearching}
              type="submit"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-semibold">Example queries</h3>

            <div className="mt-3 space-y-2">
              {exampleQueries.map((example) => (
                <button
                  className="block w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-slate-50"
                  key={example}
                  onClick={() => setQuery(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Results</h2>

            {lastQuery && (
              <p className="mt-1 text-sm text-slate-500">
                Showing results for: <span className="font-medium">{lastQuery}</span>
                {lastSourceType ? ` in ${lastSourceType}` : ""}
              </p>
            )}

            {!lastQuery ? (
              <p className="mt-6 text-slate-500">
                Run a search to see relevant memory chunks.
              </p>
            ) : results.length === 0 ? (
              <p className="mt-6 text-slate-500">
                No results found. Add project memory and run Re-index Memory first.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {results.map((result, index) => (
                  <div className="rounded-lg border p-5" key={result.chunk_id}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Result {index + 1}</p>
                        <h3 className="mt-1 text-lg font-semibold">
                          {result.source_title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          {result.source_type}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          Chunk {result.chunk_index}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      Distance: {result.distance.toFixed(4)}
                    </p>

                    <div className="mt-4 rounded-lg bg-slate-50 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {getShortContent(result.content)}
                      </p>
                    </div>

                    <SourceLink projectId={projectId ?? ""} result={result} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SourceLink({
  projectId,
  result,
}: {
  projectId: string;
  result: MemorySearchResult;
}) {
  let to = `/projects/${projectId}`;

  if (result.source_type === "DOCUMENT") {
    to = `/projects/${projectId}/documents/${result.source_id}`;
  }

  if (result.source_type === "DAILY_NOTE") {
    to = `/projects/${projectId}/notes/${result.source_id}`;
  }

  if (result.source_type === "BUG") {
    to = `/projects/${projectId}/bugs/${result.source_id}`;
  }

  if (result.source_type === "DECISION") {
    to = `/projects/${projectId}/decisions/${result.source_id}`;
  }

  return (
    <Link className="mt-4 inline-block text-sm text-slate-700 underline" to={to}>
      Open source
    </Link>
  );
}
