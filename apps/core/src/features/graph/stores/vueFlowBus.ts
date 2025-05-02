import { defineStore } from "pinia";
import { useVueFlow } from "@vue-flow/core";

export const useVueFlowBus = defineStore("flow", () => {
  const vueFlowState = useVueFlow({
    edgesFocusable: true,
    elevateEdgesOnSelect: true,
    selectNodesOnDrag: false,
    elevateNodesOnSelect: true,
    autoPanOnNodeDrag: true,
  });
  return { vueFlowState };
});
