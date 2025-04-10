import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { ConnectedComponent } from "@/features/graph/types/ConnectedComponents";

export const getConnectedComponents = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): ConnectedComponent[] => {
  const adjacency: Record<string, Set<string>> = {};
  for (const node of nodes) {
    adjacency[node.id] = new Set();
  }

  for (const edge of edges) {
    const source: string = edge.source;
    const target: string = edge.target;
    adjacency[source]?.add(target);
    adjacency[target]?.add(source);
  }

  const visited: Set<string> = new Set<string>();
  const components: ConnectedComponent[] = [];

  const dfs = (nodeId: string, componentNodeIds: Set<string>) => {
    visited.add(nodeId);
    componentNodeIds.add(nodeId);
    for (const neighbor of adjacency[nodeId]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, componentNodeIds);
      }
    }
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const componentNodeIds = new Set<string>();
      dfs(node.id, componentNodeIds);

      const componentNodes: CustomNode[] = nodes.filter((n) =>
        componentNodeIds.has(n.id),
      );
      const componentEdges: CustomEdge[] = edges.filter(
        (edge) =>
          componentNodeIds.has(edge.source) &&
          componentNodeIds.has(edge.target),
      );

      components.push({
        nodes: componentNodes,
        edges: componentEdges,
      });
    }
  }

  return components;
};
