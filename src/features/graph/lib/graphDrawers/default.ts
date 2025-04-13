import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";
import { DRAW_SPACING_X } from "@/features/graph/config/drawParams";

export const drawDefaultTypeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let width = 0;
  let height = 0;

  nodes.forEach((node) => {
    width +=
      (node.data.size?.width || DEFAULT_NODE_SIZE.width) + DRAW_SPACING_X;
    height = Math.max(
      height,
      node.data.size?.height || DEFAULT_NODE_SIZE.height,
    );
  });

  width -= DRAW_SPACING_X;

  return {
    nodes,
    edges,
    width,
    height,
  };
};
