import type { CustomNode, NodeGroup } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";

export interface NodesStoreState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  historyIndex: number;
  isDirected: boolean;
  name: string;
  id?: string;
  groups: NodeGroup[];
}
