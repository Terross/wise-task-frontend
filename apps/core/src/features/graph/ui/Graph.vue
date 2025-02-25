<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'

import SpecialNode from './SpecialNode.vue'
import SpecialEdge from './SpecialEdge.vue'

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 5 },
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 400, y: 200 },
    data: { label: 'Node 3' },
  },

  {
    id: '4',
    type: 'special',
    position: { x: 400, y: 200 },
    data: {
      label: 'Node 4',
      hello: 'world',
    },
  },
])

const edges = ref<Edge[]>([
  {
    id: 'e1->2',
    source: '1',
    target: '2',
  },

  {
    id: 'e2->3',
    source: '2',
    target: '3',
    animated: true,
  },

  {
    id: 'e3->4',
    type: 'special',
    source: '3',
    target: '4',
    data: {
      hello: 'world',
    }
  },
])
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges">
    <template #node-special="specialNodeProps">
      <SpecialNode v-bind="specialNodeProps" />
    </template>
    <template #edge-special="specialEdgeProps">
      <SpecialEdge v-bind="specialEdgeProps" />
    </template>
  </VueFlow>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>