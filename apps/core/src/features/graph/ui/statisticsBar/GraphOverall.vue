<script setup lang="ts">
import { useNodeStore } from "@/features/graph/stores/nodes";
import { computed } from "vue";
import { GraphStatistics } from "@/features/graph/types/GraphStatistics";

const nodeStore = useNodeStore();
const graphBaseStatistics = computed(() => nodeStore.statistic);

const items: { key: keyof GraphStatistics; label: string; tooltip: string }[] =
  [
    {
      key: "nodesAmount",
      label: "Кол-во вершин",
      tooltip: "Общее количество вершин в графе",
    },
    {
      key: "edgesAmount",
      label: "Кол-во рёбер",
      tooltip: "Общее количество рёбер в графе",
    },
    {
      key: "selfLoopsAmount",
      label: "Кол-во петель",
      tooltip: "Количество петель (рёбер, соединяющих вершину саму с собой)",
    },
    {
      key: "leafNodesAmount",
      label: "Кол-во листьев",
      tooltip:
        "Количество листьев (степень вершины = 1), не учитывая направленность графа",
    },
    {
      key: "hangingNodesAmount",
      label: "Кол-во висячих вершин",
      tooltip:
        "Количество висячих вершин (не соединённых с другими или сами с собой)",
    },
  ];
</script>

<template>
  <v-card class="statistics-container" max-width="250">
    <v-card-title class="statistics-title"> Статистика графа </v-card-title>

    <v-card-text>
      <v-list v-if="graphBaseStatistics" dense>
        <v-list-item v-for="item in items" :key="item.key">
          <v-list-item-content>
            <div class="d-flex align-center item-row">
              <v-tooltip left>
                <template #activator="{ props: tooltipProps }">
                  <v-icon v-bind="tooltipProps" small class="help-icon mr-1">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <span>{{ item.tooltip }}</span>
              </v-tooltip>

              <span class="label-text">{{ item.label }}:</span>

              <v-spacer />

              <strong class="value-text">
                {{ graphBaseStatistics[item.key] }}
              </strong>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-alert v-else type="info" dense outlined class="mt-2">
        Нет данных для отображения
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.statistics-container {
  margin-top: 10px;
}

.statistics-title {
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 16px 8px;
}

.item-row {
  gap: 4px;
}

.help-icon {
  opacity: 0.6;
  transition: opacity 0.2s;
  color: #757575;
  flex-shrink: 0;
}

.help-icon:hover {
  opacity: 1;
  color: #000;
}

.label-text {
  flex-shrink: 0;
}

.value-text {
  flex-shrink: 0;
  min-width: 24px;
  text-align: right;
}
</style>
