import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export function getTreeLevels(
  nodes: CustomNode[],
  edges: CustomEdge[],
): CustomNode[][] {
  const nodeMap: Map<string, CustomNode> = new Map<string, CustomNode>();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  const adjacencyList: Map<string, string[]> = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });

  const rootNodes: CustomNode[] = nodes.filter(
    (node) => !edges.some((edge) => edge.target === node.id),
  );

  const levels: CustomNode[][] = [];
  let currentLevel = rootNodes;

  while (currentLevel.length > 0) {
    levels.push(currentLevel);

    const nextLevelIds: Set<string> = new Set<string>();
    currentLevel.forEach((node): void => {
      (adjacencyList.get(node.id) || []).forEach((neighborId) => {
        nextLevelIds.add(neighborId);
      });
    });

    currentLevel = Array.from(nextLevelIds)
      .map((id) => nodeMap.get(id)!)
      .filter(Boolean);
  }

  return levels.reverse();
}
