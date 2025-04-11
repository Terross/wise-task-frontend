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
import { colorNodesIntoTwoColors } from "@/features/graph/lib/helpers/colorNodesTwoColors";

export const drawBipartiteGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX: number = 0;
  let currentY: number = 0;
  let xPositionTaken = 0;
  let yPositionTaken = 0;
  const { redNodes, blueNodes } = colorNodesIntoTwoColors(edges, nodes);

  redNodes.forEach((node) => {
    console.log("red", node.data.label);
  });

  blueNodes.forEach((node) => {
    console.log("blue", node.data.label);
  });

  return {
    nodes,
    edges,
    xFinish: currentX,
    yFinish: currentY,
  };
};
