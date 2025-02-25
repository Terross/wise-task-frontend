<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";

const nodeStore = useNodeStore();
const { onConnect, addEdges } = useVueFlow();

onConnect((connection) => {
  addEdges(connection);
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
  <button @click="nodeStore.addNode">Добавить вершину</button>
  <button @click="printNodesAndEdges">Вывести ноды и ребра</button>
  <button @click="downloadJson">Скачать JSON</button>
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
</style>
