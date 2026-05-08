<template>
  <v-container fluid class="pa-0 page">
    <v-row class="">
      <v-col cols="12" md="3">
        <v-card class="sidebar-card" elevation="1">
          <v-divider></v-divider>
          <v-list nav dense>
            <v-list-item v-for="tab in tabs" :key="tab.key" link @click="activeTab = tab.key"
              :class="{ 'active-tab': activeTab === tab.key }">
              <v-list-item-title>{{ tab.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <div v-if="activeTab === 'info'">
          <v-card class="mb-4" elevation="1">
            <v-card-title class="text-h6">Описание задачи</v-card-title>
            <v-card-text>
              <v-textarea variant="outlined" label="Описание задачи" auto-grow :maxLength="MAX_INPUT_LENGTH" rows="4"
                v-model="taskDescriptionModel"></v-textarea>
            </v-card-text>
          </v-card>
          <task-condition-component />
        </div>

        <div v-else-if="activeTab === 'graph'">
          <v-card class="pa-0" elevation="1">
            <v-card-title class="text-h6">Граф</v-card-title>
            <v-card-text class="pa-0">
              <Graph
                :style="{ width: '100%', minHeight: '520px' }"
                :can-color="taskGraphInput.rule.isColor"
                :graph-type="taskGraphConstructorInfo.graphType"
              />
            </v-card-text>
          </v-card>
        </div>

        <div v-else-if="activeTab === 'plugins'">
          <task-graph-plugin-table-component />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTaskStore } from "@/store/task";
import TaskConditionComponent from "@/components/task/constructor/graph/TaskConditionComponent.vue";
import TaskGraphPluginTableComponent from "@/components/task/constructor/graph/TaskGraphPluginTableComponent.vue";
import Graph from "@/features/graph/ui/graph/Graph.vue";
import { MAX_INPUT_LENGTH } from "@/shared/config/SIZES";

export default defineComponent({
  components: {
    TaskConditionComponent,
    TaskGraphPluginTableComponent,
    Graph,
  },
  setup() {
    const { taskGraphInput, taskGraphConstructorInfo } =
      storeToRefs(useTaskStore());

    const activeTab = ref("info");

    const tabs = computed(() => {
      const items = [
        { key: "info", label: "Основная информация" },
        { key: "plugins", label: "Плагины" },
      ];

      if (taskGraphConstructorInfo.value.isGraphPresent) {
        items.splice(1, 0, { key: "graph", label: "Граф" });
      }

      return items;
    });

    const taskDescriptionModel = computed({
      get() {
        return taskGraphInput.value.description;
      },
      set(value) {
        taskGraphInput.value.description = value;
      },
    });

    watch(
      tabs,
      (availableTabs) => {
        const isActiveStillAvailable = availableTabs.some(
          (tab) => tab.key === activeTab.value,
        );
        if (!isActiveStillAvailable) {
          activeTab.value = availableTabs[0]?.key ?? "info";
        }
      },
      { immediate: true },
    );

    watch(
      () => taskGraphConstructorInfo.value.isGraphPresent,
      (isPresent) => {
        if (!isPresent && activeTab.value === "graph") {
          activeTab.value = "info";
        }
      },
    );

    return {
      tabs,
      activeTab,
      taskDescriptionModel,
      MAX_INPUT_LENGTH,
      taskGraphInput,
      taskGraphConstructorInfo,
    };
  },
});
</script>

<style scoped>
.sidebar-card {
  position: sticky;
  top: 20px;
  height: calc(100vh - 80px);
  overflow-y: auto;
}


.active-tab {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
