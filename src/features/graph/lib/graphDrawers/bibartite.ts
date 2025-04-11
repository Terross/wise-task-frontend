import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { DRAW_SPACING_Y } from "@/features/graph/config/drawSpacing";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { colorNodesIntoTwoColors } from "@/features/graph/lib/helpers/colorNodesTwoColors";
import {
  getMinHeight,
  getVerticalSpacing,
} from "@/features/graph/lib/helpers/getBipartiteGraphHeight";

export const drawBipartiteGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX: number = 0;
  let currentY: number = 0;
  const { redNodes, blueNodes } = colorNodesIntoTwoColors(edges, nodes);
  const minHeight = Math.max(
    getMinHeight(redNodes, DRAW_SPACING_Y),
    getMinHeight(blueNodes, DRAW_SPACING_Y),
  );
  const redsVerticalSpacing = getVerticalSpacing(redNodes, minHeight);
  const bluesVerticalSpacing = getVerticalSpacing(blueNodes, minHeight);

  const redNodeIds = new Set(redNodes.map((node) => node.id));
  const blueNodeIds = new Set(blueNodes.map((node) => node.id));

  edges.forEach((edge) => {
    const isRedToBlue =
      redNodeIds.has(edge.source) && blueNodeIds.has(edge.target);
    const isBlueToRed =
      blueNodeIds.has(edge.source) && redNodeIds.has(edge.target);

    if (isRedToBlue) {
      edge.sourceHandle = ConnectionSourceID.Right;
      edge.targetHandle = ConnectionTargetID.Left;
    } else {
      edge.sourceHandle = ConnectionSourceID.Left;
      edge.targetHandle = ConnectionTargetID.Right;
    }
  });

  const redNodesNormalized: CustomNode[] = [];
  for (let i = 0; i < redNodes.length; i++) {
    redNodes[i].position.y = currentY;
    redNodes[i].position.x = currentX;
    redNodesNormalized.push(redNodes[i]);
    currentY += redNodes[i].data.size?.height || DEFAULT_NODE_SIZE.height;
    currentY += redsVerticalSpacing;
  }

  currentY = 0;

  const blueNodesNormalized: CustomNode[] = [];
  for (let i = 0; i < blueNodes.length; i++) {
    blueNodes[i].position.y = currentY;
    blueNodes[i].position.x = currentX + 300;
    blueNodesNormalized.push(blueNodes[i]);
    currentY += blueNodes[i].data.size?.height || DEFAULT_NODE_SIZE.height;
    currentY += bluesVerticalSpacing;
  }

  return {
    nodes: [...redNodesNormalized, ...blueNodesNormalized],
    edges,
    xFinish: currentX,
    yFinish: currentY,
  };
};
