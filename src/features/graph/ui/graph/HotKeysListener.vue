<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

const { vueFlowState } = useVueFlowBus();
const nodeStore = useNodeStore();

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "c") {
    console.log("нажато копирование");
    nodeStore.setCopiedElements(
      vueFlowState.getSelectedNodes as CustomNode[],
      // TODO: НОРМАЛЬНЫЙ ТИП СЮДА ДОБАВИТЬ!!!!!
      vueFlowState.getSelectedEdges as any,
    );
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template></template>
