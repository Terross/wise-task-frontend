import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { buildLinkedListFromGraph } from "@/features/graph/lib/helpers/linkedListFromGraph";
import { DRAW_SPACING_X } from "@/features/graph/config/drawParams";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";

export const drawCycleGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX = 0;
  let maxHeight = 0;
  const linked = buildLinkedListFromGraph(nodes, edges);

  if (!linked) {
    return {
      nodes,
      edges,
      width: 0,
      height: 0,
    };
  }

  edges.forEach((edge) => {
    edge.sourceHandle = ConnectionSourceID.Left;
    edge.targetHandle = ConnectionTargetID.Right;
  });

  const nodeIdsInOrder: string[] = [];
  let current = linked;

  do {
    const nodeIndex = nodes.findIndex((node) => node.id === current.node.id);
    if (nodeIndex !== -1) {
      const isLastNode = !current.next || current.next === linked;

      nodes[nodeIndex].position = {
        x: currentX,
        y: isLastNode ? -100 : 0,
      };

      nodeIdsInOrder.push(current.node.id);

      currentX +=
        (current.node.data.size?.width || DEFAULT_NODE_SIZE.width) +
        DRAW_SPACING_X;

      maxHeight = Math.max(
        maxHeight,
        (current.node.data.size?.height || DEFAULT_NODE_SIZE.height) +
          (isLastNode ? 100 : 0),
      );
    }

    current = current.next!;
  } while (current && current !== linked);

  if (nodeIdsInOrder.length > 1) {
    const firstNodeId = nodeIdsInOrder[0];
    const lastNodeId = nodeIdsInOrder[nodeIdsInOrder.length - 1];

    const closingEdge = edges.find(
      (e) => e.source === firstNodeId && e.target === lastNodeId,
    );

    if (!closingEdge) {
      const reverseClosingEdge = edges.find(
        (e) => e.source === lastNodeId && e.target === firstNodeId,
      );

      if (reverseClosingEdge) {
        reverseClosingEdge.sourceHandle = ConnectionSourceID.Top;
        reverseClosingEdge.targetHandle = ConnectionTargetID.Top;
      }
    } else {
      closingEdge.sourceHandle = ConnectionSourceID.Top;
      closingEdge.targetHandle = ConnectionTargetID.Top;
    }
  }

  return {
    nodes,
    edges,
    width: currentX - DRAW_SPACING_X,
    height: maxHeight,
  };
};
