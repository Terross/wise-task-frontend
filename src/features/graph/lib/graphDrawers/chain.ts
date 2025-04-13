import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { buildLinkedListFromGraph } from "@/features/graph/lib/helpers/linkedListFromGraph";
import { DRAW_SPACING_X } from "@/features/graph/config/drawSpacing";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";

export const drawChainGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX: number = 0;
  let currentY: number = 0;
  let xPositionTaken = 0;
  const linked = buildLinkedListFromGraph(nodes, edges);

  edges.forEach((edge) => {
    edge.sourceHandle = ConnectionSourceID.Left;
    edge.targetHandle = ConnectionTargetID.Right;
  });

  if (!linked) {
    return {
      nodes,
      edges,
      width: currentX,
      height: currentY,
    };
  }

  let current = linked;
  let maxHeight = 0;

  while (current) {
    const nodeIndex = nodes.findIndex((node) => node.id === current.node.id);
    if (nodeIndex !== -1) {
      nodes[nodeIndex].position = {
        x: currentX + xPositionTaken,
        y: currentY,
      };

      maxHeight = Math.max(
        maxHeight,
        current.node.data.size?.height || DEFAULT_NODE_SIZE.height,
      );
    }

    xPositionTaken +=
      (current.node.data.size?.width || DEFAULT_NODE_SIZE.width) +
      DRAW_SPACING_X;

    if (!current.next) {
      break;
    }

    current = current.next;
  }

  return {
    nodes,
    edges,
    width: xPositionTaken - DRAW_SPACING_X,
    height: maxHeight,
  };
};
