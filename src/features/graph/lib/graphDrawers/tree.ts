import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { getTreeLevels } from "@/features/graph/lib/helpers/getTreeLevels";

export const drawTreeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX: number = 0;
  let currentY: number = 0;
  const treeLevels = getTreeLevels(nodes, edges);

  console.log(treeLevels);

  return {
    nodes,
    edges,
    xFinish: currentX,
    yFinish: currentY,
  };
};
