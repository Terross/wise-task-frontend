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
import { Position } from "@vue-flow/core";

export const drawChainGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX: number = 0;
  let currentY: number = 0;
  let xPositionTaken = 0;
  const linked = buildLinkedListFromGraph(nodes, edges);

  if (!linked) {
    return { nodes, edges, yFinish: currentY, xFinish: currentX };
  }

  let current = linked;

  edges.forEach((edge) => {
    edge.sourceHandle = ConnectionSourceID.Left;
    edge.targetHandle = ConnectionTargetID.Right;
  });

  while (true) {
    console.log(current.node.data.label);
    const nodeIndex = nodes.findIndex((node) => node.id === current.node.id);
    if (nodeIndex !== -1) {
      nodes[nodeIndex].position.y = currentY;
      nodes[nodeIndex].position.x = currentX + xPositionTaken;
    }

    xPositionTaken +=
      DRAW_SPACING_X +
      (current.node.data.size?.width || DEFAULT_NODE_SIZE.width);

    if (current.next === null) {
      return {
        nodes,
        edges,
        xFinish: currentX,
        yFinish: currentY,
      };
    }

    current = current.next;
  }
};
