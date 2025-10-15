import { EdgeProps, GraphNode, Position } from "@vue-flow/core";
import { createCustomNode } from "@/features/graph/types/CustomNode";

type EdgeData = {
  color?: string;
  weight?: string | number;
};

export enum ConnectionSourceID {
  Right = "source-a",
  Left = "source-b",
  Top = "source-c",
  Bottom = "source-d",
  Center = "source-center",
}

export enum ConnectionTargetID {
  Right = "target-a",
  Left = "target-b",
  Top = "target-c",
  Bottom = "target-d",
  Center = "target-center",
}

export interface CustomEdge extends EdgeProps {
  data: EdgeData;
  sourceHandle?: ConnectionSourceID;
  targetHandle?: ConnectionTargetID;
  isSelected?: boolean;
}

type CreateCustomEdgeOptions = Partial<{
  id: string;
  source: string;
  target: string;
  sourceNode: GraphNode;
  targetNode: GraphNode;
  sourceHandle: ConnectionSourceID;
  targetHandle: ConnectionTargetID;
  data: EdgeData;
  isSelected: boolean;
  label: string;
  type: string;
  animated: boolean;
  selected: boolean;
  interactionWidth: number;
  sourcePosition: Position;
  targetPosition: Position;
  markerStart: string;
  markerEnd: string;
}>;

export function createCustomEdge(
  options: CreateCustomEdgeOptions = {},
): CustomEdge {
  const {
    id = `edge-${Math.random().toString(36).substr(2, 9)}`,
    source = "",
    target = "",
    sourceNode = createCustomNode("1", { x: 10, y: 20 }) as GraphNode,
    targetNode = createCustomNode("2", { x: 100, y: 200 }) as GraphNode,
    sourceHandle,
    targetHandle,
    data = {},
    isSelected = false,
    label = "",
    type = "default",
    animated = false,
    selected = false,
    interactionWidth = 20,
    sourcePosition = Position.Right,
    targetPosition = Position.Left,
    markerStart = "url(#arrow)",
    markerEnd = "url(#arrow)",
  } = options;

  return {
    id,
    source,
    target,
    sourceNode,
    sourcePosition,
    targetPosition,
    markerStart,
    markerEnd,
    targetNode,
    sourceHandle,
    events: null as any,
    sourceX: 1,
    sourceY: 2,
    targetX: 3,
    targetY: 4,
    targetHandle,
    data,
    isSelected,
    label,
    type,
    animated,
    selected,
    interactionWidth,
    ...(data?.color && { style: { stroke: data.color } }),
  };
}
