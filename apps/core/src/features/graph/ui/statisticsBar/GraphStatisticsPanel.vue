<script setup lang="ts">
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { ref, watchEffect, toRef, computed } from "vue";
import { CustomNode } from "@/features/graph/types/CustomNode";
import SelectedNodes from "./SelectedNodes.vue";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { useNodeStore } from "@/features/graph/stores/nodes";

const { vueFlowState } = useVueFlowBus();
const { fitView } = vueFlowState;
const nodeStore = useNodeStore();

// @ts-ignore
const selectedNodes = toRef(vueFlowState, "getSelectedNodes");
const selectedEdges = computed(() => nodeStore.getSelectedEdges());

console.log("edges", selectedEdges);
</script>

<template>
  <div>
    <v-btn density="compact" variant="outlined" @click="fitView()">
      Применить fitView
    </v-btn>
    <SelectedNodes :nodes="selectedNodes" />
  </div>
</template>
