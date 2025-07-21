import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { EdgeRemoveRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export class EdgeRemoveRestoreObject extends RestoreObject {
  private readonly deletedEdge: CustomEdge;

  constructor(properties: EdgeRemoveRestore) {
    super(properties as Restore);
    this.deletedEdge = properties.properties;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    state.edges.push(this.deletedEdge);
    return state;
  };
}
