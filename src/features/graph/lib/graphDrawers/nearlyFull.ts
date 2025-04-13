import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { DEFAULT_CIRCLE_PADDING } from "@/features/graph/config/drawParams";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { generateCircleParams } from "@/features/graph/lib/helpers/calculateCirleParams";
import { changeDirectionsInCircularGraph } from "@/features/graph/lib/helpers/edgesDirectionsInCircular";

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
  });

  return {
    nodes,
    edges: changeDirectionsInCircularGraph(nodes, edges),
    width: radius * 2,
    height: radius * 2,
  };
};
