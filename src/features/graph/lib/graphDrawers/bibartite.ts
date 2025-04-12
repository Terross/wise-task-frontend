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
  const { redNodes, blueNodes } = colorNodesIntoTwoColors(edges, nodes);
  const columnSpacing = 200;
  let maxHeight = 0;
  let maxWidth = 0;

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

  // Располагаем красные узлы
  let currentY = 0;
  redNodes.forEach((node) => {
    node.position = { x: 0, y: currentY };
    currentY +=
      (node.data.size?.height || DEFAULT_NODE_SIZE.height) + DRAW_SPACING_Y;
    maxHeight = Math.max(
      maxHeight,
      node.position.y + (node.data.size?.height || DEFAULT_NODE_SIZE.height),
    );
  });

  // Располагаем синие узлы
  currentY = 0;
  const blueX =
    (redNodes[0]?.data.size?.width || DEFAULT_NODE_SIZE.width) + columnSpacing;
  blueNodes.forEach((node) => {
    node.position = { x: blueX, y: currentY };
    currentY +=
      (node.data.size?.height || DEFAULT_NODE_SIZE.height) + DRAW_SPACING_Y;
    maxHeight = Math.max(
      maxHeight,
      node.position.y + (node.data.size?.height || DEFAULT_NODE_SIZE.height),
    );
  });

  maxWidth =
    blueX + (blueNodes[0]?.data.size?.width || DEFAULT_NODE_SIZE.width);

  return {
    nodes: [...redNodes, ...blueNodes],
    edges,
    width: maxWidth,
    height: maxHeight,
  };
};
