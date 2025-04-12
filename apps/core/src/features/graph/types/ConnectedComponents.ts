import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export type ConnectedComponent = {
  nodes: CustomNode[];
  edges: CustomEdge[];
};

export interface DrawerResults {
  nodes: CustomNode[];
  edges: CustomEdge[];
  width: number;
  height: number;
}
