<script setup lang="ts">
import { useNodeStore } from "@/features/graph/stores/nodes";

const props = defineProps<{
  nodeId: string;
  size: number;
  label: string;
  weight: number;
  color: string;
}>();

const nodeStore = useNodeStore();

const emit = defineEmits<{
  (e: "update:size", value: number): void;
  (e: "update:weight", value: number): void;
  (e: "update:color", value: string): void;
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
  nodeStore.saveState();
};

const startEditing = () => {
  emit("startEditing");
};

const updateWeight = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (!isNaN(value) && value >= 0) {
    emit("update:weight", value);
  }
  nodeStore.saveState();
};

const selectColor = (color: string) => {
  emit("update:color", color);
  nodeStore.saveState();
};
</script>

<template>
  <div
    class="controls"
    :style="{
      position: 'absolute',
      top: '-90px',
      right: '-20px',
      // display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    }"
  >
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

    <!-- Ввод веса -->
    <div style="display: flex; gap: 5px; align-items: center">
      <input
        type="number"
        :value="weight"
        @input="updateWeight"
        min="0"
        :style="{
          width: '50px',
          padding: '2px',
          textAlign: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }"
      />
    </div>

    <div style="display: flex; gap: 5px">
      <button
        v-for="col in ['#ff0000', '#00ff00', '#0000ff']"
        :key="col"
        @click.stop="selectColor(col)"
        :style="{
          background: col,
          border: col === color ? '2px solid black' : '1px solid #ccc',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.controls {
  opacity: 0;
  display: flex;
  transition: opacity 0.2s ease;
  background: white;
  padding: 8px;
  border-radius: 4px;
}

.vue-flow__node-default:hover .controls {
  opacity: 1;
}
</style>
