import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { createCustomNode } from "@/features/graph/types/CustomNode";
import { createCustomEdge } from "@/features/graph/types/CustomEdge";
import { GraphNode } from "@vue-flow/core";

export const node1 = Object.freeze(
  createCustomNode(
    "1",
    { x: 1, y: 2 },
    {
      weight: 299,
      size: { width: 100, height: 100 },
      label: "LABEL1",
      color: "RED",
    },
  ),
);

export const node2 = Object.freeze(
  createCustomNode(
    "2",
    { x: 2, y: 3 },
    {
      weight: 199,
      size: { width: 50, height: 50 },
      label: "LABEL2",
      color: "GREEN",
    },
  ),
);

export const node3 = Object.freeze(
  createCustomNode(
    "3",
    { x: 3, y: 4 },
    {
      weight: 599,
      size: { width: 200, height: 200 },
      label: "LABEL3",
      color: "GRAY",
    },
  ),
);

export const edge1 = Object.freeze(
  createCustomEdge({
    sourceNode: node1 as GraphNode,
    targetNode: node2 as GraphNode,
    id: "1",
    data: {
      color: "#ff0000",
      weight: 300,
    },
  }),
);

export const edge2 = Object.freeze(
  createCustomEdge({
    sourceNode: node2 as GraphNode,
    targetNode: node3 as GraphNode,
    id: "2",
    data: {
      color: "#00FF00",
      weight: 200,
    },
  }),
);

export const mockedDataStoreState: NodesStoreState = {
  nodes: [node1, node2, node3],
  copiedNodes: [node1, node2],
  edges: [edge1, edge2],
  copiedEdges: [edge1],
  historyIndex: 0,
  isDirected: false,
  name: "",
  groups: [],
} as const;
