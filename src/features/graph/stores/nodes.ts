import {defineStore} from "pinia";
import {NodesStoreState} from "../types/NodesStore";
import {Edge} from "@vue-flow/core";
import {history} from "../lib/history/history"
import {CustomNode} from "@/features/graph/types/CustomNode";
import {CustomEdge} from "@/features/graph/types/Edge";

export const useNodeStore = defineStore("nodes", {
  state: (): NodesStoreState => ({
    nodes: [],
    edges: [],
    historyIndex: -1,
    isDirected: true,
    id: undefined,
    name: "",
  }),

  actions: {
    toggleIsDirected(): void {
      this.isDirected = !this.isDirected;
    },

    addNode(params?: { x: number; y: number }): void {
      const id: string = Date.now().toString();
      const maxNum = this.getMaximumLabel();
      const label = maxNum === -1 ? "1" : maxNum.toString();
      const position = params
        ? { x: params.x, y: params.y }
        : { x: Math.random() * 400, y: Math.random() * 400 };
      this.nodes.push({
        id,
        position: position,
        type: "special",
        data: { label },
      });
      history.onStateUpdate({type: "node:add", properties: {nodeId: id}})
    },

    undo() {
      this.$state = history.undo(this.$state)
    },

    removeNode(id: string) {
      const removedNode: CustomNode | undefined = this.nodes.find(node => node.id === id)
      if (!removedNode) {
        return
      }
      this.nodes = this.nodes.filter(node => node.id !== removedNode.id)
      const edges: CustomEdge[] = this.edges.filter((edge: CustomEdge) => edge.sourceNode.id === removedNode.id || edge.targetNode.id === removedNode.id)
      history.onStateUpdate({type: "node:remove", properties: {node: removedNode, edges: edges}})
    },

    renameNode(id: string, name: string): void {
      const node: CustomNode | undefined = this.nodes.find((node) => node.id === id);
      if (node) {
        node.data.label = name;
      }
    },

    removeEdge(id: string): void {
      this.edges = this.edges.filter((edge) => edge.id !== id);
    },

    updateEdge(id: string, updates: Partial<Edge>): void {
      const edge = this.edges.find((edge) => edge.id === id);
      if (edge) {
        Object.assign(edge, updates);
      }
    },

    getMaximumLabel(): number {
      let maxNumber = -1;
      for (const node of this.nodes) {
        const label = node.data.label;
        if (label && !isNaN(+label)) {
          maxNumber = Math.max(maxNumber, +label);
        }
      }
      return maxNumber === -1 ? 1 : maxNumber + 1;
    },
  },
});
