import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

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

export interface NodeShiftRestore extends BaseRestore {
  type: "node:change_shift";
  properties: {
    nodeId: string;
    coords: { x: number; y: number };
  };
}

export interface NodeDataRestore extends BaseRestore {
  type: "node:change_data";
  properties: { data: CustomNode["data"]; nodeId: string };
}

export interface EdgeRemoveRestore extends BaseRestore {
  type: "edge:remove";
  properties: {
    sourceId: string;
    targetId: string;
    weight?: string | number;
    color?: string;
  };
}

export type Restore =
  | NodeAddRestore
  | NodeRemoveRestore
  | NodeSizeRestore
  | NodeShiftRestore
  | NodeDataRestore
  | EdgeRemoveRestore;
