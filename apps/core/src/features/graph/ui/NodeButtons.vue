<script setup lang="ts">
import { useNodeStore } from "@/features/graph/stores/nodes";
import { COLORS } from "@/features/graph/config/colors";

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
  nodeStore.removeNode(props.nodeId)
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
};

const selectColor = (color: string) => {
  emit("update:color", color);
};
</script>

<template>
  <div class="controls">
    <div class="controls-row">
      <button class="control-button" @click.stop="decreaseSize">-</button>
      <button class="control-button" @click.stop="increaseSize">+</button>
      <button class="control-button" @click.stop="deleteNode">×</button>
      <button class="control-button" @click.stop="startEditing">✎</button>
    </div>

    <div class="controls-row">
      <div class="weight-label">Вес:</div>
      <input
        type="text"
        :value="weight"
        @input="updateWeight"
        @click.stop
        min="0"
        class="weight-input"
      />
    </div>

    <div class="controls-row">
      <button
        v-for="(key, value) in COLORS"
        :key="props.nodeId + 'color_picker' + key"
        @click.stop="selectColor(value)"
        :class="['color-button', { active: value === color }]"
        :style="{ background: value }"
      />
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  position: absolute;
  bottom: 110%;
  left: 30px;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-button {
  background: white;
  border: 1px solid #333;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.2s ease;
}

.control-button:hover {
  background: #f0f0f0;
}

.weight-label {
  margin-right: 5px;
  font-size: 14px;
}

.weight-input {
  width: 50px;
  padding: 4px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.color-button {
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.color-button.active {
  border: 2px solid black;
}
</style>
