import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { ConnectedComponent } from "@/features/graph/types/ConnectedComponents";

export const isGraphBipartite = (
  connectedComponent: ConnectedComponent,
): boolean => {
  const edges: CustomEdge[] = connectedComponent.edges;
  const nodes: CustomNode[] = connectedComponent.nodes;
  const adjacency: Record<string, string[]> = {};

  for (const node of nodes) {
    adjacency[node.id] = [];
  }

  for (const edge of edges) {
    const source = edge.source;
    const target = edge.target;
    adjacency[source].push(target);
    adjacency[target].push(source);
  }

  const color: Record<string, number> = {};

  const startNodeId = nodes[0].id;
  const queue: string[] = [startNodeId];
  color[startNodeId] = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentColor = color[current];

    for (const neighbor of adjacency[current]) {
      if (!(neighbor in color)) {
        color[neighbor] = 1 - currentColor;
        queue.push(neighbor);
      } else if (color[neighbor] === currentColor) {
        return false;
      }
    }
  }

  return true;
};
