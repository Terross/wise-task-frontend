import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export type ConnectedComponent = {
  nodes: CustomNode[];
  edges: CustomEdge[];
};
