<script setup lang="ts">
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'

import SpecialNode from './SpecialNode.vue'
import SpecialEdge from './SpecialEdge.vue'
import {useNodeStore} from "@/features/graph/stores/nodes";


const nodeStore = useNodeStore()


const edges = ref<Edge[]>([])

</script>

<template>
  <button @click="nodeStore.addNode">Добавить вершину</button>
  <VueFlow v-model:nodes="nodeStore.nodes" v-model:edges="edges" class="pinia-flow">
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