import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { EdgeAddRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";

export class EdgeAddRestoreObject extends RestoreObject {
  private readonly edgeId: string;

  constructor(properties: EdgeAddRestore) {
    super(properties as Restore);
    this.edgeId = properties.properties.edgeId;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    state.edges = state.edges.filter((edge) => edge.id !== this.edgeId);
    return state;
  };
}
