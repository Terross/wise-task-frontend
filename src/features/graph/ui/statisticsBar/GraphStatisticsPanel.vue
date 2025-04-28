<script setup lang="ts">
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { toRef } from "vue";
import SelectedNodes from "./SelectedNodes.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import GraphOverall from "@/features/graph/ui/statisticsBar/GraphOverall.vue";

const { vueFlowState } = useVueFlowBus();
const { fitView } = vueFlowState;

// @ts-ignore
const selectedNodes = toRef(vueFlowState, "getSelectedNodes");
</script>

<template>
  <div>
    <v-btn density="compact" variant="outlined" @click="fitView()">
      Применить fitView
    </v-btn>
    <GraphOverall />
    <SelectedNodes :nodes="selectedNodes" />
  </div>
</template>
