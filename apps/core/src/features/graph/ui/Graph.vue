<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";

const nodeStore = useNodeStore();

const { onConnect, addEdges, onNodeDragStop, onConnectEnd } = useVueFlow();

onConnect((connection) => {
  connection.type = "special";
  addEdges(connection);
});

onNodeDragStop(() => {
  nodeStore.saveState();
});

onConnectEnd(() => {
  nodeStore.saveState();
});

const printNodesAndEdges = () => {
  console.log("Nodes:", nodeStore.nodes);
  console.log("Edges:", nodeStore.edges);
};

const downloadJson = () => {
  const data = {
    nodes: nodeStore.nodes,
    edges: nodeStore.edges,
  };
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `graph-data-${Date.now().toString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="buttons-container">
    <v-btn @click="nodeStore.addNode">Добавить вершину</v-btn>
    <v-btn @click="nodeStore.undo">UNDO</v-btn>
    <v-btn @click="printNodesAndEdges">Вывести ноды и ребра</v-btn>
    <v-btn @click="downloadJson">Скачать JSON</v-btn>
    <v-btn @click="nodeStore.toggleIsDirected">Сменить мод</v-btn>
  </div>
  <VueFlow
    :connection-radius="30"
    v-model:nodes="nodeStore.nodes"
    v-model:edges="nodeStore.edges"
    class="pinia-flow"
  >
    <template #node-special="specialNodeProps">
      <SpecialNode v-bind="specialNodeProps" />
    </template>
    <template #edge-special="specialEdgeProps">
      <SpecialEdge v-bind="specialEdgeProps" />
    </template>
  </VueFlow>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.buttons-container {
  display: flex;
  column-gap: 10px;
}
</style>
