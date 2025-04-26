<script setup lang="ts">
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { Ref, toRef } from "vue";
import { CustomNode } from "@/features/graph/types/CustomNode";
import SelectedNodes from "./SelectedNodes.vue";
import { useVueFlow } from "@vue-flow/core";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

const { vueFlowState } = useVueFlowBus();
const { fitView } = vueFlowState;

const selectedNodes: Ref<CustomNode[]> = toRef(
  vueFlowState,
  "getSelectedNodes",
);

const selectedEdges: Ref<CustomEdge[]> = toRef(
  vueFlowState,
  "getSelectedEdges",
);
</script>

<template>
  <div>
    <v-btn density="compact" variant="outlined" @click="fitView()">
      Применить fitView
    </v-btn>

    <SelectedNodes :nodes="selectedNodes" class="mt-4" />
  </div>
</template>
