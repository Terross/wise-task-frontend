<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { ref } from "vue";
import HelpingModal from "@/features/graph/ui/HelpingModal.vue";

interface Props {
  style?: Record<string, string | number>;
}

const props = defineProps<Props>();

const nodeStore = useNodeStore();

const {
  onConnect,
  addEdges,
  onNodeDragStop,
  onConnectEnd,
  onPaneContextMenu,
  project,
} = useVueFlow();

onPaneContextMenu((event) => {
  event.preventDefault();

  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const pos = project({ x, y });
  nodeStore.addNode({ x: pos.x - 40, y: pos.y - 40 });
});

const isHelpModalOpen = ref(false);

const openHelpModal = () => {
  isHelpModalOpen.value = true;
};

const closeHelpModal = () => {
  isHelpModalOpen.value = false;
};

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

const addNodeToCenter = () => {
  const { width, height } = document
    .querySelector(".pinia-flow")!
    .getBoundingClientRect();
  const centerX = width / 2;
  const centerY = height / 2;
  const pos = project({ x: centerX, y: centerY });
  nodeStore.addNode({
    x: pos.x + Math.random() * 100,
    y: pos.y + Math.random() * 100,
  });
};
</script>

<template>
  <div :style="props.style">
    <div class="buttons-container">
      <v-btn @click="addNodeToCenter">Добавить вершину</v-btn>
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
      <v-btn @click="openHelpModal">Как работать с графом?</v-btn>
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
    <HelpingModal
      :isHelpModalOpen="isHelpModalOpen"
      :closeHelpModal="closeHelpModal"
    />
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";

.buttons-container {
  background-color: blue;
  padding: 5px 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: 10px;
  row-gap: 10px;
}

.pinia-flow {
  position: relative;
  width: 100%;
  min-height: 500px;
  height: calc(100% - 45px);
  overflow: hidden;
}
</style>
