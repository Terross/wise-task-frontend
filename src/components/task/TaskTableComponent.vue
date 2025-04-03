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
        :search="search"
        :items="tasks"
        :group-by="groupBy"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
            class="me-2"
            size="small"
            @click="solveTask(item)"
        >
          mdi-school
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {storeToRefs} from "pinia";
import {useTaskStore} from "@/store/task";
import {Task, TaskType} from "@/__generated__/graphql";
import {useQuery} from "@vue/apollo-composable";
import {GET_ALL_TASKS} from "@/api/Queries";

export default defineComponent({
  setup() {
    const {tasks} = storeToRefs(useTaskStore())
    const {onResult} = useQuery(GET_ALL_TASKS)
    const headers = [
      {key: 'name', title: 'Назваие'},
      {key: 'category', title: 'Категория'},
      {key: 'actions', title: 'Решить задачу', sortable: false}
    ]
    const search = ref('')
    const groupBy = [
      {
        key: 'category',
        order: 'asc'
      }
    ]
    onResult(response => {
        console.log(response)

      if (response.data) {
        tasks.value = response.data.getAllTasks
      }
    })

    return {
      search,
      groupBy,
      headers,
      tasks
    }
  },
  methods: {
    solveTask(task: Task) {
      if (task.taskType === TaskType.Graph) {
        this.$router.push('/tasks/graph/' + task.id)
      } else {
        this.$router.push('/tasks/implementation/' + task.id)
      }
    }
  }
})
</script>
