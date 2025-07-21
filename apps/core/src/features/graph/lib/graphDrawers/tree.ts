import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { getTreeLevels } from "@/features/graph/lib/helpers/getTreeLevels";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";
import { graphSettingsStore } from "@/features/graph/stores/graphSettings";

export const drawTreeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  const treeLevels = getTreeLevels(nodes, edges);
  let maxWidth = 0;
  let maxHeight = 0;
  const verticalSpacing = 100;

  if (!graphSettingsStore.isOneHandle) {
    edges.forEach((edge) => {
      edge.sourceHandle = ConnectionSourceID.Top;
      edge.targetHandle = ConnectionTargetID.Bottom;
    });
  }

  treeLevels.forEach((level, levelIndex) => {
    const levelWidth = level.reduce((sum, node) => {
      return (
        sum +
        (node.data.size?.width || DEFAULT_NODE_SIZE.width) +
        graphSettingsStore.defaultNodeSpacingX
      );
    }, -graphSettingsStore.defaultNodeSpacingX);

    maxWidth = Math.max(maxWidth, levelWidth);

    const currentY =
      levelIndex *
      ((level[0]?.data.size?.height || DEFAULT_NODE_SIZE.height) +
        verticalSpacing);
    maxHeight =
      currentY + (level[0]?.data.size?.height || DEFAULT_NODE_SIZE.height);

    let currentX = -levelWidth / 2;
    level.forEach((node) => {
      node.position = { x: currentX, y: currentY };
      currentX +=
        (node.data.size?.width || DEFAULT_NODE_SIZE.width) +
        graphSettingsStore.defaultNodeSpacingX;
    });
  });

  return {
    nodes,
    edges,
    width: maxWidth,
    height: maxHeight,
  };
};
