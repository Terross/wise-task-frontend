<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { useNodeStore } from "@/features/graph/stores/nodes";

const { vueFlowState } = useVueFlowBus();
const nodeStore = useNodeStore();

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === "c") {
    console.log("нажато копирование");
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
