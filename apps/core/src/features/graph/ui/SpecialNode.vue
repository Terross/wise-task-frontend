<script setup lang="ts">
import { ref } from 'vue'
import { Position, Handle, useVueFlow } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'

const props = defineProps<NodeProps>()

const { updateNode, removeNodes } = useVueFlow()

// Начальный размер узла
const size = ref(100)

// Функция для уменьшения размера
const decreaseSize = () => {
  if (size.value > 50) {
    size.value -= 10
    updateNode(props.id, { style: { width: `${size.value}px`, height: `${size.value}px` } })
  }
}

// Функция для увеличения размера
const increaseSize = () => {
  if (size.value < 300) {
    size.value += 10
    updateNode(props.id, { style: { width: `${size.value}px`, height: `${size.value}px` } })
  }
}

// Функция для удаления узла
const deleteNode = () => {
  console.log(`Удалили узел с id: ${props.id}`)
  removeNodes(props.id)
}
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
    <!-- Контент узла -->
    <div>{{ data.title }}</div>
    <div>{{ data.label }}</div>

    <!-- Иконки управления (появляются при наведении) -->
    <div
        class="controls"
        :style="{
        position: 'absolute',
        top: '-20px',
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