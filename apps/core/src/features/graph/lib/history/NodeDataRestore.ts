import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { NodeDataRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomNode } from "@/features/graph/types/CustomNode";

export class NodeDataRestoreObjet extends RestoreObject {
  private readonly nodeId: string;
  private readonly data: CustomNode["data"];

  constructor(properties: NodeDataRestore) {
    super(properties as Restore);
    this.nodeId = properties.properties.nodeId;
    this.data = properties.properties.data;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    const nodeIndex = state.nodes.findIndex((node) => node.id === this.nodeId);
    if (nodeIndex === -1) {
      return state;
    }
    state.nodes[nodeIndex].data = this.data;
    return state;
  };
}
