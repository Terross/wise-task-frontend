<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useVueFlow } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";
import { useNodeStore } from "@/features/graph/stores/nodes";
import NodeControls from "./NodeButtons.vue";
import NodeHandles from "@/features/graph/ui/NodeHandles.vue";

const props = defineProps<NodeProps>();

const nodeStore = useNodeStore();

const isEditing = ref(false);
const newTitle = ref(props.data.label || "");
const isControlsVisible = ref(false);

const isSelected = computed(() => props.selected);

const deleteNode = () => {
  nodeStore.removeNode(props.id);
};

const startEditing = () => {
  isEditing.value = true;
  newTitle.value = props.data.label || "";
};

const finishEditing = (e: Event) => {
  e.stopPropagation();
  if (newTitle.value.trim()) {
    const data = nodeStore.getNodeData(props.id);
    if (!data) return;

    nodeStore.updateNodeData(props.id, {
      ...data,
      label: newTitle.value,
    });
  }
  isEditing.value = false;
};

const handleNodeClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) {
    event.stopPropagation();

    if (isSelected.value) {
      nodeStore.unselectNode(props.id);
    } else {
      nodeStore.selectNode(props.id);
    }
    return;
  }
  isControlsVisible.value = !isControlsVisible.value;
};

const handleInteractionOutside = (event: MouseEvent | PointerEvent) => {
  const nodeElement = document.getElementById(props.id);
  if (!nodeElement) return;

  const isClickInside =
    nodeElement.contains(event.target as Node) ||
    document.querySelector(".controls")?.contains(event.target as Node);

  if (!isClickInside && !(event.ctrlKey || event.metaKey)) {
    isControlsVisible.value = false;
  }
};

onMounted(() => {
  console.log("Node mounted:", props.id);
  document.addEventListener("click", handleInteractionOutside);
  document.addEventListener("pointerdown", handleInteractionOutside);
  document.addEventListener("mousedown", handleInteractionOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleInteractionOutside);
  document.removeEventListener("pointerdown", handleInteractionOutside);
  document.removeEventListener("mousedown", handleInteractionOutside);
});
</script>

<template>
  <div
    :id="props.id"
    class="vue-flow__node-default"
    :class="{ 'selected-node': isSelected }"
    :style="{
      width: `${data.size?.width || 100}px`,
      height: `${data.size?.height || 100}px`,
      border: `3px solid ${isSelected ? '#4CAF50' : '#333'}`,
      borderRadius: '50%',
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: data.color || '#00FFFF',
      position: 'relative',
    }"
    @click="handleNodeClick"
  >
    <div v-if="!isEditing" :style="{ color: 'white', textAlign: 'center' }">
      <div>{{ data.label }}</div>
      <div v-if="data.weight !== undefined">Weight: {{ data.weight }}</div>
    </div>

    <input
      v-else
      v-model="newTitle"
      @blur="finishEditing"
      @keyup.enter="finishEditing"
      :style="{
        background: 'transparent',
        fontSize: '16px',
        textDecoration: 'underline',
        border: 'none',
        outline: 'none',
        textAlign: 'center',
        color: 'white',
        width: '80%',
      }"
      autofocus
    />

    <NodeHandles :isEditing="isEditing" />

    <NodeControls
      v-if="isControlsVisible"
      :nodeId="props.id"
      :size="data.size || { width: 100, height: 100 }"
      :label="data.label"
      :weight="data.weight || 0"
      :color="data.color || '#333'"
      @delete="deleteNode"
      @startEditing="startEditing"
    />
  </div>
</template>

<style scoped>
.vue-flow__node-default {
  user-select: none;
  transition: all 0.2s ease;
  box-shadow: none;
}

.vue-flow__node-default:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.selected-node {
  box-shadow: 0 0 10px 2px rgba(76, 175, 80, 0.7);
  transform: scale(1.05);
  z-index: 10;
}
</style>
