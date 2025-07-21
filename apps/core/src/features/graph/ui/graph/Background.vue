<script setup lang="ts">
import { Background } from "@vue-flow/background";
import { graphSettingsStore } from "@/features/graph/stores/graphSettings";
</script>

<template>
  <Background
    :pattern-color="graphSettingsStore.patternColor"
    :gap="graphSettingsStore.patternGap"
    :size="graphSettingsStore.patternSize"
    :variant="graphSettingsStore.patternType"
  />
</template>

<style scoped></style>
