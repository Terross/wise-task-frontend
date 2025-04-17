import { CustomNode } from "@/features/graph/types/CustomNode";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

export const getMaxNodeHeight = (nodes: CustomNode[]): number => {
  return Math.max(
    ...nodes.map((node) => {
      return node.data.size?.height || DEFAULT_NODE_SIZE.height;
    }),
  );
};

export const getMaxNodeWidth = (nodes: CustomNode[]): number => {
  return Math.max(
    ...nodes.map((node) => {
      return node.data.size?.width || DEFAULT_NODE_SIZE.width;
    }),
  );
};
