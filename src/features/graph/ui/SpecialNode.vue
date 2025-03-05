<script setup lang="ts">
import { ref } from "vue";
import { Position, Handle, useVueFlow } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";
import { useNodeStore } from "@/features/graph/stores/nodes";
import NodeControls from "./NodeButtons.vue";

const props = defineProps<NodeProps>();

const { updateNode, removeNodes } = useVueFlow();
const nodeStore = useNodeStore();

const isEditing = ref(false);
const newTitle = ref(props.data.label || "");

const deleteNode = () => {
  console.log(`Удалили узел с id: ${props.id}`);
  removeNodes(props.id);
};

const startEditing = () => {
  isEditing.value = true;
  newTitle.value = props.data.label || "";
};

const finishEditing = () => {
  if (newTitle.value.trim()) {
    nodeStore.renameNode(props.id, newTitle.value);
  }
  isEditing.value = false;
};

const handleSizeUpdate = (newSize: number) => {
  updateNode(props.id, (node) => ({
    ...node,
    data: {
      ...node.data,
      size: newSize,
    },
  }));
};

const handleWeightUpdate = (newWeight: number) => {
  updateNode(props.id, (node) => ({
    ...node,
    data: {
      ...node.data,
      weight: newWeight,
    },
  }));
};

const handleColorUpdate = (newColor: string) => {
  updateNode(props.id, (node) => ({
    ...node,
    data: {
      ...node.data,
      color: newColor,
    },
  }));
};
</script>

<template>
  <div
      class="vue-flow__node-default"
      :style="{
      width: `${data.size || 100}px`,
      height: `${data.size || 100}px`,
      border: `2px solid ${'#333'}`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: data.color || '#00FFFF',
      position: 'relative',
    }"
  >
    <div v-if="!isEditing" :style="{color: 'white'}">
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
      }"
        autofocus
    />

    <Handle
        type="source"
        id="source-a"
        :position="Position.Right"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />
    <Handle
        type="source"
        id="source-b"
        :position="Position.Left"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />
    <Handle
        type="source"
        id="source-c"
        :position="Position.Top"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />
    <Handle
        type="source"
        id="source-d"
        :position="Position.Bottom"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />

    <Handle
        type="target"
        id="target-a"
        :position="Position.Right"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />
    <Handle
        type="target"
        id="target-b"
        :position="Position.Left"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />
    <Handle
        type="target"
        id="target-c"
        :position="Position.Top"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />
    <Handle
        type="target"
        id="target-d"
        :position="Position.Bottom"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />

    <NodeControls
        :nodeId="props.id"
        :size="data.size || 100"
        :label="data.label"
        :weight="data.weight || 0"
        :color="data.color || '#333'"
        @update:size="handleSizeUpdate"
        @update:weight="handleWeightUpdate"
        @update:color="handleColorUpdate"
        @delete="deleteNode"
        @startEditing="startEditing"
    />
  </div>
</template>

<style scoped>
.vue-flow__node-default {
  user-select: none;
  transition: all 0.2s ease;
}
</style>