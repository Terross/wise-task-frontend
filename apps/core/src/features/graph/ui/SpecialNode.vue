<script setup lang="ts">
import { ref } from "vue";
import { Position, Handle, useVueFlow } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";
import { useNodeStore } from "@/features/graph/stores/nodes";
import NodeControls from "./NodeButtons.vue";

const props = defineProps<NodeProps>();

const { updateNode, removeNodes } = useVueFlow();
const nodeStore = useNodeStore();

const size = ref(100);

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
</script>

<template>
  <div
      class="vue-flow__node-default"
      :style="{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'lightblue',
      border: '2px solid #333',
      position: 'relative',
    }"
  >
    <div v-if="!isEditing">
      <div>{{ data.title }}</div>
      <div>{{ data.label }}</div>
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
        :position="Position.Right"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />

    <Handle
        type="target"
        :position="Position.Left"
        :is-valid-connection="() => !isEditing"
        class="full-node-handle"
    />

    <NodeControls
        :nodeId="props.id"
        :size="size"
        :label="props.data.label"
        @update:size="(newSize) => (size = newSize)"
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