import type { Connection, GraphNode } from "@vue-flow/core";
import {
  ConnectionSourceID,
  ConnectionTargetID,
} from "@/features/graph/types/CustomEdge";
import { graphSettingsStore } from "@/features/graph/stores/graphSettings";

const CENTER_HANDLE_IDS = new Set<string>([
  ConnectionSourceID.Center,
  ConnectionTargetID.Center,
]);

const isCenterOrMissingHandle = (handleId?: string | null): boolean =>
  !handleId || CENTER_HANDLE_IDS.has(handleId);

const getNodeCenter = (node: GraphNode) => ({
  x: node.computedPosition.x + node.dimensions.width / 2,
  y: node.computedPosition.y + node.dimensions.height / 2,
});

const getPreferredHandles = (
  sourceNode: GraphNode,
  targetNode: GraphNode,
): {
  sourceHandle: ConnectionSourceID;
  targetHandle: ConnectionTargetID;
} => {
  if (sourceNode.id === targetNode.id) {
    return {
      sourceHandle: ConnectionSourceID.Right,
      targetHandle: ConnectionTargetID.Left,
    };
  }

  const sourceCenter = getNodeCenter(sourceNode);
  const targetCenter = getNodeCenter(targetNode);
  const deltaX = targetCenter.x - sourceCenter.x;
  const deltaY = targetCenter.y - sourceCenter.y;

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX >= 0
      ? {
          sourceHandle: ConnectionSourceID.Right,
          targetHandle: ConnectionTargetID.Left,
        }
      : {
          sourceHandle: ConnectionSourceID.Left,
          targetHandle: ConnectionTargetID.Right,
        };
  }

  return deltaY >= 0
    ? {
        sourceHandle: ConnectionSourceID.Bottom,
        targetHandle: ConnectionTargetID.Top,
      }
    : {
        sourceHandle: ConnectionSourceID.Top,
        targetHandle: ConnectionTargetID.Bottom,
      };
};

export const resolveConnectionHandles = (
  connection: Connection,
  sourceNode?: GraphNode,
  targetNode?: GraphNode | null,
): Connection => {
  if (!sourceNode || !targetNode) {
    return connection;
  }

  const preferredHandles = getPreferredHandles(sourceNode, targetNode);
  const shouldUsePreferredHandles = graphSettingsStore.isOneHandle;

  return {
    ...connection,
    sourceHandle:
      shouldUsePreferredHandles ||
      isCenterOrMissingHandle(connection.sourceHandle)
      ? preferredHandles.sourceHandle
      : connection.sourceHandle,
    targetHandle:
      shouldUsePreferredHandles ||
      isCenterOrMissingHandle(connection.targetHandle)
      ? preferredHandles.targetHandle
      : connection.targetHandle,
  };
};
