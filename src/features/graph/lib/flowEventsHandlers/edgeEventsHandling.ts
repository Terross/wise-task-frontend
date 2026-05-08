import { useNodeStore } from "@/features/graph/stores/nodes";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { createEdgeFromConnection } from "@/features/graph/lib/helpers/createEdgeFromConnection";
import { resolveConnectionHandles } from "@/features/graph/lib/helpers/resolveConnectionHandles";

export function setupEdgeChangesHandler() {
  const nodeStore = useNodeStore();
  const { vueFlowState } = useVueFlowBus();

  const {
    onConnect,
    addEdges,
    onEdgesChange,
    onEdgeUpdate,
    findNode,
    updateEdge,
    getSelectedEdges,
  } = vueFlowState;

  const connectHook = onConnect((connection) => {
    const edge = createEdgeFromConnection(
      resolveConnectionHandles(
        connection,
        findNode(connection.source),
        findNode(connection.target),
      ),
      {
        type: "special",
        updatable: true,
      },
    );

    addEdges(edge);
  });

  const edgeUpdateHook = onEdgeUpdate(({ edge, connection }) => {
    updateEdge(
      edge,
      resolveConnectionHandles(
        {
          ...connection,
          sourceHandle: connection.sourceHandle ?? edge.sourceHandle,
          targetHandle: connection.targetHandle ?? edge.targetHandle,
        },
        findNode(connection.source),
        findNode(connection.target),
      ),
      false,
    );
  });

  const edgesChangeHook = onEdgesChange((changes) => {
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

  return () => {
    connectHook.off();
    edgeUpdateHook.off();
    edgesChangeHook.off();
  };
}

export const isEdgeSelected = (edgeId: string): boolean => {
  const { vueFlowState } = useVueFlowBus();
  const { getSelectedEdges } = vueFlowState;
  return getSelectedEdges.some((edge) => edge.id === edgeId);
};
