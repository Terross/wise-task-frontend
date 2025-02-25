<script setup lang="ts">
import { ref } from "vue";
import { Position, Handle, useVueFlow } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";
import { useNodeStore } from "@/features/graph/stores/nodes";

const props = defineProps<NodeProps>();

const { updateNode, removeNodes } = useVueFlow();
const nodeStore = useNodeStore();

const size = ref(100);

const isEditing = ref(false);
const newTitle = ref(props.data.label || "");

const decreaseSize = () => {
  if (size.value > 50) {
    size.value -= 10;
    updateNode(props.id, {
      style: { width: `${size.value}px`, height: `${size.value}px` },
    });
  }
};

const increaseSize = () => {
  if (size.value < 300) {
    size.value += 10;
    updateNode(props.id, {
      style: { width: `${size.value}px`, height: `${size.value}px` },
    });
  }
};

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
    nodeStore.renameNode(props.id, newTitle.value); // Обновляем заголовок в хранилище
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
        border: 'none',
        outline: 'none',
        textAlign: 'center',
      }"
      autofocus
    />

    <Handle
      type="source"
      :position="Position.Top"
      :style="{
        z: -1,
        opacity: 0,
        width: `${size / 4}px`,
        height: `${size / 4}px`,
        position: 'absolute',
        top: `20px`,
      }"
    />
    <Handle
      type="source"
      :position="Position.Bottom"
      :style="{
        opacity: 0,
        width: `${size / 4}px`,
        height: `${size / 4}px`,
        position: 'absolute',
        top: `40px`,
      }"
    />

    <Handle
      type="source"
      :position="Position.Left"
      :style="{
        opacity: 0,
        z: -1,
        width: `${size / 4}px`,
        height: `${size / 4}px`,
        position: 'absolute',
        top: `40px`,
      }"
    />

    <Handle
      type="source"
      :position="Position.Right"
      :style="{
        opacity: 0,
        z: -1,
        width: `${size / 4}px`,
        height: `${size / 4}px`,
        position: 'absolute',
        top: `40px`,
      }"
    />

    <div
      class="controls"
      :style="{
        position: 'absolute',
        top: '-30px',
        right: '-20px',
        display: 'flex',
        gap: '5px',
      }"
    >
      <button
        @click.stop="decreaseSize"
        :style="{
          background: 'white',
          border: '1px solid #333',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }"
      >
        -
      </button>
      <button
        @click.stop="increaseSize"
        :style="{
          background: 'white',
          border: '1px solid #333',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }"
      >
        +
      </button>
      <button
        @click.stop="deleteNode"
        :style="{
          background: 'white',
          border: '1px solid #333',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }"
      >
        ×
      </button>
      <button
        @click.stop="startEditing"
        :style="{
          background: 'white',
          border: '1px solid #333',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }"
      >
        ✎
      </button>
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.vue-flow__node-default {
  user-select: none;
  transition: all 0.2s ease;
}

.controls {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.vue-flow__node-default:hover .controls {
  opacity: 1;
}
</style>
