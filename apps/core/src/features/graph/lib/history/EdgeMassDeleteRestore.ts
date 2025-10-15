import { RestoreObject } from "@/features/graph/types/RestoreObject";
import {
  EdgeMassDeleteRestore,
  Restore,
} from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export class EdgeMassDeleteRestoreObject extends RestoreObject {
  private readonly edges: CustomEdge[];

  constructor(properties: EdgeMassDeleteRestore) {
    super(properties as Restore);
    this.edges = properties.properties.edges;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    return {
      ...state,
      edges: [...state.edges, ...this.edges],
    };
  };
}
