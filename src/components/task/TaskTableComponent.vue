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
        />
      </v-row>
    </template>
    <v-data-table
        :headers="headers"
        :search="search"
        :items="tasks"
        :group-by="groupBy"
    >
      <template v-slot:item.solve="{ item }">
        <v-icon class="me-2" size="small" @click="solveTask(item)">
          mdi-school
        </v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            v-if="isUserAdmin"
            class="me-2"
            size="small"
            @click="deleteTask(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTaskStore } from "@/store/task";
import { Task, TaskType } from "@/__generated__/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { GET_ALL_TASKS } from "@/api/Queries";
import { DELETE_TASK } from "@/api/Mutations";
import { getUserFromToken } from "@/entities/user/lib/getUserFromToken";
import { UserStorageGetters } from "@/entities/user/storage/getters";
import { useProfileStore } from "@/store/profile";

export default defineComponent({
  name: "TaskList",
  setup() {
    const taskStore = useTaskStore();
    const profileStore = useProfileStore();
    const { tasks } = storeToRefs(taskStore);

    const { onResult } = useQuery(GET_ALL_TASKS);

    const headers = [
      { key: "name", title: "Название" },
      { key: "category", title: "Категория" },
      { key: "solve", title: "Решить задачу", sortable: false },
      { key: "actions", title: "Действия", sortable: false },
    ];

    const search = ref("");
    const groupBy = [
      {
        key: "category",
        order: "asc" as const,
      },
    ];

    onMounted(async () => {
      if (!profileStore.activeUser) {
        const token = await UserStorageGetters.getToken();
        if (token) {
          profileStore.activeUser = await getUserFromToken(token);
        }
      }
    });

    onResult((response) => {
      if (response.data) {
        tasks.value = response.data.getAllTasks.map((task: Task) => ({
          ...task,
          description: task.description[0],
        }));
      }
    });

    return {
      search,
      groupBy,
      headers,
      tasks,
      profileStore,
    };
  },
  computed: {
    isUserAdmin(): boolean {
      return this.profileStore.activeUser?.role === "ADMIN";
    },
  },
  methods: {
    solveTask(task: Task) {
      if (task.taskType === TaskType.Graph) {
        this.$router.push("/tasks/graph/" + task.id);
      } else {
        this.$router.push("/tasks/implementation/" + task.id);
      }
    },
    async deleteTask(task: Task) {
      try {
        const { mutate } = useMutation(DELETE_TASK);
        await mutate({ id: task.id });
        this.tasks = this.tasks.filter((item: Task) => item.id !== task.id);
      } catch (error) {
        console.error("Ошибка при удалении задачи:", error);
      }
    },
  },
});
</script>