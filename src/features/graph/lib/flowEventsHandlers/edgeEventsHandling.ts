import { useNodeStore } from "@/features/graph/stores/nodes";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";

export function setupEdgeChangesHandler() {
  const nodeStore = useNodeStore();
  const { vueFlowState } = useVueFlowBus();

  const { onConnect, addEdges, onEdgesChange, getSelectedEdges } = vueFlowState;

  onConnect((connection) => {
    console.log(connection);
    // @ts-ignore
    connection.type = "special";
    addEdges(connection);
  });

  onEdgesChange((changes) => {
    if (changes.length === 0) {
      return;
    }
    if (changes.every((change) => change.type === "remove")) {
      const edgeIds: string[] = [];
      for (let i = 0; i < changes.length; i++) {
        // @ts-expect-error тут нет ошибки, т.к. все типы EdgeChange<T> имеют id
        edgeIds.push(changes[i]?.id || "-1");
      }
      nodeStore.edgesMassRemove(edgeIds);
    }
    changes.forEach((change) => {
      if (change.type === "add") {
        // @ts-ignore
        nodeStore.addEdge(change.item);
      }
    });
    return true;
  });
}

export const isEdgeSelected = (edgeId: string): boolean => {
  const { vueFlowState } = useVueFlowBus();
  const { getSelectedEdges } = vueFlowState;
  return getSelectedEdges.some((edge) => edge.id === edgeId);
};
