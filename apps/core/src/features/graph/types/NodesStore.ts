import type { CustomNode, NodeGroup } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";

export interface NodesStoreState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  selectedNodes: string[];
  historyIndex: number;
  isDirected: boolean;
  name: string;
  id?: string;
}
