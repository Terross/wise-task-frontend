import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

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

export const getTreeLevelMinWidth = (
  nodes: CustomNode[],
  horizontalSpacing: number,
): number => {
  let sum: number = 0;
  for (let node of nodes) {
    sum += node.data.size?.width || DEFAULT_NODE_SIZE.width;
    sum += horizontalSpacing;
  }
  sum -= horizontalSpacing;
  return sum;
};

export const getTreeLevelSpacing = (
  nodes: CustomNode[],
  width: number,
): number => {
  let nodesWidthSum: number = 0;

  for (let node of nodes) {
    nodesWidthSum += node.data.size?.width || DEFAULT_NODE_SIZE.width;
  }

  return (width - nodesWidthSum) / nodes.length;
};
