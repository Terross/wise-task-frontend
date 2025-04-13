import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { CustomNode } from "@/features/graph/types/CustomNode";

export const colorNodesIntoTwoColors = (
  edges: CustomEdge[],
  nodes: CustomNode[],
): { redNodes: CustomNode[]; blueNodes: CustomNode[] } => {
  const colorMap = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach((edge) => {
    const sourceId = edge.sourceNode?.id || "";
    const targetId = edge.targetNode?.id || "";
    if (sourceId && targetId) {
      adjacencyList.get(sourceId)?.push(targetId);
      adjacencyList.get(targetId)?.push(sourceId);
    }
  });

  const startNodeId = nodes[0]?.id;
  if (!startNodeId) return { redNodes: [], blueNodes: [] };

  const queue: string[] = [startNodeId];
  colorMap.set(startNodeId, 1);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentColor = colorMap.get(currentId)!;

    for (const neighborId of adjacencyList.get(currentId) || []) {
      if (!colorMap.has(neighborId)) {
        colorMap.set(neighborId, currentColor === 1 ? 2 : 1);
        queue.push(neighborId);
      } else if (colorMap.get(neighborId) === currentColor) {
        throw new Error("Graph is not bipartite");
      }
    }
  }

  const redNodes: CustomNode[] = [];
  const blueNodes: CustomNode[] = [];

  nodes.forEach((node) => {
    const color = colorMap.get(node.id);
    if (color === 1) redNodes.push(node);
    else if (color === 2) blueNodes.push(node);
  });

  return { redNodes, blueNodes };
};
