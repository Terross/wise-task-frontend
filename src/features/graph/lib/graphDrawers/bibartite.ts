import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { DRAW_SPACING_Y } from "@/features/graph/config/drawParams";
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
  const { redNodes, blueNodes } = colorNodesIntoTwoColors(edges, nodes);
  const columnSpacing = 200;

  const minHeight = getMinHeight([...redNodes, ...blueNodes], DRAW_SPACING_Y);
  const redVerticalSpacing = getVerticalSpacing(redNodes, minHeight);
  const blueVerticalSpacing = getVerticalSpacing(blueNodes, minHeight);

  edges.forEach((edge) => {
    const isRedToBlue =
      redNodes.some((n) => n.id === edge.source) &&
      blueNodes.some((n) => n.id === edge.target);
    edge.sourceHandle = isRedToBlue
      ? ConnectionSourceID.Right
      : ConnectionSourceID.Left;
    edge.targetHandle = isRedToBlue
      ? ConnectionTargetID.Left
      : ConnectionTargetID.Right;
  });

  let currentY = 0;
  redNodes.forEach((node) => {
    const nodeHeight = node.data.size?.height || DEFAULT_NODE_SIZE.height;
    node.position = { x: 0, y: currentY + redVerticalSpacing / 2 };
    currentY += nodeHeight + redVerticalSpacing;
  });

  currentY = 0;
  const blueX =
    (redNodes[0]?.data.size?.width || DEFAULT_NODE_SIZE.width) + columnSpacing;
  blueNodes.forEach((node) => {
    const nodeHeight = node.data.size?.height || DEFAULT_NODE_SIZE.height;
    node.position = { x: blueX, y: currentY + blueVerticalSpacing / 2 };
    currentY += nodeHeight + blueVerticalSpacing;
  });

  const maxHeight = Math.max(
    getMinHeight(redNodes, redVerticalSpacing),
    getMinHeight(blueNodes, blueVerticalSpacing),
  );

  const maxWidth =
    blueX + (blueNodes[0]?.data.size?.width || DEFAULT_NODE_SIZE.width);

  return {
    nodes: [...redNodes, ...blueNodes],
    edges,
    width: maxWidth,
    height: maxHeight,
  };
};
