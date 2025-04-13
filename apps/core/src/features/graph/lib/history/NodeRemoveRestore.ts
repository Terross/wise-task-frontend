import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { NodeRemoveRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export class NodeRemoveRestoreObject extends RestoreObject {
  private readonly node: CustomNode;
  private readonly edges: CustomEdge[];

  constructor(properties: NodeRemoveRestore) {
    super(properties as Restore);
    this.node = properties.properties.node;
    this.edges = properties.properties.edges;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    state.nodes.push(this.node);
    state.edges.push(...this.edges);
    return state;
  };
}
