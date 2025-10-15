import { CustomNode } from "@/features/graph/types/CustomNode";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

export const getMinHeight = (nodes: CustomNode[], ySpacing: number): number => {
  let sum: number = 0;
  for (let node of nodes) {
    sum += node.data.size?.height || DEFAULT_NODE_SIZE.height;
    sum += ySpacing;
  }
  return sum;
};

export const getVerticalSpacing = (
  nodes: CustomNode[],
  overallHeight: number,
) => {
  let nodesHeightSum: number = 0;
  const nodesAmount = nodes.length;
  for (let node of nodes) {
    nodesHeightSum += node.data.size?.height || DEFAULT_NODE_SIZE.height;
  }
  return (overallHeight - nodesHeightSum) / nodesAmount;
};
