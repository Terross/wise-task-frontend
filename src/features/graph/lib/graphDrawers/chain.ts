import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { buildLinkedListFromGraph } from "@/features/graph/lib/helpers/linkedListFromGraph";

export const drawChainGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): CustomNode[] => {
  const linked = buildLinkedListFromGraph(nodes, edges);
  console.log("Linked", linked);
  return nodes;
};
