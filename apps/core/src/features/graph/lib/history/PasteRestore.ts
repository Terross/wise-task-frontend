import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { PasteRestore, Restore } from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";

export class PasteRestoreObject extends RestoreObject {
  private readonly edgeIds: string[];
  private readonly nodeIds: string[];

  constructor(properties: PasteRestore) {
    super(properties as Restore);
    this.edgeIds = properties.properties.edgeIds;
    this.nodeIds = properties.properties.nodeIds;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    state.edges = state.edges.filter((edge) => !this.edgeIds.includes(edge.id));
    state.nodes = state.nodes.filter((node) => !this.nodeIds.includes(node.id));
    return state;
  };
}
