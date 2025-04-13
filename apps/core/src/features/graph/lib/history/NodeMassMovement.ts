import { RestoreObject } from "@/features/graph/types/RestoreObject";
import {
  NodeMassMovementRestore,
  Restore,
} from "@/features/graph/types/restores";
import { NodesStoreState } from "@/features/graph/types/NodesStore";

export class NodeMassMovementRestoreObject extends RestoreObject {
  private readonly nodePositions: Map<string, { x: number; y: number }>;

  constructor(properties: NodeMassMovementRestore) {
    super(properties as Restore);
    this.nodePositions = properties.properties;
  }

  public restore = (state: NodesStoreState): NodesStoreState => {
    return {
      ...state,
      nodes: state.nodes.map((node) => {
        if (this.nodePositions.has(node.id)) {
          const position: { x: number; y: number } = this.nodePositions.get(
            node.id,
          )!;
          return {
            ...node,
            position: {
              x: position.x,
              y: position.y,
            },
          };
        }
        return node;
      }),
    };
  };
}
