<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import type { NodeProps } from "@vue-flow/core";
import { useNodeStore } from "@/features/graph/stores/nodes";
import NodeControls from "./NodeButtons.vue";
import NodeHandles from "@/features/graph/ui/graph/NodeHandles.vue";

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
  document.addEventListener("click", handleInteractionOutside);
  document.addEventListener("pointerdown", handleInteractionOutside);
  document.addEventListener("mousedown", handleInteractionOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleInteractionOutside);
  document.removeEventListener("pointerdown", handleInteractionOutside);
  document.removeEventListener("mousedown", handleInteractionOutside);
});

const textColor = computed(() => {
  if (!props.data.color) return "white"; // по умолчанию

  const hex = props.data.color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
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
      backgroundColor: data.color || '#b2b2b2',
      position: 'relative',
    }"
    @click="handleNodeClick"
  >
    <div v-if="!isEditing" :style="{ color: 'white', textAlign: 'center' }">
      <div style="font-size: 20px">{{ data.label }}</div>
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
      :coordinates="{ x: props.position.x, y: props.position.y }"
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
  z-index: 1000;
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
