import { RestoreObject } from "@/features/graph/types/RestoreObject";
import {
  EdgeRemoveRestore,
  NodeRemoveRestore,
  Restore,
} from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

export class EdgeRemoveRestoreObject extends RestoreObject {
  private readonly sourceId: string;
  private readonly targetId: string;
  private readonly weight?: string | number;
  private readonly color?: string;

  constructor(properties: EdgeRemoveRestore) {
    super(properties as Restore);
    this.sourceId = properties.properties.sourceId;
    this.targetId = properties.properties.targetId;
    this.weight = properties.properties.weight;
    this.color = properties.properties.color;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    const targetNode = state.nodes.find((node) => node.id === this.targetId);
    if (!targetNode) {
      return state;
    }
    const sourceNode = state.nodes.find((node) => node.id === this.sourceId);
    if (!sourceNode) {
      return state;
    }

    state.edges.push({
      targetNode: targetNode,
      sourceNode: sourceNode,
      data: { weight: this.weight, color: this.color },
    });
    return state;
  };
}
