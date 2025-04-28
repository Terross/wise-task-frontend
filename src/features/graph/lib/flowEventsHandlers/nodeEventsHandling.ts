import { useNodeStore } from "@/features/graph/stores/nodes";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { NodeChange } from "@vue-flow/core";

export function setupNodeChangesHandler() {
  const nodeStore = useNodeStore();
  const { vueFlowState } = useVueFlowBus();

  const { onNodesChange } = vueFlowState;

  onNodesChange((events: NodeChange[]) => {
    console.log(events);
    if (events[0].type === "position") {
      if (events[0].dragging) {
        return;
      }
      if (events.length < 2) {
        return;
      }
      const nodesMap = new Map<string, { x: number; y: number }>();
      for (let i = 0; i < events.length; i++) {
        // @ts-ignore
        nodesMap.set(events[i].id, events[i].from);
      }
      nodeStore.nodeMassMovement(nodesMap);
    }
    if (events[0].type === "remove") {
      // @ts-ignore
      nodeStore.nodesMassRemove(events.map((event) => event.id));
    }
  });
}
