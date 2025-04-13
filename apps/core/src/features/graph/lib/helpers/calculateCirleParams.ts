import { CustomNode } from "@/features/graph/types/CustomNode";
import { CircleGraphParams } from "@/features/graph/types/areaParams";
import { getMaxNodeHeight, getMaxNodeWidth } from "./paramsFinder";

export const generateCircleParams = (
  nodes: CustomNode[],
  padding: number,
): CircleGraphParams => {
  const nodesAmount: number = nodes.length;
  if (nodesAmount === 0) {
    throw new Error("Unexpected Params for circle params generation");
  }
  const stepDegree: number = 360 / nodes.length;
  const heightBasedRadius =
    getMaxNodeHeight(nodes) / (2 * Math.sin(Math.PI / nodesAmount));
  const widthBasedRadius =
    getMaxNodeWidth(nodes) / (2 * Math.sin(Math.PI / nodesAmount));
  return {
    radius: Math.max(heightBasedRadius, widthBasedRadius) + padding,
    stepDegree: stepDegree,
  };
};
