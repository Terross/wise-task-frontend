import type { CustomNode, NodeGroup } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { GraphStatistics } from "@/features/graph/types/GraphStatistics";

export interface NodesStoreState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  historyIndex: number;
  isDirected: boolean;
  name: string;
  id?: string;
  groups: NodeGroup[];
  statistic?: GraphStatistics;
}
