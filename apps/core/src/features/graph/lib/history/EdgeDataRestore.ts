import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { EdgeDataRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export class EdgeDataRestoreObject extends RestoreObject {
  private readonly edgeId: string;
  private readonly data: CustomEdge["data"];

  constructor(properties: EdgeDataRestore) {
    super(properties as Restore);
    this.data = properties.properties.data;
    this.edgeId = properties.properties.edgeId;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    const edgeIndex: number = state.edges.findIndex(
      (edge) => edge.id === this.edgeId,
    );
    if (edgeIndex === -1) {
      return state;
    }
    state.edges[edgeIndex].data = this.data;
    return state;
  };
}
