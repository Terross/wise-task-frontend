import { defineStore } from "pinia";
import { useVueFlow } from "@vue-flow/core";

export const useVueFlowBus = defineStore("flow", () => {
  const vueFlowState = useVueFlow({
    edgesFocusable: true,
    elevateEdgesOnSelect: true,
  });
  return { vueFlowState };
});
