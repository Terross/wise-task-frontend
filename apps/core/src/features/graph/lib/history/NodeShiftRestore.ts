import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { NodeShiftRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";

export class NodeShiftRestoreObjet extends RestoreObject {
  private readonly nodeId: string;
  private readonly position: { x: number; y: number };

  constructor(properties: NodeShiftRestore) {
    super(properties as Restore);
    this.nodeId = properties.properties.nodeId;
    this.position = properties.properties.position;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    const nodeIndex = state.nodes.findIndex((node) => node.id === this.nodeId);
    if (nodeIndex === -1) {
      return state;
    }
    state.nodes[nodeIndex].position = this.position;
    return state;
  };
}
