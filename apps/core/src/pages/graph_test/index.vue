<script lang="ts">
import { defineComponent } from "vue";
import Graph from "@/features/graph/ui/Graph.vue";

export default defineComponent({
  components: { Graph },
});
</script>

<template>
  <Graph
    :style="{
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    }"
  />
</template>
