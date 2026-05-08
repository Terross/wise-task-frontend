import { defineStore } from "pinia";
import { ConnectionMode, useVueFlow } from "@vue-flow/core";

export const GRAPH_VUE_FLOW_ID = "graph-editor";

export const useVueFlowBus = defineStore("flow", () => {
  const vueFlowState = useVueFlow(GRAPH_VUE_FLOW_ID);

  vueFlowState.setState({
    connectionMode: ConnectionMode.Loose,
    edgesUpdatable: true,
    edgesFocusable: true,
    elevateEdgesOnSelect: true,
    selectNodesOnDrag: false,
    elevateNodesOnSelect: true,
  });
  return { vueFlowState };
});
