import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { getTreeLevels } from "@/features/graph/lib/helpers/getTreeLevels";
import { DRAW_SPACING_X } from "@/features/graph/config/drawSpacing";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

export const drawTreeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  const treeLevels: CustomNode[][] = getTreeLevels(nodes, edges);
  const updatedNodes: CustomNode[] = [];
  let maxY: number = 0;

  edges.forEach((edge) => {
    edge.sourceHandle = ConnectionSourceID.Top;
    edge.targetHandle = ConnectionTargetID.Bottom;
  });

  treeLevels.forEach((level, levelIndex) => {
    const levelWidth: number = level.reduce((sum, node) => {
      return (
        sum +
        (node.data.size?.width || DEFAULT_NODE_SIZE.width) +
        DRAW_SPACING_X
      );
    }, -DRAW_SPACING_X);

    let currentX: number = -levelWidth / 2;
    const currentY: number = levelIndex * 300;

    level.forEach((node): void => {
      const nodeWidth: number =
        node.data.size?.width || DEFAULT_NODE_SIZE.width;
      node.position.x = currentX + nodeWidth / 2;
      node.position.y = currentY;
      updatedNodes.push(node);
      currentX += nodeWidth + DRAW_SPACING_X;
    });

    maxY = currentY + (level[0]?.data.size?.height || DEFAULT_NODE_SIZE.height);
  });

  return {
    nodes: updatedNodes,
    edges,
    xFinish: 0,
    yFinish: maxY,
  };
};
