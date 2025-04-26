<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import SpecialNode from "./SpecialNode.vue";
import SpecialEdge from "./SpecialEdge.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { ref, nextTick, provide } from "vue";
import HelpingModal from "@/features/graph/ui/graph/HelpingModal.vue";
import { Background } from "@vue-flow/background";
import RightClickModal from "@/features/graph/ui/graph/RightClickModal.vue";
import DownloadGraphButton from "@/features/graph/ui/graph/DownloadGraphButton.vue";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";

interface Props {
  style?: Record<string, string | number>;
}

const props = defineProps<Props>();

const nodeStore = useNodeStore();

const { vueFlowState } = useVueFlowBus();
provide("vueFlowState", vueFlowState);

const {
  onConnect,
  onNodeDragStart,
  onPaneContextMenu,
  project,
  addEdges,
  onEdgesChange,
  setEdges,
  onNodesChange,
  fitView,
} = vueFlowState;

onNodesChange((events) => {
  if (events.length < 2) {
    return;
  }
  if (events[0].type === "position") {
    if (events[0].dragging) {
      return;
    }
    const nodesMap = new Map<string, { x: number; y: number }>();
    for (let i = 0; i < events.length; i++) {
      // @ts-ignore
      nodesMap.set(events[i].id, events[i].from); // #TODO: Нормальные типы добавить сюда (оно не хочет работать нормально(()
    }
    nodeStore.nodeMassMovement(nodesMap);
  }
  if (events[0].type === "remove") {
    // @ts-ignore
    nodeStore.nodesMassRemove(events.map((event) => event.id)); // TODO: то же самое
  }
});

onEdgesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === "add") {
      // @ts-ignore
      nodeStore.addEdge(change.item);
    }
  });
});

const contextMenuPosition = ref({ x: 0, y: 0 });
const isHelpModalOpen = ref(false);
const isRightClickModalOpen = ref(false);

onPaneContextMenu(async (event) => {
  event.preventDefault();
  isRightClickModalOpen.value = false;

  await nextTick();

  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const pos = project({ x, y });
  contextMenuPosition.value = { x: pos.x + 29, y: pos.y + 10 };

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

onConnect((connection) => {
  // @ts-ignore
  connection.type = "special";
  addEdges(connection);
});

onNodeDragStart((event) => {
  nodeStore.nodeShift(event.node.id, event.node.computedPosition);
});

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
        :position="contextMenuPosition"
        @close="isRightClickModalOpen = false"
        @add-node="handleAddNodeAtPosition"
      />
      <Background />
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
