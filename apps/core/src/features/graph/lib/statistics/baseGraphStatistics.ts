import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { CustomNode } from "@/features/graph/types/CustomNode";

export const calculateSelfConnectedEdgesAmount = (
  edges: CustomEdge[],
): number => {
  return edges.filter(
    (edge: CustomEdge) => edge.sourceNode.id === edge.targetNode.id,
  ).length;
};

export const calculateHangingNodesAmount = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): number => {
  const uniqueIds: Set<string> = new Set<string>(
    nodes.map((node) => {
      return node.id;
    }),
  );
  for (const edge of edges) {
    if (uniqueIds.has(edge.sourceNode.id)) {
      uniqueIds.delete(edge.sourceNode.id);
    }
    if (uniqueIds.has(edge.targetNode.id)) {
      uniqueIds.delete(edge.targetNode.id);
    }
  }
  return uniqueIds.size;
};

export const calculateLeafsAmount = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): number => {
  if (edges.length === 0) {
    return nodes.length;
  }

  const edgesMap: Map<string, number> = new Map<string, number>();

  for (const node of nodes) {
    edgesMap.set(node.id, 0);
  }

  console.log(edgesMap);

  for (const edge of edges) {
    console.log("SOURCE", edge.source);
    console.log("TARGET: ", edge.target);
    const sourceEntrances: number | undefined = edgesMap.get(edge.source);
    if (sourceEntrances === undefined) {
      return -1;
    }
    edgesMap.set(edge.source, sourceEntrances + 1);

    const targetEntrances: number | undefined = edgesMap.get(edge.target);
    if (targetEntrances === undefined) {
      return -1;
    }
    edgesMap.set(edge.target, targetEntrances + 1);
  }

  let leafsAmount: number = 0;
  edgesMap.forEach((value, _) => {
    if (value === 1) {
      leafsAmount += 1;
    }
  });
  return leafsAmount;
};
