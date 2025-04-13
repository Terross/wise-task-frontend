import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import {
  DEFAULT_CIRCLE_PADDING,
  DRAW_SPACING_X,
} from "@/features/graph/config/drawParams";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { generateCircleParams } from "@/features/graph/lib/helpers/calculateCirleParams";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

export const drawNearlyFullGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
  padding?: number,
): DrawerResults => {
  const centerX = 0;
  const centerY = 0;

  const { radius, stepDegree } = generateCircleParams(
    nodes,
    padding || DEFAULT_CIRCLE_PADDING,
  );

  const stepRadians = (stepDegree * Math.PI) / 180;

  nodes.forEach((node, index) => {
    const angle = stepRadians * index;

    node.position.x = centerX + Math.cos(angle) * radius;
    node.position.y = centerY + Math.sin(angle) * radius;

    const nodeHeight: number =
      node.data.size?.height || DEFAULT_NODE_SIZE.height;
  });

  return {
    nodes,
    edges,
    width: radius * 2,
    height: radius * 2,
  };
};
