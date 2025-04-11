import { CustomNode } from "@/features/graph/types/CustomNode";
import {
  ConnectionSourceID,
  ConnectionTargetID,
  CustomEdge,
} from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import {
  getTreeLevelMinWidth,
  getTreeLevels,
  getTreeLevelSpacing,
} from "@/features/graph/lib/helpers/getTreeLevels";
import { DRAW_SPACING_X } from "@/features/graph/config/drawSpacing";
import { DEFAULT_NODE_SIZE } from "@/features/graph/config/nodeDefaultSettings";

export const drawTreeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let currentX: number = 0;
  let currentY: number = 0;
  const treeLevels = getTreeLevels(nodes, edges);

  const treeLevelsMinWidth: number[] = treeLevels.map((level) => {
    return getTreeLevelMinWidth(level, DRAW_SPACING_X);
  });

  const maxTreeLevelWidth: number = Math.max(...treeLevelsMinWidth);
  nodes = [];

  edges.forEach((edge) => {
    edge.sourceHandle = ConnectionSourceID.Top;
    edge.targetHandle = ConnectionTargetID.Bottom;
  });

  for (let level of treeLevels) {
    const levelSpacing = getTreeLevelSpacing(level, maxTreeLevelWidth);
    for (let i = 0; i < level.length; i++) {
      level[i].position.y = currentY;
      level[i].position.x = currentX;
      currentX += level[i].data.size?.width || DEFAULT_NODE_SIZE.width;
      currentX += levelSpacing;
      nodes.push(level[i]);
    }
    currentX = 0;
    currentY += 300;
  }
  return {
    nodes,
    edges,
    xFinish: currentX,
    yFinish: currentY,
  };
};
