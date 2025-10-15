import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { NodeSizeRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomNode } from "@/features/graph/types/CustomNode";

export class NodeSizeRestoreObject extends RestoreObject {
  private readonly nodeId: string;
  private readonly size: number;

  constructor(properties: NodeSizeRestore) {
    super(properties as Restore);
    this.nodeId = properties.properties.nodeId;
    this.size = properties.properties.prevSize;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    const nodeIndex: number = state.nodes.findIndex(
      (node: CustomNode) => node.id === this.nodeId,
    );
    if (nodeIndex === -1) {
      return state;
    }
    state.nodes[nodeIndex].data.size = { width: this.size, height: this.size };
    return state;
  };
}
