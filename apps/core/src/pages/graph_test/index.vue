<script lang="ts">
import { defineComponent, ref } from "vue";
import Graph from "@/features/graph/ui/graph/Graph.vue";
import GraphStatisticsPanel from "@/features/graph/ui/statisticsBar/GraphStatisticsPanel.vue";

export default defineComponent({
  components: { GraphStatisticsPanel, Graph },
  setup() {
    const expanded = ref(false);
    const pinned = ref(false);

    const handleMouseEnter = () => {
      if (!pinned.value) {
        expanded.value = true;
      }
    };

    const handleMouseLeave = () => {
      if (!pinned.value) {
        expanded.value = false;
      }
    };

    const togglePin = () => {
      pinned.value = !pinned.value;
      if (!pinned.value) {
        expanded.value = false;
      } else {
        expanded.value = true;
      }
    };

    return { expanded, pinned, handleMouseEnter, handleMouseLeave, togglePin };
  },
});
</script>

<template>
  <div style="display: flex; width: 100%; height: 100%; position: relative">
    <div style="flex: 1">
      <Graph
        :style="{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }"
      />
    </div>

    <div
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :style="{
        width: expanded ? '300px' : '20px',
        height: '100%',
        transition: 'width 0.3s',
        background: '#f5f5f5',
        overflow: 'hidden',
        borderLeft: '1px solid #ccc',
        position: 'relative',
      }"
    >
      <div
        style="
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          align-items: center;
        "
      >
        <v-btn
          @click.stop="togglePin"
          size="small"
          :color="'primary'"
          variant="text"
          style="min-width: 0"
        >
          <v-icon start>{{ pinned ? "mdi-pin" : "mdi-pin-outline" }}</v-icon>
          <span style="font-size: 12px">{{
            pinned ? "Открепить" : "Закрепить"
          }}</span>
        </v-btn>
      </div>

      <div v-if="expanded" style="padding: 48px 16px 16px">
        <GraphStatisticsPanel />
      </div>
    </div>
  </div>
</template>
