<script setup lang="ts">

const props = defineProps<{
  nodeId: string;
  size: number;
  label: string;
}>();

const emit = defineEmits<{
  (e: "update:size", value: number): void;
  (e: "delete"): void;
  (e: "startEditing"): void;
}>();

const decreaseSize = () => {
  if (props.size > 50) {
    emit("update:size", props.size - 10);
  }
};

const increaseSize = () => {
  if (props.size < 300) {
    emit("update:size", props.size + 10);
  }
};

const deleteNode = () => {
  emit("delete");
};

const startEditing = () => {
  emit("startEditing");
};
</script>

<template>
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
</template>

<style scoped>
.controls {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.vue-flow__node-default:hover .controls {
  opacity: 1;
}
</style>