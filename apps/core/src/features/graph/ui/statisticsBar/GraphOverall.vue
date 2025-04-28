<script setup lang="ts">
import { useNodeStore } from "@/features/graph/stores/nodes";
import { computed } from "vue";

const nodeStore = useNodeStore();

const graphBaseStatistics = computed(() => nodeStore.statistic);
</script>

<template>
  <div class="statistics-container">
    <h3 class="statistics-title">Статистика</h3>

    <div v-if="graphBaseStatistics" class="statistics-grid">
      <div class="statistic-item">
        <span class="statistic-label">Кол-во вершин:</span>
        <span class="statistic-value">{{
          graphBaseStatistics.nodesAmount
        }}</span>
      </div>

      <div class="statistic-item">
        <span class="statistic-label">Кол-во ребер:</span>
        <span class="statistic-value">{{
          graphBaseStatistics.edgesAmount
        }}</span>
      </div>

      <div class="statistic-item">
        <span class="statistic-label">Кол-во петель: </span>
        <span class="statistic-value">{{
          graphBaseStatistics.selfLoopsAmount
        }}</span>
      </div>

      <div class="statistic-item">
        <span class="statistic-label">Кол-во листьев:</span>
        <span class="statistic-value">{{
          graphBaseStatistics.leafNodesAmount
        }}</span>
      </div>

      <div class="statistic-item">
        <span class="statistic-label">Кол-во "висячих" вершин:</span>
        <span class="statistic-value">{{
          graphBaseStatistics.hangingNodesAmount
        }}</span>
      </div>
    </div>

    <div v-else class="no-statistics">No statistics available</div>
  </div>
</template>

<style scoped>
.statistics-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.statistics-title {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 1.2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.statistic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.statistic-label {
  font-weight: bold;
  color: #555;
}

.statistic-value {
  background-color: #e9e9e9;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.no-statistics {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 12px 0;
}
</style>
