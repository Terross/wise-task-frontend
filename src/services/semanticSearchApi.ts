export type SemanticTaskInput = {
  id: string;
  name: string;
  description?: string;
  category?: string;
};

export type SemanticTaskWithScore = SemanticTaskInput & { score: number };

export type SemanticPluginInput = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  graphType?: string;
  pluginType?: string;
};

export type SemanticPluginWithScore = SemanticPluginInput & { score: number };

const SEMANTIC_SEARCH_API_URL =
  import.meta.env.VITE_SEMANTIC_SEARCH_API_URL ?? "http://localhost:8001";

export async function bulkIndexTasks(
  tasks: SemanticTaskInput[],
): Promise<void> {
  if (!tasks.length) {
    return;
  }

  const response = await fetch(`${SEMANTIC_SEARCH_API_URL}/tasks/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to index tasks: ${response.status} ${errorBody}`);
  }
}

export async function searchTasks(
  query: string,
  topK = 3,
): Promise<SemanticTaskWithScore[]> {
  const response = await fetch(`${SEMANTIC_SEARCH_API_URL}/tasks/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to search tasks: ${response.status} ${errorBody}`);
  }

  return (await response.json()) as SemanticTaskWithScore[];
}

export async function bulkIndexPlugins(
  plugins: SemanticPluginInput[],
): Promise<void> {
  if (!plugins.length) {
    return;
  }

  const response = await fetch(`${SEMANTIC_SEARCH_API_URL}/plugins/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plugins }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to index plugins: ${response.status} ${errorBody}`);
  }
}

export async function searchPlugins(
  query: string,
  topK = 3,
): Promise<SemanticPluginWithScore[]> {
  const response = await fetch(`${SEMANTIC_SEARCH_API_URL}/plugins/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to search plugins: ${response.status} ${errorBody}`,
    );
  }

  return (await response.json()) as SemanticPluginWithScore[];
}
