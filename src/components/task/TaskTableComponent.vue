<template>
  <v-card>
    <template v-slot:text>
      <v-row>
        <v-text-field
          v-model="search"
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="displayedTasks"
      :group-by="groupBy"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="solveTask(item)">
          mdi-school
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTaskStore } from "@/store/task";
import { Task, TaskType } from "@/__generated__/graphql";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_TASKS } from "@/api/Queries";
import {
  bulkIndexTasks,
  searchTasks,
  SemanticTaskWithScore,
} from "@/services/semanticSearchApi";

export default defineComponent({
  setup() {
    const { tasks } = storeToRefs(useTaskStore());
    const { onResult } = useQuery(GET_ALL_TASKS);
    const headers = [
      { key: "name", title: "Название" },
      { key: "category", title: "Категория" },
      { key: "actions", title: "Решить задачу", sortable: false },
    ];
    const search = ref("");
    const searchResults = ref<Array<Task & { score?: number }>>([]);
    const groupBy = [
      {
        key: "category",
        order: "asc",
      },
    ];
    
    const displayedTasks = computed(() =>
      search.value.trim() ? searchResults.value : tasks.value,
    );

    const fallbackSearch = (query: string): Array<Task & { score?: number }> => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return tasks.value;
      }

      return tasks.value.filter((task) => {
        const haystack = [
          task.name,
          task.description ?? "",
          task.category ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      });
    };

    const syncWithSemanticSearch = async (taskList: Task[]) => {
      const payload = taskList.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description ?? "",
        category: task.category ?? "",
      }));

      try {
        await bulkIndexTasks(payload);
      } catch (error) {
        console.error("Failed to sync tasks with semantic search", error);
      }
    };

    const mapSemanticResults = (
      results: SemanticTaskWithScore[],
    ): Array<Task & { score: number }> =>
      results
        .map((result) => {
          const baseTask = tasks.value.find((task) => task.id === result.id);

          if (!baseTask) {
            console.warn(
              `Task with id ${result.id} not found in store for semantic result`,
            );
            return null;
          }

          return { ...baseTask, score: result.score };
        })
        .filter((task): task is Task & { score: number } => Boolean(task));

    const performSearch = async (value: string) => {
      if (!value.trim()) {
        searchResults.value = [];
        return;
      }

      try {
        const results = await searchTasks(value.trim(), 3);
        searchResults.value = mapSemanticResults(results);
      } catch (error) {
        console.error("Semantic search request failed", error);
        searchResults.value = fallbackSearch(value);
      }
    };

    let searchTimeout: number | undefined;

    watch(
      search,
      (value) => {
        if (searchTimeout) {
          window.clearTimeout(searchTimeout);
        }

        searchTimeout = window.setTimeout(() => performSearch(value), 300);
      },
      { immediate: false },
    );
    
    onResult((response) => {
      console.log(response);

      if (response.data) {
        const normalizedTasks = response.data.getAllTasks.map((task: Task) => ({
          ...task,
          description: task.description ?? "",
        }));

        tasks.value = normalizedTasks;
        syncWithSemanticSearch(normalizedTasks);
      }
    });

    return {
      search,
      groupBy,
      headers,
      tasks,
      displayedTasks,
    };
  },
  methods: {
    solveTask(task: Task) {
      if (task.taskType === TaskType.Graph) {
        this.$router.push("/tasks/graph/" + task.id);
      } else {
        this.$router.push("/tasks/implementation/" + task.id);
      }
    },
  },
});
</script>
