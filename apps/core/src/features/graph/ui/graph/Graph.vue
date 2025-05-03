<script setup lang="ts">
import { VueFlow } from "@vue-flow/core";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { ref, nextTick, provide, onMounted } from "vue";
import HelpingModal from "@/features/graph/ui/graph/HelpingModal.vue";
import Background from "./Background";
import RightClickModal from "@/features/graph/ui/graph/RightClickModal.vue";
import DownloadGraphButton from "@/features/graph/ui/graph/DownloadGraphButton.vue";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { setupNodeChangesHandler } from "@/features/graph/lib/flowEventsHandlers/nodeEventsHandling";
import { setupEdgeChangesHandler } from "@/features/graph/lib/flowEventsHandlers/edgeEventsHandling";
import SettingsDropDown from "@/features/graph/ui/graph/SettingsModal.vue";
import HotKeysListener from "@/features/graph/ui/graph/HotKeysListener.vue";

interface Props {
  style?: Record<string, string | number>;
}

const props = defineProps<Props>();

onMounted(() => {
  setupEdgeChangesHandler();
  setupNodeChangesHandler();
});

const nodeStore = useNodeStore();

const { vueFlowState } = useVueFlowBus();
provide("vueFlowState", vueFlowState);

const { onPaneContextMenu, project, setEdges, fitView } = vueFlowState;

const contextMenuPosition = ref({ x: 0, y: 0 });
const isHelpModalOpen = ref(false);
const isRightClickModalOpen = ref(false);

onPaneContextMenu((event) => {
  event.preventDefault();
  isRightClickModalOpen.value = false;

  const pane = event.currentTarget as HTMLElement;
  const bounds = pane.getBoundingClientRect();

  const modalPosition = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };

  const graphPosition = project(modalPosition);

  contextMenuPosition.value = {
    modalPosition,
    position: graphPosition,
  };

  isRightClickModalOpen.value = true;
});

const handleAddNodeAtPosition = () => {
  nodeStore.addNode({
    x: contextMenuPosition.value.x,
    y: contextMenuPosition.value.y,
  });
};

const openHelpModal = () => {
  isHelpModalOpen.value = true;
};

const closeHelpModal = () => {
  isHelpModalOpen.value = false;
};

const closeRightClickModal = () => {
  isRightClickModalOpen.value = false;
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
        nodeStore.regenerateStatistics();
      } catch (error) {
        console.error("Ошибка при чтении файла:", error);
      }
    };
    reader.readAsText(file);
  }
};

const undo = () => {
  nodeStore.undo();
  setTimeout(fitView, 200);
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

const normalize = () => {
  const edges = nodeStore.normalizeView();
  setEdges(JSON.parse(JSON.stringify(edges)));
  setTimeout(() => fitView({ padding: 5, includeHiddenNodes: true }), 150);
};
</script>

<template>
  <div :style="props.style">
    <div class="buttons-container">
      <v-btn @click="addNodeToCenter">Добавить вершину</v-btn>
      <v-btn @click="undo">UNDO</v-btn>
      <DownloadGraphButton />
      <v-btn @click="nodeStore.toggleIsDirected">Сменить направленность</v-btn>
      <v-btn @click="normalize">Нормализовать граф</v-btn>
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
      <SettingsDropDown />
    </div>
    <VueFlow
      :connection-radius="30"
      v-model:nodes="nodeStore.nodes"
      v-model:edges="nodeStore.edges"
      class="pinia-flow"
      @pane-click="closeRightClickModal"
    >
      <RightClickModal
        v-if="isRightClickModalOpen"
        :modal-position="contextMenuPosition.modalPosition"
        :position="contextMenuPosition.position"
        @close="isRightClickModalOpen = false"
        @add-node="handleAddNodeAtPosition"
      />
      <Background />
      <HotKeysListener />
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
@import "../../../../../node_modules/@vue-flow/core/dist/style.css";
@import "../../../../../node_modules/@vue-flow/core/dist/theme-default.css";

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
