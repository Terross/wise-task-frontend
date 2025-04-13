import { RestoreObject } from "@/features/graph/types/RestoreObject";
import {
  NodeMassDeleteRestore,
  NodeMassMovementRestore,
  Restore,
} from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export class NodeMassDeleteRestoreObject extends RestoreObject {
  private readonly nodes: CustomNode[];
  private readonly edges: CustomEdge[];

  constructor(properties: NodeMassDeleteRestore) {
    super(properties as Restore);
    this.edges = properties.properties.edges;
    this.nodes = properties.properties.nodes;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    return {
      ...state,
      nodes: [...state.nodes, ...this.nodes],
      edges: [...state.edges, ...this.edges],
    };
  };
}
