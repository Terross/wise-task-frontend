import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/Edge";

interface BaseRestore {
  type: string;
  properties: any;
}

export interface NodeAddRestore extends BaseRestore {
  type: "node:add";
  properties: {
    nodeId: string;
  };
}

export interface NodeRemoveRestore extends BaseRestore {
  type: "node:remove";
  properties: {
    node: CustomNode;
    edges: CustomEdge[];
  };
}

export interface NodeSizeRestore extends BaseRestore {
  type: "node:change_size";
  properties: {
    nodeId: string;
    prevSize: number;
  };
}

export type Restore = NodeAddRestore | NodeRemoveRestore | NodeSizeRestore;
