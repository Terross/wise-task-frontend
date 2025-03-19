<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";

interface Props {
  style?: Record<string, string | number>;
}

const props = defineProps<Props>();

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

const uploadJson = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const data = JSON.parse(content);
        nodeStore.nodes = data.nodes;
        nodeStore.edges = data.edges;
      } catch (error) {
        console.error("Ошибка при чтении файла:", error);
      }
    };
    reader.readAsText(file);
  }
};
</script>

<template>
  <div :style="props.style">
    <div class="buttons-container">
      <v-btn @click="nodeStore.addNode">Добавить вершину</v-btn>
      <v-btn @click="nodeStore.undo">UNDO</v-btn>
      <v-btn @click="printNodesAndEdges">Вывести ноды и ребра</v-btn>
      <v-btn @click="downloadJson">Скачать JSON</v-btn>
      <v-btn @click="nodeStore.toggleIsDirected">Сменить направленность</v-btn>
      <v-btn>
        <label for="upload-json" style="cursor: pointer">Загрузить JSON</label>
        <input
          id="upload-json"
          type="file"
          accept=".json"
          style="display: none"
          @change="uploadJson"
        />
      </v-btn>
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
  </div>
</template>

<!--//TODO: сделать нормально высоту-->
<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.buttons-container {
  background-color: blue;
  padding: 5px 10px;
  display: flex;
  column-gap: 10px;
}

.pinia-flow {
  position: relative;
  width: 100%;
  height: calc(100% - 45px);
  overflow: hidden;
}
</style>
