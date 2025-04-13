import { CustomNode } from "@/features/graph/types/CustomNode";
import { SelectedAreaSize } from "@/features/graph/types/selectedAreaSize";

export const getSelectedAreaSizes = (nodes: CustomNode[]): SelectedAreaSize => {
  if (nodes.length === 0) {
    return { startX: 0, startY: 0, endX: 0, endY: 0 };
  }

  let minX: number = Infinity;
  let maxX: number = -Infinity;
  let minY: number = Infinity;
  let maxY: number = -Infinity;

  for (const node of nodes) {
    const width: number = node.data.size?.width || 0;
    const height: number = node.data.size?.height || 0;
    const centerX: number = node.position.x;
    const centerY: number = node.position.y;

    const halfWidth: number = width / 2;
    const halfHeight: number = height / 2;

    const nodeMinX: number = centerX - halfWidth;
    const nodeMaxX: number = centerX + halfWidth;
    const nodeMinY: number = centerY - halfHeight;
    const nodeMaxY: number = centerY + halfHeight;

    minX = Math.min(minX, nodeMinX);
    maxX = Math.max(maxX, nodeMaxX);
    minY = Math.min(minY, nodeMinY);
    maxY = Math.max(maxY, nodeMaxY);
  }

  return {
    startX: minX,
    startY: minY,
    endX: maxX,
    endY: maxY,
  };
};
