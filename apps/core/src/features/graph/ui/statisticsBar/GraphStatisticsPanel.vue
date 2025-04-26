<script setup lang="ts">
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { Ref, toRef } from "vue";
import { CustomNode } from "@/features/graph/types/CustomNode";

const { vueFlowState } = useVueFlowBus();
const { fitView } = vueFlowState;

const selectedNodes: Ref<CustomNode[]> = toRef(
  vueFlowState,
  "getSelectedNodes",
);
</script>

<template>
  <div>
    <v-btn density="compact" variant="outlined" @click="fitView()">
      Применить fitView
    </v-btn>

    <div v-if="selectedNodes.length > 0" class="mt-2">
      <h4>Выбранные узлы:</h4>
      <ul>
        <li v-for="node in selectedNodes" :key="node.id">
          {{ node.id }}
        </li>
      </ul>
    </div>
    <div v-else class="mt-2">Нет выбранных узлов</div>
  </div>
</template>
