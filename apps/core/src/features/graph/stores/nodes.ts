import { defineStore } from "pinia";
import { cloneDeep } from "@apollo/client/utilities";
import {NodesStoreState} from "../types/NodesStore";
import {Edge} from "@vue-flow/core";

export const useNodeStore = defineStore("nodes", {
  state: (): NodesStoreState => ({
    nodes: [],
    edges: [],
    history: [],
    historyIndex: -1,
    isDirected: true,
    id: undefined,
    name: "",
  }),
  actions: {
    saveState(): void {
      if (this.history.length >= 10) {
        this.history.shift();
        this.historyIndex--;
      }

      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push({
        nodes: cloneDeep(this.nodes),
        edges: cloneDeep(this.edges),
      });
      this.historyIndex = this.history.length - 1;
    },
    undo(): void {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        const state = this.history[this.historyIndex];
        this.nodes = cloneDeep(state.nodes);
        this.edges = cloneDeep(state.edges);
      }
    },
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
      this.saveState();
    },
    renameNode(id: string, name: string): void {
      const node = this.nodes.find((node) => node.id === id);
      if (node) {
        node.data.label = name;
        this.saveState();
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
