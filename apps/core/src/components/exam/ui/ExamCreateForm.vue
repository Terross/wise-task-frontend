<script setup lang="ts">
import SelectedTasksParams from "@/components/exam/ui/SelectedTasksParams.vue";
import { useCreateExam } from "../stores/createExam";
import { ExamCRUDProxy } from "@/entities/exam/api/exam.proxy";
import { ref } from "vue";
import { useRouter } from "vue-router";

const examStore = useCreateExam();
const router = useRouter();

const errorMessage = ref("");
const successMessage = ref("");
const showError = ref(false);
const showSuccess = ref(false);

const handleCreateExamClick = async () => {
  // Сбрасываем все сообщения перед проверкой
  showError.value = false;
  errorMessage.value = "";
  showSuccess.value = false;
  successMessage.value = "";

  if (examStore.name.trim() === "") {
    errorMessage.value = "Название экзамена обязательно";
    showError.value = true;
    return false;
  }
  if (examStore.selectedTasks.length === 0) {
    errorMessage.value = "Добавьте хотя бы одно задание";
    showError.value = true;
    return false;
  }
  if (examStore.overAllTime.trim() === "") {
    errorMessage.value = "Укажите время экзамена";
    showError.value = true;
    return false;
  }

  try {
    const result = await ExamCRUDProxy.createExam({
      description: examStore.description || "",
      name: examStore.name,
      overallTime: examStore.overAllTime.trim(),
      tasks: examStore.selectedTasks,
    });

    if (result) {
      successMessage.value = "Экзамен успешно создан!";
      showSuccess.value = true;
      // Сбрасываем ошибки перед переходом
      showError.value = false;
      errorMessage.value = "";
      examStore.reset();
      await router.push("/exam/list");
    } else {
      errorMessage.value = "Ошибка при создании экзамена";
      showError.value = true;
    }
  } catch (error: any) {
    errorMessage.value = "Произошла ошибка: " + error?.message;
    showError.value = true;
  }
};
</script>

<template>
  <div class="container">
    <v-form class="exam-form px-4 mt-3" v-if="!showSuccess">
      <h2>Создание экзамена</h2>

      <v-alert
        v-if="showError"
        type="error"
        dismissible
        @input="showError = false"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-text-field
        v-model="examStore.name"
        label="Название экзамена"
        placeholder="Введите название экзамена"
        :rules="[(v) => !!v || 'Название обязательно']"
        required
        outlined
        class="my-4"
      />

      <v-textarea
        v-model="examStore.description"
        label="Описание экзамена"
        placeholder="Введите описание (необязательно)"
        outlined
        rows="3"
        class="mb-4"
      />

      <v-text-field
        v-model="examStore.overAllTime"
        label="Общее время на экзамен (минут)"
        placeholder="Например: 90"
        :rules="[(v) => !!v || 'Укажите время экзамена']"
        required
        outlined
        class="mb-4"
      />
    </v-form>

    <selected-tasks-params v-if="!showSuccess" />

    <v-btn
      class="mx-4"
      color="primary"
      @click="handleCreateExamClick"
      v-if="!showSuccess"
    >
      Создать экзамен
    </v-btn>

    <v-snackbar v-model="showSuccess" :timeout="3000" color="success">
      {{ successMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showSuccess = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.container {
  padding-inline: 20px;
}
</style>
