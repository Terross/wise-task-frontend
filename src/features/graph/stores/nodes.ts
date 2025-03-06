import { defineStore } from "pinia";
import type { Node } from "@/features/graph/types/Node";
import type { Edge } from "@vue-flow/core";

interface NodesStoreState {
  nodes: Node[];
  edges: Edge[];
  isDirected: boolean;
}

export const useNodeStore = defineStore("nodes", {
  state: (): NodesStoreState => ({
    nodes: [
      {
        id: "1",
        position: { x: 250, y: 5 },
        data: { label: "Node 1" },
        type: "special",
      },
    ],
    edges: [],
    isDirected: true,
  }),
  actions: {
    addNode(): void {
      const id: string = Date.now().toString();
      const maxNum = this.getMaximumLabel();
      const label = maxNum === -1 ? "1" : maxNum.toString();
      this.nodes.push({
        id: id,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        type: "special",
        data: { label },
      });
    },
    renameNode(id: string, name: string): void {
      const node = this.nodes.find((x) => x.id === id);
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
      if (this.nodes.length === 0) {
        return 1;
      }

      let maxNumber = -1;

      for (const node of this.nodes) {
        const label = node.data.label;
        if (!label || isNaN(+label)) {
          continue;
        }

        const labelNumber = +label;
        if (labelNumber > maxNumber) {
          maxNumber = labelNumber;
        }
      }

      return maxNumber === -1 ? 1 : maxNumber + 1;
    },
    toggleIsDirected(): void {
      this.isDirected = !this.isDirected;
    },
  },
});
