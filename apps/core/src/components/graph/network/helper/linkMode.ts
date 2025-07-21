import { Ref, computed, ref, watch } from "vue";
import * as vNG from "v-network-graph";
import { addEdge } from "./graph";
import { Graph } from "@/store/graph";

type LinkingState =
  | {
      linking: false;
    }
  | {
      linking: true;
      from: string;
      to?: string;
      pos: { x: number; y: number };
      self: boolean;
    };

export function useLinkMode(
  graph: Ref<vNG.Instance | undefined>,
  isLinkMode: Ref<boolean>,
  activeGraph: Ref<Graph>,
  generateEdgeId: (source: string, target: string) => string
) {
  const state = ref<LinkingState>({
    linking: false,
  });

  function start(nodeId: string, event: PointerEvent) {
    if (!graph.value || !isLinkMode.value) return;
    if (state.value.linking) return;
    event.stopPropagation();
    document.addEventListener("pointerup", cancel);
    document.addEventListener("pointermove", move);
    // translate coordinates: DOM -> SVG
    const point = { x: event.offsetX, y: event.offsetY };
    state.value = {
      linking: true,
      from: nodeId,
      pos: point,
      self: false
    };
  }

  function cancel(event?: PointerEvent) {
    if (!state.value.linking) return;
    event?.stopPropagation();
    document.removeEventListener("pointerup", cancel);
    document.removeEventListener("pointermove", move);
    state.value = { linking: false };
  }

  function move(event: PointerEvent) {
    if (!graph.value) return;
    if (!state.value.linking) return;
    if (state.value.to) return;
    const element = graph.value.$el as HTMLElement;
    const rect = element.getBoundingClientRect();
    // translate coordinates: DOM -> SVG
    const point = { x: event.pageX - rect.left, y: event.pageY - rect.top };
    state.value = {
      ...state.value,
      pos: point,
    };
  }

  function enterNode(nodeId: string) {
    if (!state.value.linking) return;
    state.value = {
      ...state.value,
      to: nodeId,
      self: true
    };
  }

  function leaveNode(nodeId: string) {
    if (!state.value.linking) return;
    if (state.value.to !== nodeId) return;
    state.value = {
      ...state.value,
      to: undefined,
      self: true
    };
  }

  function end(nodeId: string, event: PointerEvent) {
    if (!state.value.linking) return;
    event.stopPropagation();
    document.removeEventListener("pointerup", cancel);
    document.removeEventListener("pointermove", move);
    if (state.value.self) {
      const source = state.value.from;
      const target = nodeId;
      addEdge({
        id: generateEdgeId(source, target),
        color: "BLUE",
        label: '',
        weight: '',
        source: source,
        target: target
      }, activeGraph.value.edges)
      state.value = { ...state.value, self: false };
    }
    
    state.value = { linking: false };
  }

  const temporaryLinkLinePos = computed(() => {
    if (state.value.linking) {
      const n1 = graph.value?.translateFromSvgToDomCoordinates(activeGraph.value.layouts.nodes[state.value.from]) ?? { x: 0, y: 0 };
      if (state.value.to) {
        const n2 = graph.value?.translateFromSvgToDomCoordinates(activeGraph.value.layouts.nodes[state.value.to]) ?? { x: 0, y: 0 };
        return {
          x1: n1.x,
          y1: n1.y,
          x2: n2.x,
          y2: n2.y,
        };
      } else {
        return {
            x1: n1.x,
            y1: n1.y,
            x2: state.value.pos.x,
            y2: state.value.pos.y,
        }
      }
    } else {
      return null;
    }
  });

  watch(isLinkMode, (linkMode) => {
    if (!linkMode && state.value.linking) {
      cancel();
    }
  });

  function nodeHandlers(nodeId: string) {
    return {
      onpointerdown: ($event: PointerEvent) => start(nodeId, $event),
      onpointerup: ($event: PointerEvent) => end(nodeId, $event),
      onpointerenter: () => enterNode(nodeId),
      onpointerleave: () => leaveNode(nodeId),
    };
  }

  return {
    nodeHandlers,
    linkModeState: state,
    temporaryLinkLinePos,
  };
}
