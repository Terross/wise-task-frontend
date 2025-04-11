import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { buildLinkedListFromGraph } from "@/features/graph/lib/helpers/linkedListFromGraph";
import { DRAW_SPACING_X } from "@/features/graph/config/drawSpacing";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

export const drawCycleGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentY = 0;
  let xPositionTaken = 0;
  const linked = buildLinkedListFromGraph(nodes, edges);

  if (!linked) {
    return { nodes, edges, yFinish: currentY, xFinish: 0 };
  }

  const startNode = linked;
  let current = startNode;
  const nodeIdsInOrder: string[] = [];

  edges.forEach((edge) => {
    edge.sourceHandle = ConnectionSourceID.Left;
    edge.targetHandle = ConnectionTargetID.Right;
  });

  do {
    const nodeIndex: number = nodes.findIndex(
      (node) => node.id === current.node.id,
    );
    if (nodeIndex !== -1) {
      const isLastNode: boolean = current.next === null;
      nodes[nodeIndex].position = {
        x: xPositionTaken,
        y: isLastNode ? currentY - 200 : currentY,
      };
      nodeIdsInOrder.push(current.node.id);

      xPositionTaken +=
        (current.node.data.size?.width || DEFAULT_NODE_SIZE.width) +
        DRAW_SPACING_X;
    }

    current = current.next!;
  } while (current && current !== startNode);

  if (nodeIdsInOrder.length > 1) {
    const firstNodeId = nodeIdsInOrder[0];
    const lastNodeId = nodeIdsInOrder[nodeIdsInOrder.length - 1];

    const closingEdge = edges.find(
      (e) => e.sourceNode.id === firstNodeId && e.targetNode.id === lastNodeId,
    );

    if (closingEdge) {
      closingEdge.sourceHandle = ConnectionSourceID.Top;
      closingEdge.targetHandle = ConnectionTargetID.Top;
    }
  }

  return {
    nodes,
    edges,
    xFinish: xPositionTaken - DRAW_SPACING_X,
    yFinish: currentY,
  };
};
