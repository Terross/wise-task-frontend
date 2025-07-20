<script setup lang="ts">
import { useCreateExam } from "@/components/exam/stores/createExam"

const createExamParamsStore = useCreateExam()

function deleteTask(taskId: string) {
  createExamParamsStore.removeSelectedTask(taskId)
}
</script>

<template>
  <div class="task-list-wrapper">
    <h2 class="task-list-title">Список задач для экзамена</h2>

    <div v-if="createExamParamsStore.selectedTasks.length">
      <v-card
          v-for="task in createExamParamsStore.selectedTasks"
          :key="task.id"
          class="task-card"
          color="white"
          elevation="3"
      >
        <div class="task-header">
          <v-card-title class="task-card-title">
            {{ task.name || "Название задачи не указано" }}
          </v-card-title>

          <div style="display: flex; column-gap: 10px; padding: 10px">
            <div class="task-category" v-if="task.category">{{ task.category }}</div>
            <div class="task-type" v-if="task.taskType">{{ task.taskType }}</div>
          </div>
        </div>

        <div v-if="task.description" style="padding: 0 10px">{{task.description}}</div>

        <v-card-actions>
          <v-spacer />
          <v-btn
              color="blue-darken-2"
              variant="outlined"
              @click="deleteTask(task.id)"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-alert
        v-else
        type="info"
        variant="tonal"
        color="blue-lighten-4"
    >
      Задачи не выбраны.
    </v-alert>
  </div>
</template>

<style scoped>

.task-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-list-wrapper {
  margin: 30px auto;
  padding: 0 16px;
}

.task-list-title {
  font-size: 20px;
}

.task-card {
  width: 100%;
  margin-bottom: 24px;
}

.task-card-title {
  max-width: 80%;
  text-wrap: wrap;
  font-size: 18px;
  color: #1e3a8a;
}

.task-category,
.task-type {
  font-size: 15px;
  margin-bottom: 8px;
}

@media (max-width: 1000px) {
  .task-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-card-title {
    max-width: 100%;
  }
}
</style>
